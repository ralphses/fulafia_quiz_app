import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import ChatScreen from '../screens/ChatScreen';




const Stack = createStackNavigator();

function NavigationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={ChatScreen}
        options={{headerShown: false}}
      />
    
    </Stack.Navigator>
  );
}

export default NavigationStack;
