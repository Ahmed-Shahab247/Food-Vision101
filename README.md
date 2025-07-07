# 🍔 Food Vision 101

This project is a deep learning experiment where I built an image classifier to recognize food images from the **Food101** dataset using **transfer learning**.  
It started as an exercise to learn about TensorFlow, but turned into something fun to explore real-world computer vision.

---

## ✏️ **What I did**
- Used the **Food101** dataset (101 different food categories, ~101,000 images)
- Applied **transfer learning** with EfficientNet
- Fine-tuned the model to achieve about **83% accuracy**
- Tested the model by making predictions on new food images

---

## 📊 **Results**
- Final accuracy: ~83% on the validation set
- The model can classify foods like sushi, apple pie, and pizza fairly well  
- There’s still room to improve with more augmentation or larger models, but for now I kept it simple

---

## ⚙️ **Tech stack**
- Python
- TensorFlow / Keras
- Google Colab

---

## 📌 **Dataset**
- Food101 dataset originally created by researchers at ETH Zurich  
- Publicly available via [TensorFlow Datasets](https://www.tensorflow.org/datasets/catalog/food101)  
- Contains images scraped from foodspotting.com

---


## ✅ **Future ideas**
- Add more data augmentation
- Try a larger EfficientNet variant
- Deploy as a web app to predict your own food images

---


