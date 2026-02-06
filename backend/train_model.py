import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import os

# Set paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'f2.csv')
ARTIFACTS_DIR = os.path.join(BASE_DIR, 'model_artifacts')

os.makedirs(ARTIFACTS_DIR, exist_ok=True)

def load_data(file_path):
    print(f"Loading data from {file_path}")
    return pd.read_csv(file_path)

def train_and_save():
    # Load Data
    data = load_data(DATA_PATH)
    
    # Separate features and target
    X = data[['Temparature', 'Humidity', 'Moisture', 'Soil_Type',
              'Crop_Type', 'Nitrogen', 'Potassium', 'Phosphorous']]
    y = data['Fertilizer']
    
    # Encoders
    le_soil = LabelEncoder()
    le_crop = LabelEncoder()
    le_fertilizer = LabelEncoder()
    
    # Fit Encoders
    X['Soil_Type'] = le_soil.fit_transform(X['Soil_Type'])
    X['Crop_Type'] = le_crop.fit_transform(X['Crop_Type'])
    y_encoded = le_fertilizer.fit_transform(y)
    
    # Ensure numeric
    for col in X.columns:
        if X[col].dtype == 'object':
            X[col] = pd.to_numeric(X[col], errors='coerce')
    
    # Train Model
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.3, random_state=42
    )
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred) * 100
    print(f"Model Accuracy: {accuracy:.2f}%")
    
    # Save Artifacts
    print("Saving artifacts...")
    # Saving as rf_model.pkl
    joblib.dump(model, os.path.join(ARTIFACTS_DIR, 'rf_model.pkl'))
    joblib.dump(le_soil, os.path.join(ARTIFACTS_DIR, 'le_soil.pkl'))
    joblib.dump(le_crop, os.path.join(ARTIFACTS_DIR, 'le_crop.pkl'))
    joblib.dump(le_fertilizer, os.path.join(ARTIFACTS_DIR, 'le_fertilizer.pkl'))
    
    # Save unique values for frontend dropdowns
    metadata = {
        'soil_types': sorted(le_soil.classes_.tolist()),
        'crop_types': sorted(le_crop.classes_.tolist())
    }
    joblib.dump(metadata, os.path.join(ARTIFACTS_DIR, 'metadata.pkl'))
    
    print(f"Artifacts saved to {ARTIFACTS_DIR}")

if __name__ == "__main__":
    train_and_save()
