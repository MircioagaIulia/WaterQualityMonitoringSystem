import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LogoutButton() {
    const navigation = useNavigation();

    const handleLogout = () => {

        navigation.reset({
            index: 0,
            routes: [{ name: "index" }], 
        });
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#42c5f5", 
        paddingVertical: 5,
        paddingHorizontal: 5,
        alignItems: "center",
        borderWidth: 2,              
        borderColor: "#ffff",
    },
    buttonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
    },
});
