import React from "react";
import { ScrollView, View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Link } from 'expo-router'; // Link for navigation
import Register from '../../scripts/Register'; 
import { useNavigation } from '@react-navigation/native'; 


function RegisterScreen() {
    const navigation = useNavigation();
    return (

        <ImageBackground
            source={require('../../assets/images/background.jpeg')} // Background image
            style={styles.container} 
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                   
                    <Register /> 

                    <Text style={styles.alreadyAccountText}>You already have an account?</Text>
                    <View>
                     
                        <Link href="/(auth)/LoginScreen" style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                     </Link>
                    
                                        
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center', // Centrează conținutul pe ecran
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundal deschis
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center', // Centrează conținutul în interiorul ScrollView
        alignItems: 'center',
    },
    contentContainer: {
        width: 300,
        height: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Un fundal semitransparent pentru a face textul mai vizibil pe fundal
        borderRadius: 10,
        padding: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        padding: 30,
    },
    alreadyAccountText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 30,
        marginBottom: 10,
        textAlign: "left",
       
    },
    loginButtonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        paddingHorizontal: 100,
        borderRadius: 10,
        width: 250,
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default RegisterScreen;