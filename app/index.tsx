import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import React from "react";
import { Link } from 'expo-router'; 


export default function Index() {
    
    return (
        <ImageBackground
            source={require('@/assets/images/background.jpeg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Text style={styles.welcomeText}>Welcome!</Text>
                <Text style={styles.subtitle}>Water quality monitoring system</Text>

                <View style={styles.card}>
                    <Link href="/(auth)/LoginScreen" style={styles.loginButton}>
                        <Text style={styles.buttonText}>Login</Text>
                    </Link>

                    <Link href="/(auth)/RegisterScreen" style={styles.registerButton}>
                        <Text style={styles.buttonText}>Register</Text>
                    </Link>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        width: '90%',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
    },
    card: {
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        borderRadius: 10,
        width: '80%',
        marginBottom: 20,
        textAlign: "center"
    },
    registerButton: {
        backgroundColor: '#4682b4',
        paddingVertical: 12,
        borderRadius: 10,
        width: '80%',
        textAlign: "center"
       
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});
