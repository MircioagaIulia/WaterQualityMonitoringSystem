import React, { useState, useEffect } from "react";
import { database, ref, onValue } from "./firebase";
import { Text, View, ScrollView, Dimensions, Alert, StyleSheet } from 'react-native';
import { sendEmail } from './sendEmail';
import { keyToTimestamp } from "./Utils";
const { width} = Dimensions.get('window');


// Color based on the parameters values
export const getColorForValue = (value, type) => {
  if (isNaN(value) || !isFinite(value)) value = 0;
  switch (type) {
    case "TDS":
      return value <= 300 ? "#b2d8b2" : (value > 300 && value <=600) ? "#c5d8b2" : (value >600 && value <=900)? "#f4e285" :  (value > 900 && value <1200) ? "#f28e8e" : "#4a3d3d";
    case "Temperature":
      return value <= 22 ? "#b2d8b2" : (value> 22 && value < 36) ? "#f4e285" : "#f28e8e";
    case "Turbidity":
      return value <= 1 ? "#b2d8b2" : (value > 1 && value <=5) ? "#f4e285" : "#f28e8e";
    case "pH":
      return (value >= 6.5 && value <= 8.5) ? "#b2d8b2" : ((value >=6 && value <6.5)|| (value >8.5 && value <9))? "#f4e285" : "#f28e8e";
    default:
      return "#fff";
  }
};

