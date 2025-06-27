# 🧠 Cancer Support & Risk Detection Platform

An AI-powered web application designed to provide early cancer risk prediction, connect patients with expert oncologists, offer treatment tracking, emotional wellness tools, and a supportive patient community.

---

## 🚀 Features

- ✅ **AI Cancer Risk Predictor** – Upload MRI images to detect possible brain tumors using a trained deep learning model.
- 🩺 **Expert Oncologist Access** – Search and connect with verified doctors for appointments and consultations.
- 📅 **Treatment Tracker** – Manage medications, treatment schedules, and receive reminders.
- 🧘‍♀️ **Emotional Wellness Journal** – Track emotional health with guided journaling and AI mental wellness support.
- 💬 **Patient Community** – Share stories, find support, and connect with others on the same journey.
- 📊 **Personal Dashboard** – Visualize health progress, journaling history, and upcoming reminders.

---

## 🎯 Problem Statement

Late detection of cancer, limited access to specialists, and lack of emotional support remain critical challenges in healthcare. This project aims to bridge that gap using AI and digital tools.

---

## 🌟 Vision & Mission

**Vision:**  
To democratize early cancer detection and empower healing through AI and community.

**Mission:**  
To deliver accessible AI tools, expert medical support, and emotional well-being resources for cancer fighters and survivors.

---

## 🧠 Machine Learning Model

- **Model Type**: CNN (Convolutional Neural Network)
- **Framework**: TensorFlow / Keras
- **Input**: MRI Brain Images (128x128 px)
- **Classes**: `glioma`, `pituitary`, `meningioma`, `no tumor`

### 🔍 Prediction Flow

```python
img = load_img(path, target_size=(128, 128))
img_array = img_to_array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)
prediction = model.predict(img_array)
```

---

## 🛠️ Tech Stack

| Frontend         | Backend         | AI / ML       | APIs / Services     |
|------------------|------------------|---------------|----------------------|
| React, Tailwind  | Node.js, Express | TensorFlow    | OpenAI (chat), ZegoCloud (video), Firebase (auth) |

---

## 📂 Project Structure

```
📦 project-root/
├── 📁 models/              # Trained ML models (.h5 files)
├── 📁 uploads/             # Temp uploaded images
├── 📁 templates/           # HTML templates (Flask)
├── main.py                # Flask backend
├── frontend/              # React frontend app
├── README.md              # Project documentation
```

---

## 🚧 Challenges Encountered

- TensorFlow compatibility with Python 3.13  
- Limited availability of clean, annotated medical datasets  
- Ensuring a secure, HIPAA-friendly data flow  
- Designing a UI that is medically informative yet emotionally comforting  
- Integration of real-time video and notification services  

---

## 💡 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cancer-support-platform.git
cd cancer-support-platform
```

### 2. Setup the Python Backend (Flask + ML)

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
python main.py
```

### 3. Run the React Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Future Enhancements

- Integrate EHR (Electronic Health Records)
- Add multi-language support
- Expand prediction to other cancer types
- Role-based dashboard for doctors and patients
- Native mobile apps (React Native)

---

## 🙏 Acknowledgements

- Kaggle MRI Brain Tumor Dataset  
- TensorFlow & Keras Community  
- OpenAI for AI-enhanced wellness tools  
- ZegoCloud for video call APIs  
- Firebase for secure auth & real-time database

---

## 📬 Contact

**Project Team:** *Your Names*  
**Email:** youremail@example.com  
**GitHub:** [@yourusername](https://github.com/yourusername)

---

> *“Fighting cancer with compassion, connection, and code.”*
