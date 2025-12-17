import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# Create dummy data if no data exists
def create_dummy_data():
    # Symptoms: 1 = Yes, 0 = No
    data = {
        'Fever':          [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
        'Cough':          [1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0],
        'Fatigue':        [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
        'Diff_Breathing': [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        'Headache':       [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        'Sore_Throat':    [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        'Body_Aches':     [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0],
        'Runny_Nose':     [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        'Disease':        ['Flu', 'Common Cold', 'COVID-19', 'COVID-19', 'Healthy', 'Flu', 'Common Cold', 'Healthy', 'COVID-19', 'Pneumonia', 'Common Cold', 'Flu', 'Healthy', 'Healthy', 'COVID-19']
    }
    return pd.DataFrame(data)

def train_model():
    print("Generating dummy data...")
    df = create_dummy_data()
    
    # Updated feature list
    features = ['Fever', 'Cough', 'Fatigue', 'Diff_Breathing', 'Headache', 'Sore_Throat', 'Body_Aches', 'Runny_Nose']
    
    X = df[features]
    y = df['Disease']
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X, y)
    
    # Ensure models directory exists
    model_dir = os.path.join('backend', 'models')
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    model_path = os.path.join(model_dir, 'model.pkl')
    print(f"Saving model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print("Model saved successfully!")

if __name__ == '__main__':
    train_model()