function LiveData() {
    const [data, setData] = useState({
        labels: [],
        datasets: [
            { data: [], color: (opacity = 1) => `rgba(65, 244, 181, ${opacity})` }, // TDS
            { data: [], color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})` }, // Temperature
            { data: [], color: (opacity = 1) => `rgba(244, 65, 65, ${opacity})` }, // Turbidity
            { data: [], color: (opacity = 1) => `rgba(244, 114, 65, ${opacity})` }, // pH
        ],
    });
    
   
    const checkWaterQuality = (ph, turbidity, temperature, TDS) => {
        let messages = [];
        let emailBody = "Measurement details:\n";
        
        // Add measurements values in emailBody
        emailBody += `TDS: ${TDS}ppm\n`;
        emailBody += `Temperature: ${temperature}°C\n`;
        emailBody += `Turbidity: ${turbidity} NTU\n`;
        emailBody += `pH: ${ph}\n`;
    
        if (ph < 6 || ph > 9) {
            const message = `⚠️ pH Alert! pH value is dangerous: ${ph}`;
            Alert.alert('⚠️ pH Alert!', message);
            messages.push(message);
        }
    
        if (turbidity > 5) {
            const message = `🌊 Turbidity Alert! Water is too cloudy: ${turbidity} NTU`;
            Alert.alert('🌊 Turbidity Alert!', message);
            messages.push(message);
        }
    
        if (temperature > 36) {
            const message = `🔥 Temperature Alert! Water temperature is to high: ${temperature}°C`;
            Alert.alert('🔥 Temperature Alert!', message);
            messages.push(message);
        }

        if (TDS >900) {
            const message = `⚠️ TDS Alert! TDS value is dangerous: ${TDS}`;
            Alert.alert('⚠️ TDS Alert!', message);
            messages.push(message);
                }
        if (messages.length > 0) {
            const emailSubject = '🚨 Water Quality Alert!';
            const emailText = messages.join('\n') + "\n\n" + emailBody;  
            sendEmail(emailSubject, emailText);  
        }
    };

    const [currentMeasurement, setCurrentMeasurement] = useState(null);
    const [lastUpdateTime, setLastUpdateTime] = useState(null);
    const [status, setStatus] = useState("Loading...");

    useEffect(() => {
        const dbRef = ref(database, "/");
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const fetchedData = snapshot.val();
            if (fetchedData) {
                const labels = Object.keys(fetchedData);
                const TDS = labels.map((key) => fetchedData[key].TDS || 0);
                const temperatura = labels.map((key) => fetchedData[key].Temperature || 0);
                const turbidity = labels.map((key) => fetchedData[key].Turbidity || 0);
                const pH = labels.map((key) => fetchedData[key].pH || 0);

                setData({
                    labels,
                    datasets: [
                        { data: TDS },
                        { data: temperatura },
                        { data: turbidity },
                        { data: pH },
                    ],
                });

                const lastKey = labels[labels.length - 1];  // Last measurement
                const lastMeasurement = fetchedData[lastKey];

                setCurrentMeasurement(lastMeasurement);

                const timestamp = keyToTimestamp(lastKey);
                setLastUpdateTime(timestamp);


                if (lastMeasurement) {
                    checkWaterQuality(lastMeasurement.pH, lastMeasurement.Turbidity, lastMeasurement.Temperature, lastMeasurement.TDS);
                }

                if (timestamp) {
                    const now = new Date();
                    const diffMinutes = (now - timestamp) / (1000 * 60);
                    console.log("Time difference:", diffMinutes);
                    setStatus(diffMinutes > 1 ? "Inactive" : "Active");
                } else {
                    setStatus("Inactive");
                }
            } else {
                setStatus("Inactive");
            }
            }  
        );

        return () => unsubscribe();
    }, []);

    
    const formatDate = (timestamp) => {
        if (!timestamp) return "Invalid Date";
        return timestamp.toLocaleString('ro-RO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <ScrollView style={styles.scrollview}>
           
            <View style={{ marginTop: -50}}>
            <Text style={styles.statusText}>
                <View style={[styles.statusColor, { backgroundColor: status === "Active" ? "green" : "red"}]} />
                {status}
            </Text>
            </View>

            <View style={styles.firstContainer}>
                <View style={styles.secondContainer}>
                    <Text style={styles.measurementText}> 🕒 Last measurement </Text>
                    <Text style={styles.timestamp}>{formatDate(lastUpdateTime)} </Text>
                </View>
            </View>
            {currentMeasurement && (
                                    
                <View style={styles.measurementContainer}>
                <View style={styles.container}>
                    {[
                        { label: "💧 TDS", value: currentMeasurement.TDS, color: getColorForValue(currentMeasurement.TDS, "TDS") },
                        { label: "🌡️ Temperature", value: `${currentMeasurement.Temperature}°C`, color: getColorForValue(currentMeasurement.Temperature, "Temperature") },
                        { label: "🌊 Turbidity", value: currentMeasurement.Turbidity, color: getColorForValue(currentMeasurement.Turbidity, "Turbidity") },
                        { label: "🔬 pH", value: currentMeasurement.pH, color: getColorForValue(currentMeasurement.pH, "pH") }
                    ].map((item, index) => (
                        <View key={index} style={styles.card}>
                        <Text style={[styles.cardText, { color: item.color }]}>{item.label}: {item.value}</Text>
                        </View>
                    ))}
                    </View>
                    </View>

            )}
        </ScrollView>
    );
}


export default LiveData;

const styles = StyleSheet.create({
    firstContainer:{
      padding: 1,
      alignItems: "center",
    },
    secondContainer:{
      backgroundColor: "#F0F4F8",  
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 5,
      marginTop: 10,
      borderWidth: 1,
      borderColor: '#E1E4E8',  
      width: width * 0.95,
    },
    measurementText:{
      fontSize: 24,
      fontWeight: "500",
      color: "#333",  
      marginBottom: 5,
      textAlign: 'center',
    },
    timestamp:{
       fontSize: 22,
       fontWeight: "300",
       color: "#666",  
       marginTop: 5,
       marginLeft: 25,
       textAlign: 'center',
    },
    measurementContainer:{
       width: width * 0.95,
       marginVertical: 1,
    },
    statusColor:{
       width: 20,
       height: 20,
       borderRadius: 10,
       marginRight: 10,
       display: 'inline-block',
    }, 
    statusText:{
       fontSize: 30,
       textAlign: 'center',
       marginVertical: 10,
       paddingTop: 60, 
       paddingBottom: 20,
    },
    scrollview:{ 
       padding: 10,
       backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    container: {
      alignItems: "center",
      padding: 20,
    },
    card: {
      backgroundColor: "#f0f8ff",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 15,
      width: 350,
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, 
    },
    cardText: {
      fontSize: 26,
      fontWeight: "bold",
      textAlign: "left",
    },
  });