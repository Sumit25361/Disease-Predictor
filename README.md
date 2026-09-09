# AI Medical Disease Predictor

## Project Description
The **AI Medical Disease Predictor** is a modern full-stack healthcare application designed to assist users in identifying potential diseases based on their symptoms or skin conditions. By leveraging Machine Learning (Random Forest) and deep learning, it provides immediate preliminary health insights. The system features a responsive React dashboard for users to check symptoms, view history, and manage their profile, while a Flask backend handles secure authentication and model inference.

## Key Features

### 1. User Dashboard
-   **Centralized Hub:** A clean, responsive interface (`Home.jsx`) where users can access all main tools: Symptom Checker, Skin Analysis, and History.
-   **Quick Navigation:** Seamless routing to different modules using React Router.

### 2. Disease Prediction (Symptom Checker)
-   **Symptom Input:** Select from a comprehensive list of symptoms (e.g., Fever, Cough, Fatigue) to analyze health status (`Home.jsx`).
-   **AI Analysis:** Uses a trained Random Forest classifier to predict potential diseases with high accuracy.
-   **Immediate Results:** Displays prediction results instantly along with confidence levels.

### 3. Skin Disease Detection
-   **Image Upload:** Users can upload images of skin issues (`Home.jsx`).
-   **Visual Analysis:** Analyzing the image to detect conditions like Acne, Melanoma, or Eczema.

### 4. User Management
-   **Registration:** Secure sign-up process for new users (`Register.jsx`).
-   **Authentication:** Safe login system using JWT tokens to protect user data (`Login.jsx`).

### 5. Medical History
-   **Records:** View a complete history of past predictions and analyses (`History.jsx`).
-   **Tracking:** Helps users monitor their health trends over time.

### 6. Security
-   **Data Protection:** User passwords are hashed, and sessions are secured with JSON Web Tokens.
-   **Backend Validation:** APIs in `app.py` ensure that only authenticated requests can access sensitive history data.

## System Architecture
-   **Frontend:** React.js, Vite, CSS3 (for styling and responsiveness).
-   **Backend:** Flask (Python) for API endpoints and ML model serving.
-   **Database:** MongoDB (via MongoDB Atlas) for storing user credentials and prediction logs.
-   **Machine Learning:** Scikit-learn (Random Forest) and Pandas for data processing.

## Workflow
1.  **Registration/Login:** The user creates an account or logs in via `Login.jsx`.
2.  **Dashboard:** Upon successful authentication, the user lands on the Home Dashboard.
3.  **Prediction:**
    -   **Symptom Check:** User selects symptoms -> backend model predicts disease.
    -   **Skin Check:** User uploads photo -> backend model analyzes image.
4.  **Results:** The prediction is displayed and automatically saved to the user's history in MongoDB.
5.  **History:** Users can review their past queries in the History section.

## Technologies Used
-   **Frontend:** React.js, JavaScript, HTML5, CSS3, Vite
-   **Backend:** Python, Flask, Flask-CORS
-   **Database:** MongoDB
-   **ML/Data Science:** Scikit-learn, NumPy, Pandas
-   **Deployment:** Vercel (Frontend), Render (Backend)

## Setup Instructions
1.  **Backend Setup:**
    -   Navigate to the backend folder: `cd backend`
    -   Install dependencies: `pip install -r requirements.txt`
    -   Run the server: `python app.py`

2.  **Frontend Setup:**
    -   Navigate to the frontend folder: `cd frontend`
    -   Install dependencies: `npm install`
    -   Start the dev server: `npm run dev`

3.  **Configuration:**
    -   Ensure MongoDB is running or update the connection string in `app.py`.
    -   Create a `.env` in frontend if you need to override the API URL.

4.  **Access:** Open `http://localhost:5173` to use the application.
