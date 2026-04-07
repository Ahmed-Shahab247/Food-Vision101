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

// Global Supabase client (used for general tasks)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Helper to create an Authenticated Client for specific user requests
const getAuthClient = (token) => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 1. ANALYSE FOOD (The AI Model Part)
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
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// 2. SAVE LOG ENTRY
app.post('/save-log', async (req, res) => {
  try {
    const { food, calories, confidence, token } = req.body;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const userSupabase = getAuthClient(token);
    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) throw new Error("Invalid session");

    const { data, error } = await userSupabase
      .from('food_logs')
      .insert([{ food, calories, confidence, user_id: user.id }])
      .select();

    if (error) throw error;
    res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    console.error("Save Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. GET TODAY'S LOGS
app.get('/get-logs', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorised' });

    const userSupabase = getAuthClient(token);
    const { data: { user } } = await userSupabase.auth.getUser();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await userSupabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', today.toISOString())
      .order('logged_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// 4. DELETE LOG ENTRY
app.delete('/delete-log/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorised' });

    const userSupabase = getAuthClient(token);
    const { error } = await userSupabase
      .from('food_logs')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// 5. UPDATE DAILY GOAL (Using Upsert)
app.post('/set-goal', async (req, res) => {
  try {
    const { goal, token } = req.body;
    const userSupabase = getAuthClient(token);
    const { data: { user } } = await userSupabase.auth.getUser();

    const { error } = await userSupabase
      .from('profiles')
      .upsert({ id: user.id, daily_goal: goal });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Goal Error:", err.message);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// 6. GET PROFILE
app.get('/get-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ daily_goal: 2000 });

    const userSupabase = getAuthClient(token);
    const { data: { user } } = await userSupabase.auth.getUser();

    const { data, error } = await userSupabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    res.json(data || { daily_goal: 2000 });
  } catch (err) {
    res.json({ daily_goal: 2000 }); // Default fallback
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});