import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AjoScreen from "./src/screens/AjoScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: { token: string };
  Ajo: { token: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLoggedIn={setToken} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} token={token} />}
            </Stack.Screen>
            <Stack.Screen name="Ajo">
              {(props) => <AjoScreen {...props} token={token} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
