import {StyleSheet, ScrollView, Text,  View } from 'react-native';
import React from "react";
import History from '../../scripts/Charts.js';

export default function HistoryScreen() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
           <History />
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    scrollContainer: {
        backgroundColor: 'rgba(30, 144, 255, 0.1)', // Blue background
        paddingBottom: 10, 
    },

});
