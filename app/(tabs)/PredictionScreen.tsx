import {StyleSheet, ScrollView, View } from 'react-native';
import React from "react";
import Prediction from "../../scripts/Prediction";


export default function PredictionScreen() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Prediction />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: 'rgba(131, 189, 241, 0.1)', // Blue background
        paddingBottom: 20, 
    },
});
