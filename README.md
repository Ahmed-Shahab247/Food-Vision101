**Food Vision 101**
A deep learning computer vision project built to classify images into 101 distinct food categories using transfer learning and fine-tuning.

This repository contains the core machine learning engine that handles high-accuracy food recognition, optimized for real-world deployment.

**Features**
101-Class Classification: Recognizes 101 different culinary categories, from sushi and pizza to apple pie.
Transfer Learning Engine: Built using an EfficientNetV2B0 backbone pretrained on ImageNet.
High Performance: Reaches ~83% top-1 accuracy on the validation dataset.
Production Ready: Optimized and structured to seamlessly integrate with full-stack web applications and production backends.
**Dataset**
The model is trained on the benchmark Food-101 dataset:

Size: 101,000 total images (75,000 training, 26,000 validation).
Structure: 101 distinct categories, with 1,000 images per class.
Source: Publicly available via TensorFlow Datasets.
**Tech Stack**
Language: Python
Frameworks: TensorFlow 2.x / Keras
Pre-trained Model: EfficientNetV2B0
Environment: Google Colab
Training Workflow
**Data Pipeline**
Images re-scaled and batched using the tf.data API for high-throughput memory caching and prefetching.
Data augmentation layers introduced to minimize overfitting and improve model generalization.
Fine-Tuning Strategy
Phase 1 (Feature Extraction): Froze the base EfficientNetV2B0 weights and trained custom dense output layers to adapt to the 101 classes.
Phase 2 (Fine-Tuning): Unfroze the top layers of the base model and re-trained with a highly reduced learning rate to subtly adapt internal feature maps.
Results
Final Accuracy: Achieved ~83% top-1 accuracy on unseen validation data.
**Future Roadmap**
[ ] Advanced Augmentation: Integrate deeper spatial transformations.
[ ] Scaling Up: Benchmark against larger model variants (e.g., EfficientNetV2B3).
[ ] Quantization: Convert the final model to TensorFlow Lite (.tflite) for low-latency mobile inference.
[ ] Web Integration: Connect the weights directly to an interactive web frontend.
