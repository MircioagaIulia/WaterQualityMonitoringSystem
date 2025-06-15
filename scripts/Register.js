import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity, } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; 
import { router } from 'expo-router';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Register successful!');
            
            router.push('LoginScreen');
        } catch (err) {
            
            let errorMessage = "An error occurred. Please try later!";
      
          switch (err.code) {
            case 'auth/email-already-in-use':
              errorMessage = "This email is already in use.";
              break;
            case 'auth/invalid-email':
              errorMessage = "The entered e-mail is not valid.";
              break;
            case 'auth/missing-password':
              errorMessage = "Please enter your password!";
              break;
            case 'auth/weak-password':
              errorMessage = "Password should be at least 6 characters!";
              break;  
            case 'auth/missing-email':
              errorMessage = "Please enter your e-mail address!";
              break;
            default:
              errorMessage = err.message;
          }
      
          setError(errorMessage);
        }
      };

    return (
        <View>
            <Text style={styles.title}>Register</Text>
            

            <TextInput
                style={styles.input }
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                required
            />

            <TextInput
                style={styles.input}
                placeholder="Parola"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                required
            />

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                  <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};


const styles = StyleSheet.create({

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
        textAlign: 'center',
        padding: 40,
        
    },
    input: {
        width: 250,
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
        fontSize: 16,
        backgroundColor: 'white',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    button: {
        width: 250,
        height: 45,
        backgroundColor: '#1e90ff',
        justifyContent: 'center',
        //alignItems: 'center',
        borderRadius: 5,
        marginTop: 0,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: "center",
        fontWeight: 'bold',

    },


});

export default Register;
