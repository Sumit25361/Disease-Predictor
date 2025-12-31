# 🏥 AI Medical Disease Predictor

A full-stack AI-powered healthcare application that helps users identify potential diseases based on symptoms and skin images. This project combines Machine Learning with a modern web interface to provide preliminary health insights.

![Project Banner](https://via.placeholder.com/1000x300?text=AI+Medical+Disease+Predictor)

## ✨ Features

- **🩺 Symptom Checker**: Select from a range of symptoms (Fever, Cough, Fatigue, etc.) to get an instant disease prediction using a trained Random Forest model.
- **📸 Photo Diagnosis**: Upload an image of a skin condition to receive an AI-based analysis (e.g., Acne, Melanoma, Eczema).
- **🔐 User Authentication**: Secure Login and Registration system to manage user access.
- **📋 History Tracking**: Saves all previous predictions and uploaded images for users to review later.
- **📱 Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices.
- **📄 PDF Reports**: Generate and print detailed medical reports for predictions.

## 🛠️ Tech Stack

### Frontend
- **React.js**: For building a dynamic and responsive user interface.
- **Vite**: Fast build tool and development server.
- **CSS3**: Custom styling for a clean, medical-grade aesthetic.

### Backend
- **Flask (Python)**: RESTful API to handle predictions and user data.
- **MongoDB**: NoSQL database for flexible storage of user profiles and history.
- **JWT**: JSON Web Tokens for secure authentication.

### Machine Learning
- **Scikit-learn**: Used for training the Disease Prediction model.
- **Pandas/NumPy**: Data manipulation and processing.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js & npm installed
- Python 3.x installed
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/Sumit25361/Disease-Predictor.git
cd Disease-Predictor
```

### 2. Backend Setup
```bash
cd backend
# Install Python dependencies
pip install -r requirements.txt

# Run the Flask Server
python app.py
```
*The backend will run on `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd frontend
# Install Node dependencies
npm install

# Run the React App
npm run dev
```
*The frontend will run on `http://localhost:5173`*

### 4. Environment Variables
Create a `.env` file in the `frontend` folder to point to your backend:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Deployment

This project is ready for deployment!
- **Frontend**: Vercel, Netlify, or Render.
- **Backend**: Render, Heroku, or AWS.

*See `deployment_guide.md` in this repository for detailed deployment instructions.*

## ⚠️ Disclaimer
This application is for **educational purposes only**. It implies a preliminary check and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
