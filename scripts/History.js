import React, { useState, useEffect, useCallback } from "react";
import { database, ref, onValue } from "./firebase";
import { Text, View, FlatList, Dimensions, Button, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {getColorForValue} from  './LiveData';

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

  // Format timestamp-ul in order to return something like this: dd.MM.yyyy, HH:mm:ss
  const formattedTimestamp = `${("0" + timestamp.getDate()).slice(-2)}.${("0" + (timestamp.getMonth() + 1)).slice(-2)}.${timestamp.getFullYear()}, ${("0" + timestamp.getHours()).slice(-2)}:${("0" + timestamp.getMinutes()).slice(-2)}:${("0" + timestamp.getSeconds()).slice(-2)}`;

  return formattedTimestamp;
};


function History() {
  const [sensorData, setSensorData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");  
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();

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
        setSensorData(data);
        setFilteredData(data);  
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = fetchData();
    return () => unsubscribe();
  }, [fetchData]);

  useEffect(() => {
    
    if (searchQuery === "") {
      setFilteredData(sensorData);
    } else {
      const filtered = sensorData.filter((item) => {
        
        return item.timestamp.includes === searchQuery ||
          item.Temperature.toString()=== searchQuery ||
          item.TDS.toString() === searchQuery||
          item.Turbidity.toString() === searchQuery ||
          item.pH.toString() === searchQuery;
      });
      setFilteredData(filtered);
    }
  }, [searchQuery, sensorData]);

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: "row",  borderWidth:5, borderColor: "#42c5f5", backgroundColor: "#42c5f5" }}>
      <Text style={styles.tableTime}>{item.timestamp}</Text>
      <Text style={[styles.table, { backgroundColor: getColorForValue(item.Temperature, "Temperature")}]}>{item.Temperature}°C</Text>
      <Text style={[styles.table, {backgroundColor: getColorForValue(item.TDS, "TDS")}]}>{item.TDS}</Text>
      <Text style={[styles.table, {backgroundColor: getColorForValue(item.Turbidity, "Turbidity")}]}>{item.Turbidity}</Text>
      <Text style={[styles.table,  {backgroundColor: getColorForValue(item.pH, "pH") }]}>{item.pH}</Text>
    </View>
  );

  return (

    <View style={{ marginTop: 20 }}>
    <Button title="See charts" onPress={() => navigation.navigate("Charts")}  color="#42c5f5"/>
    
    <View style={{ padding: 5 }}>
     
      
      {/*Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <View>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.timestamp}
          renderItem={renderItem}
          ListHeaderComponent={
            <View style={ styles.header}>
              <Text style={ styles.titleTextTime}>Time</Text>
              <Text style={ styles.titleText}>Temp</Text>
              <Text style={ styles.titleText}>TDS</Text>
              <Text style={ styles.titleText}>Turb</Text>
              <Text style={ styles.titleText}>pH</Text>
            </View>
          }
        />
      </View>
    </View>
    </View>
  );
}
const styles = StyleSheet.create({
  table:{ 
    flex: 1,
    padding: 5,
    textAlign: "center",
    backgroundColor: "white",
    marginLeft: 1,
    borderWidth:2,
    borderColor: "white",
   },

   tableTime:{ 
    flex: 1.5,
    padding: 1,
    textAlign: "center",
    backgroundColor: "white",
    marginLeft: 1,
    borderWidth:2,
    borderColor: "white",
   },

   searchBar:{
    height: 40,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  header:{
    flexDirection: "row",
    backgroundColor: "#42c5f5",
    borderWidth:5, 
    borderColor: "#42c5f5",
  },
  titleText:{
    flex: 1,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    borderWidth: 2,
    borderColor: "white",
    padding: 10,
  },

  titleTextTime:{
    flex: 1.5,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    borderWidth: 2,
    borderColor: "white",
    padding: 10,
  },
});
export default History;
