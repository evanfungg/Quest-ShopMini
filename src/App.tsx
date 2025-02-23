import {createNativeStackNavigator} from '@react-navigation/native-stack'

import {HomeScreen} from './screens/HomeScreen'
import {NativeFeaturesScreen} from './screens/NativeFeaturesScreen'
import {QuestScreen} from './screens/QuestScreen'

const Stack = createNativeStackNavigator()

export function App() {
  return (
    <Stack.Navigator initialRouteName="GettingStarted.Home">
      <Stack.Screen
        name="GettingStarted.Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Quest"
        component={QuestScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GettingStarted.NativeFeatures"
        component={NativeFeaturesScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}
