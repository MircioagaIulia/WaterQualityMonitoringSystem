import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './app/(auth)/LoginScreen';
import LiveDataScreen from './app/(auth)/LiveDataScreen';  // Asigură-te că ai importat corect LiveDataScreen

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="LiveDataScreen" component={LiveDataScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;