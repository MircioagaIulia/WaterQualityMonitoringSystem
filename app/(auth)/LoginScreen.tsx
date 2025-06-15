import React from "react";
import { ScrollView, View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Login from '../../scripts/Login';
import { Link } from 'expo-router';

function LoginScreen() {
    const navigation = useNavigation();
    
    return (

         <ImageBackground
          source={require('../../assets/images/background.jpeg')} // Background image
          style={styles.container} 
          >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View  style={styles.contentContainer}>

            <Login navigation={navigation} />

            <Text style={styles.notAccountText}>Don't have an account?</Text>
            <View >
                   <Link href="/(auth)/RegisterScreen"  style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Register</Text>
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
       justifyContent: 'center', 
       backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    contentContainer: {
        width: 300,
        height: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        padding: 20,
        borderRadius: 10,
       
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center', 
        alignItems: 'center',
    },

    notAccountText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 30,
        marginBottom: 10,
        textAlign: "center",
        
    },
    registerButtonText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#1e90ff',
        paddingHorizontal: 90,
        paddingVertical: 12,
        borderRadius: 10,
        width: 250, 
        //alignItems: 'center',
        marginBottom: 10,
    },
 
     
});

export default LoginScreen;
