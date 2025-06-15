import { Image, StyleSheet, Platform, View, Text, ScrollView } from 'react-native';
import React from "react";
import LiveData from '../../scripts/LiveData';

export default function LiveDataScreen() {
    return (
        <ScrollView style={{ backgroundColor: 'rgba(8, 77, 120, 0.1)',}}>
            <LiveData />
        </ScrollView>
    );
}


