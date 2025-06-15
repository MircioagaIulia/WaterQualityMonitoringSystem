import json
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import os
import joblib  
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import StackingRegressor
from sklearn.ensemble import StackingRegressor


# Load JSON file
with open("dataset.json", "r") as f:
    data = json.load(f)

# Convert into DataFrame
df = pd.DataFrame.from_dict(data, orient="index")

# Convert index into date-time format 
df.index = pd.to_datetime(df.index, format="%Y-%m-%d_%H-%M-%S")

# Sort data 
df = df.sort_index()


# Plot TDS evolution over time
sns.set(style="whitegrid")
plt.figure(figsize=(10, 6))
plt.plot(df.index, df['TDS'], label='TDS', color='blue')
plt.title('TDS evolution over time')
plt.xlabel('Time')
plt.ylabel('TDS (ppm)')
plt.xticks(rotation=25)
plt.legend()
plt.show()


# Plot Temperature evolution over time
sns.set(style="whitegrid")
plt.figure(figsize=(10, 6))
plt.plot(df.index, df['Temperature'], label='Temperature', color='green')
plt.title('Temperature evolution over time')
plt.xlabel('Time')
plt.ylabel('Temperature (°C)')
plt.xticks(rotation=25)
plt.legend()
plt.show()



# Plot Turbidity evolution over time
sns.set(style="whitegrid")
plt.figure(figsize=(10, 6))
plt.plot(df.index, df['Turbidity'], label='Turbidity', color='purple')
plt.title('Turbidity evolution over time')
plt.xlabel('Time')
plt.ylabel('Turbidity (NTU)')
plt.xticks(rotation=25)
plt.legend()
plt.show()



# Plot pH evolution over time
sns.set(style="whitegrid")
plt.figure(figsize=(10, 6))
plt.plot(df.index, df['pH'], label='pH', color='orange')
plt.title('pH evolution over time')
plt.xlabel('Time')
plt.ylabel('pH ')
plt.xticks(rotation=25)
plt.legend()
plt.show()


plt.figure(figsize=(10, 6))
sns.heatmap(df.corr(), annot=True, cmap='Blues', fmt=".2f")
plt.title("Correlation matrix")
plt.show()



#Check missing data
print(df.isnull().sum())


# Remove the outliers using the IQR rule (Interquartile Range)
Q1 = df.quantile(0.25)
Q3 = df.quantile(0.75)
IQR = Q3 - Q1
df_clean = df[~((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).any(axis=1)]
print(f"Original data size: {df.shape}")
print(f"Data size after removing the outliers: {df_clean.shape}")


#Create a new directory for trained models
os.makedirs("trained_models", exist_ok=True)


# Function for training and evaluating different ML models
def train_and_evaluate_model(df_clean, parametru, model_type="linear_regression"):
    X = df_clean.drop(columns=[parameter])
    y = df_clean[parameter]

    # Data normalization
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns, index=X.index)

    # Save the scaler
    scaler_filename = f"trained_models/scaler_{model_type}_{parameter}.pkl"
    joblib.dump(scaler, scaler_filename)
    
    # Save correct order of columns
    feature_filename = f"trained_models/features_{model_type}_{parameter}.pkl"
    joblib.dump(X.columns.tolist(), feature_filename)
    
    # Split data into: 80 for training & 20% for testing
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Choose ML model
    if model_type == "Linear Regression":
        model = LinearRegression()
    elif model_type == "Random Forest":
        model = RandomForestRegressor(n_estimators=100, random_state=42)
    elif model_type == "SVR":
        model = SVR(kernel='rbf')
    elif model_type == "Decision Tree":
        model = DecisionTreeRegressor(random_state=42)
    elif model_type == "KNN":
        model = KNeighborsRegressor(n_neighbors=5)
    elif model_type == "Gradient Boosting":
        model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    elif model_type == "Stacking":
        rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        gb_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        knn_model = KNeighborsRegressor(n_neighbors=5)
        dt_model = DecisionTreeRegressor(random_state=42)
        svr_model = SVR(kernel='rbf')
        model = StackingRegressor(estimators=[('rf', rf_model), ('gb', gb_model), ('knn', knn_model), ('dt', dt_model), ('svr', svr_model)], 	final_estimator=GradientBoostingRegressor(n_estimators=50, random_state=42), passthrough=True)

    model.fit(X_train, y_train)

    filename = f"trained_models/{model_type}_{parameter}.pkl"
    joblib.dump(model, filename)
    
    y_pred = model.predict(X_test)

    #Calculate RMSE and R^2 metrics
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"RMSE ({model_type}) for {parameter}: {rmse:.4f}")
    print(f"R² ({model_type}) for {parameter}: {r2:.4f}")

    #Plot Real vs. Predicted map for each parameter and  model
    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, y_pred, alpha=0.6, color='green')
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
    plt.xlabel('Real values')
    plt.ylabel('Predicted values')
    plt.title(f'Real vs Predicted - {parameter} ({model_type})')
    plt.grid(True)
    plt.show()

    return rmse, r2

# Apply the function above for every parameter and model
parameters = ['TDS', 'Temperature', 'Turbidity', 'pH']
model_types = ["Linear Regression", "Random Forest", "SVR", "Decision Tree", "KNN", "Gradient Boosting", "Stacking"]

for model_type in model_types:
    for parameter in parameters:
        print(f"Train {model_type} for {parameter}:")
        rmse, r2 = train_and_evaluate_model(df_clean, parameter, model_type)
        print("-" * 90)