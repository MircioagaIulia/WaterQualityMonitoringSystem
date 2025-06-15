import React, { useState, useEffect, useCallback } from "react";
import { database, ref, onValue } from "./firebase";
import { Text, View, Dimensions, ScrollView, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";  

const screenWidth = Dimensions.get("window").width;
const chartConfig={
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 2,           
  color: (opacity = 0.1) => `rgba(30, 144, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  
}
const keyToTimestamp = (key) => {
  if (!key || typeof key !== 'string') {
    return null;
  }

  const parts = key.split("_");
  if (parts.length !== 2) return null;

  const dateParts = parts[0].split("-");
  if (dateParts.length !== 3) return null;

  let timeParts = parts[1].split("-");
  if (timeParts.length === 3) {
    timeParts = timeParts.join(":");
  }

  const dateString = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T${timeParts}`;
  const timestamp = new Date(dateString);

  if (isNaN(timestamp)) return null;

  const formattedTimestamp = `${("0" + timestamp.getDate()).slice(-2)}.${("0" + (timestamp.getMonth() + 1)).slice(-2)}.${timestamp.getFullYear()}`;

  return formattedTimestamp;
};

function Charts() {
  const [dailyAverages, setDailyAverages] = useState([]);

  const calculateDailyAverages = (data) => {
    const averages = {};

    data.forEach((item) => {
      const date = item.timestamp.split(",")[0];  
      if (!averages[date]) {
        averages[date] = { Temperature: [], TDS: [], Turbidity: [], pH: [] };
      }

      averages[date].Temperature.push(item.Temperature);
      averages[date].TDS.push(item.TDS);
      averages[date].Turbidity.push(item.Turbidity);
      averages[date].pH.push(item.pH);
    });

    const averagedData = Object.keys(averages).map((date) => {
      const { Temperature, TDS, Turbidity, pH } = averages[date];
      return {
        date,
        Temperature: Temperature.reduce((a, b) => a + b, 0) / Temperature.length,
        TDS: TDS.reduce((a, b) => a + b, 0) / TDS.length,
        Turbidity: Turbidity.reduce((a, b) => a + b, 0) / Turbidity.length,
        pH: pH.reduce((a, b) => a + b, 0) / pH.length,
      };
    });

    setDailyAverages(averagedData);
  };

  const fetchData = useCallback(() => {
    const dbRef = ref(database, "/");
    return onValue(dbRef, (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        const allLabels = Object.keys(fetchedData);
        const data = allLabels.map((key) => ({
          timestamp: keyToTimestamp(key),
          Temperature: fetchedData[key]?.Temperature || 0,
          TDS: fetchedData[key]?.TDS || 0,
          Turbidity: fetchedData[key]?.Turbidity || 0,
          pH: fetchedData[key]?.pH || 0,
        }));

        calculateDailyAverages(data);
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = fetchData();
    return () => unsubscribe();
  }, [fetchData]);

  return (
    <ScrollView style={{ padding: 10 }}>
      <Text style={styles.title}>Parameter evolution in time</Text>

      {/* Temperature graph */}
      {dailyAverages.length > 0 && (
        <View>
          <Text style={styles.parameterText}>Temperature</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <LineChart
            data={{
              labels: dailyAverages.map((item) => item.date),
              datasets: [{ data: dailyAverages.map((item) => item.Temperature) }],
              
            }}
            width={screenWidth*2.5}
            height={220}
            yAxisSuffix="°C"
            chartConfig={chartConfig}
            bezier
          />
          </ScrollView>
        </View>
      )}

      {/* TDS graph */}
      {dailyAverages.length > 0 && (
        <View>
          <Text style={styles.parameterText}>TDS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <LineChart
            data={{
              labels: dailyAverages.map((item) => item.date),
              datasets: [{ data: dailyAverages.map((item) => item.TDS) }],
            }}
            width={screenWidth*2.5}
            height={220}
            yAxisSuffix=" ppm"
            yLabelsOffset={0}
            chartConfig={chartConfig}
            bezier
          />
           </ScrollView>
        </View>
      )}

      {/* Turbidity graph */}
      {dailyAverages.length > 0 && (
        <View>
          <Text style={styles.parameterText}>Turbidity</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <LineChart
            data={{
              labels: dailyAverages.map((item) => item.date),
              datasets: [{ data: dailyAverages.map((item) => item.Turbidity) }],
            }}
            width={screenWidth*2.5}
            height={220}
            yAxisSuffix=" NTU"
            yLabelsOffset={0}
            chartConfig={chartConfig}
            bezier
          />
           </ScrollView>
        </View>
      )}

      {/* pH graph*/}
      {dailyAverages.length > 0 && (
        <View>
          <Text style={styles.parameterText}>pH</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <LineChart
            data={{
              labels: dailyAverages.map((item) => item.date),
              datasets: [{ data: dailyAverages.map((item) => item.pH) }],
            }}
            width={screenWidth*2.5}
            height={220}
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
          />
           </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title:{
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
  },

  parameterText:{
     fontSize: 18, 
     fontWeight: "bold",
     marginTop: 10,
     textAlign: 'left',
     padding: 10,
     backgroundColor: "#42c5f5",
     color: "#ffff",
    },


});

export default Charts;
