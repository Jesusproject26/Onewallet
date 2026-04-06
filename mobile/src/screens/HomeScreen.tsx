import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { apiGet, apiPost } from "../api";

type Props = NativeStackScreenProps<RootStackParamList, "Home"> & {
  token: string;
};

export default function HomeScreen({ navigation, token }: Props) {
  const [balance, setBalance] = useState<string>("0.00");

  async function loadWallet() {
    const res = await apiGet("/wallet/me", token);
    setBalance(res.balance);
  }

  async function topup() {
    await apiPost("/wallet/topup", { amount: 1000 }, token);
    await loadWallet();
  }

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Balance</Text>
      <Text style={styles.balance}>₦{balance}</Text>
      <Button title="Top up ₦1000 (test)" onPress={topup} />
      <Button
  title="Fund Wallet"
  onPress={() => navigation.navigate("FundWallet", { token })}
/>
      <Button
  title="View Transaction History"
  onPress={() => navigation.navigate("TransactionHistory", { token })}
/>
      <View style={{ height: 20 }} />
      <Button title="Go to Ajo" onPress={() => navigation.navigate("Ajo", { token })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 10 },
  balance: { fontSize: 32, textAlign: "center", marginBottom: 20 }
});
