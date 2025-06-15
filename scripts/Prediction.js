import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function Prediction() {
    const [selectedParameter, setSelectedParameter] = useState("pH");
    const [pH, setPH] = useState('');
    const [TDS, setTDS] = useState('');
    const [Turbidity, setTurbidity] = useState('');
    const [Temperature, setTemperature] = useState('');
    const [prediction, setPrediction] = useState(null);

    const getPrediction = async () => {
        try {
            const inputData = {
                target: selectedParameter,
                pH: selectedParameter !== "pH" ? parseFloat(pH) : undefined,
                TDS: selectedParameter !== "TDS" ? parseFloat(TDS) : undefined,
                Turbidity: selectedParameter !== "Turbidity" ? parseFloat(Turbidity) : undefined,
                Temperature: selectedParameter !== "Temperature" ? parseFloat(Temperature) : undefined,
            };

            const response = await axios.post(' http://192.168.202.95:5000/predict', inputData);
            //http://192.168.1.134:5000/predict
            
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error("Error on prediction aquiring:", error);
        }
    };

    return (
        <View style={styles.pickerContainer}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10, marginTop: 10 }}>
                Predict a Water Quality Parameter
            </Text>
            <Image source={require('@/assets/images/background.jpg')} style={{ width: 346, height: 200, marginBottom:10 }} />
            
            <Picker 
                selectedValue={selectedParameter}
                onValueChange={(itemValue) => setSelectedParameter(itemValue)}
                style={styles.picker}
                itemStyle={{ color: "#42c5f5" }} 
                
            >
                <Picker.Item label="pH" value="pH" />
                <Picker.Item label="TDS" value="TDS" />
                <Picker.Item label="Turbidity" value="Turbidity" />
                <Picker.Item label="Temperature" value="Temperature" />
            </Picker>

            {selectedParameter !== "pH" && (
                <>
                    <Text>pH:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={pH}
                        onChangeText={setPH}
                    />
                </>
            )}

            {selectedParameter !== "TDS" && (
                <>
                    <Text>TDS:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={TDS}
                        onChangeText={setTDS}
                    />
                </>
            )}

            {selectedParameter !== "Turbidity" && (
                <>
                    <Text>Turbidity:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={Turbidity}
                        onChangeText={setTurbidity}
                    />
                </>
            )}

            {selectedParameter !== "Temperature" && (
                <>
                    <Text>Temperature:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={Temperature}
                        onChangeText={setTemperature}
                    />
                </>
            )}

            <Button title="Get Prediction" onPress={getPrediction} color="#42c5f5"/>

            {prediction && <Text style={{fontSize: 18, color:"#42c5f5", padding:20, textAlign: "center"}}>Predicted {selectedParameter}: {prediction}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
   input:{
    height: 40, 
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10
   },

   pickerContainer: {
    backgroundColor: "white", 
    borderRadius: 5,
    paddingHorizontal: 10,

  },
  picker: {
    height: 50,
    width: "100%",
    color: "white",
    backgroundColor: "#42c5f5",
    marginBottom: 10,
  },
   
});
