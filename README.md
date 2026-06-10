# 🍔 Food Vision 101 – Food Recognition & Calorie Estimation

A deep learning computer vision project built to classify food images into **101 distinct categories** using **Transfer Learning** and **Fine-Tuning**.

The application allows users to upload an image of food, automatically identifies the food type, and returns estimated nutritional information such as calorie content.

This repository contains the core machine learning engine responsible for high-accuracy food recognition, designed with scalability and real-world deployment in mind.

---

## 📌 Project Overview

Food Vision 101 leverages the power of **EfficientNetV2B0** and **TensorFlow/Keras** to accurately identify food items from images.

Once a food item is detected, the application can map the prediction to nutritional data and provide users with an estimated calorie count, making it useful for:

* 🥗 Calorie Tracking
* 💪 Fitness & Diet Planning
* 🍽️ Food Recognition
* 📱 Health & Nutrition Applications

The model is trained on the popular **Food-101 Dataset** and achieves approximately **83% Top-1 Validation Accuracy** after transfer learning and fine-tuning.

---

## ✨ Features

* 🍕 **101-Class Food Classification**

  * Recognizes 101 different food categories.

* 🔍 **Food Detection**

  * Identifies the food item from an uploaded image.

* 🔥 **Calorie Estimation**

  * Returns estimated calorie information based on the detected food category.

* 🧠 **Transfer Learning Engine**

  * Built using an EfficientNetV2B0 backbone pretrained on ImageNet.

* 🎯 **High Accuracy**

  * Achieves approximately **83% Top-1 Accuracy** on the validation dataset.

* ⚡ **Optimized Training Pipeline**

  * Uses TensorFlow's `tf.data` API with caching, batching, and prefetching.

* 🚀 **Production Ready**

  * Structured to integrate seamlessly with web applications, APIs, and mobile deployments.

---

## 🗂️ Dataset

The model is trained using the **Food-101 Dataset**.

| Property             | Details             |
| -------------------- | ------------------- |
| 📊 Total Images      | 101,000             |
| 🏋️ Training Images  | 75,000              |
| ✅ Validation Images  | 26,000              |
| 🍽️ Classes          | 101 Food Categories |
| 🖼️ Images per Class | 1,000               |
| 📚 Source            | TensorFlow Datasets |

---

## 🛠️ Tech Stack

| Category                   | Technology       |
| -------------------------- | ---------------- |
| 🐍 Language                | Python           |
| 🤖 Deep Learning Framework | TensorFlow 2.x   |
| 🧩 API                     | Keras            |
| 🏗️ Backbone Model         | EfficientNetV2B0 |
| ☁️ Development Environment | Google Colab     |

---

## 🔄 Training Workflow

### 📥 Data Pipeline

The dataset is processed using TensorFlow's high-performance data pipeline.

#### Key Steps

* Resize and batch images using `tf.data`
* Cache datasets in memory for faster access
* Prefetch batches to maximize GPU utilization
* Apply data augmentation techniques to improve model generalization

#### Augmentation Techniques

* Random Horizontal Flip
* Random Rotation
* Random Zoom
* Random Height & Width Adjustments

---

### 🧠 Transfer Learning

The training process is divided into two phases.

#### Phase 1: Feature Extraction

* Load pretrained **EfficientNetV2B0** weights from ImageNet
* Freeze the base model layers
* Train custom classification layers for Food-101 categories

**Goal:** Learn food-specific classification while preserving pretrained visual features.

---

#### Phase 2: Fine-Tuning

* Unfreeze the upper layers of EfficientNetV2B0
* Reduce the learning rate significantly
* Continue training to adapt deeper feature representations

**Goal:** Improve classification accuracy through task-specific feature refinement.

---

## 🏗️ Model Architecture

```text
Input Image
      │
      ▼
EfficientNetV2B0 (Pretrained on ImageNet)
      │
      ▼
Global Average Pooling
      │
      ▼
Dense Classification Layer
      │
      ▼
101 Food Categories
```

---

## 📈 Results

| Metric                       | Value            |
| ---------------------------- | ---------------- |
| 🎯 Top-1 Validation Accuracy | ~83%             |
| 🍽️ Number of Classes        | 101              |
| 🧠 Base Architecture         | EfficientNetV2B0 |

The model demonstrates strong performance on unseen validation images and generalizes well across a diverse set of food categories.

---

## 🚀 Application Workflow

1. 📸 User uploads a food image.
2. 🧠 Model predicts the food category.
3. 🍽️ Food type is identified from 101 possible classes.
4. 🔥 Calorie information is retrieved from the nutrition database.
5. 📱 Results are displayed to the user.

---

## 🎓 Key Concepts Demonstrated

* Transfer Learning
* Fine-Tuning Deep Neural Networks
* Computer Vision
* Image Classification
* TensorFlow Data Pipelines
* Data Augmentation
* EfficientNet Architectures
* Deep Learning Optimization
* Food Recognition Systems

---

## 🚀 Future Roadmap

### 🔬 Model Improvements

* [ ] Advanced data augmentation techniques
* [ ] MixUp and CutMix augmentation
* [ ] Hyperparameter optimization
* [ ] Improved learning rate scheduling

### 📈 Scaling Experiments

* [ ] Benchmark EfficientNetV2B1
* [ ] Benchmark EfficientNetV2B2
* [ ] Benchmark EfficientNetV2B3

### 📱 Deployment

* [ ] Convert model to TensorFlow Lite (`.tflite`)
* [ ] Optimize for mobile inference
* [ ] Export to TensorFlow SavedModel format

### 🌐 Full-Stack Integration

* [ ] Create REST API endpoints
* [ ] Build an interactive web frontend
* [ ] Real-time image upload and prediction
* [ ] Cloud deployment support

---
