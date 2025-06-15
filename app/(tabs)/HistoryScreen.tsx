import {StyleSheet, ScrollView, Text,  View } from 'react-native';
import React from "react";
import History from '../../scripts/History.js';

export default function HistoryScreen() {
    return (
        <View style={styles.scrollContainer}>
           <History />
        </View>

    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: 'rgba(30, 144, 255, 0.1)', // Blue background
        paddingBottom: 20, 
    },

});
