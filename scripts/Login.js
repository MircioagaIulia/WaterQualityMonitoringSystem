import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; 
import { router } from 'expo-router';
import { Keyboard } from 'react-native';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    const [loading, setLoading] = useState(false);


    const handleLogin = async () => {
        if (loading) return; // Prevent double click
        Keyboard.dismiss(); // Close keyboard
        setLoading(true); 
    
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Login successful!');
            setIsLoggedIn(true);
            setLoading(false); // Reset loading state
            router.push('LiveDataScreen');
        } catch (err) {
            setLoading(false); // Reset loading state
            let errorMessage = "An error occurred. Please try again!";
    
            switch (err.code) {
                case 'auth/invalid-credential':
                    errorMessage = "The entered credentials are not valid.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "The entered e-mail is not valid.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "There is no user with this e-mail .";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "The entered password is wrong.";
                    break;
                case 'auth/missing-password':
                    errorMessage = "Please enter your password!";
                    break;
                case 'auth/missing-email':
                    errorMessage = "Please enter your e-mail address!";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many requests. Please try later";
                    break;
                default:
                    errorMessage = err.message;
            }
    
            setError(errorMessage);
        }
    };

    return (
        <View>
               
        <View>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        </View>
    )
        
};

const styles = StyleSheet.create({

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
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
    button: {
        width: 250,
        height: 45,
        backgroundColor: '#1e90ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 0,
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
    },


});

export default Login;
