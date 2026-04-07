const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ANALYSE FOOD
app.post('/log-food', upload.single('image'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const aiRes = await axios.post(process.env.MODEL_URL, form, {
      headers: form.getHeaders()
    });

    const { food, confidence } = aiRes.data;

    const usdaRes = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(food)}&pageSize=1&api_key=${process.env.USDA_KEY}`
    );
    const item = usdaRes.data.foods?.[0];
    const calories = item?.foodNutrients?.find(n => n.nutrientName === 'Energy')?.value ?? null;

    res.json({ food, confidence, calories });

  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// SAVE LOG ENTRY (logged in users)
app.post('/save-log', async (req, res) => {
  try {
    const { food, calories, confidence, token } = req.body;

    if (!token) return res.status(401).json({ error: "No token provided" });

    // 1. Create a "User-Specific" client using their token
    const userSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY, // Use Anon key here
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // 2. Get the User ID from the token automatically
    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) throw new Error("Invalid token");

    // 3. Insert the log (RLS will now allow this because it sees the User)
    const { data, error } = await userSupabase
      .from('food_logs')
      .insert([
        { 
          food, 
          calories, 
          confidence, 
          user_id: user.id 
        }
      ]);

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Save Log Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET TODAY'S LOGS (logged in users)
app.get('/get-logs', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorised' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', today.toISOString())
      .order('logged_at', { ascending: false });

    if (error) throw error;
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// DELETE LOG ENTRY
app.delete('/delete-log/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorised' });

    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', user.id);

    if (error) throw error;
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

// UPDATE DAILY GOAL
app.post('/set-goal', async (req, res) => {
  try {
    const { goal, token } = req.body;
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorised' });

    const { error } = await supabase
      .from('profiles')
      .update({ daily_goal: goal })
      .eq('id', user.id);

    if (error) throw error;
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// GET PROFILE (including daily goal)
app.get('/get-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorised' });

    const { data, error } = await supabase
      .from('profiles')
      .select('daily_goal')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});