import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AjoScreen from "./src/screens/AjoScreen";
import FundWalletScreen from "./src/screens/FundWalletScreen";
import TransactionHistoryScreen from "./src/screens/TransactionHistoryScreen";
import WithdrawalScreen from "./src/screens/WithdrawalScreen";
import AjoContributionScreen from "./src/screens/AjoContributionScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: { token: string };
  Ajo: { token: string };
};
export async function initializePayment(amount: number, email: string, token: string) {
  return apiPost("/paystack/initialize", { amount, email }, token);
}

export async function verifyPayment(reference: string, token: string) {
  return apiGet(`/paystack/verify/${reference}`, token);
}
export async function withdraw(amount: number, token: string) {
  return apiPost("/wallet/withdraw", { amount }, token);
}

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
            <Stack.Screen name="AjoContribution">
  {(props) => <AjoContributionScreen {...props} token={token} />}
</Stack.Screen>
            <Stack.Screen name="TransactionHistory">
  {(props) => <TransactionHistoryScreen {...props} token={token} />}
</Stack.Screen>
                                         <Stack.Screen name="Withdraw">
  {(props) => <WithdrawalScreen {...props} token={token} />}
</Stack.Screen>

            <Stack.Screen name="FundWallet">
  {(props) => <FundWalletScreen {...props} token={token} />}
</Stack.Screen>
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
