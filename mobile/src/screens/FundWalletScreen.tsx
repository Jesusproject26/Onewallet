import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Linking, Alert } from "react-native";
import { initializePayment, verifyPayment } from "../api";

export default function FundWalletScreen({ route, navigation }) {
  const { token } = route.params;

  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");

  async function handleFund() {
    try {
      if (!amount || !email) {
        Alert.alert("Error", "Enter amount and email");
        return;
      }

      const init = await initializePayment(Number(amount), email, token);

      const authUrl = init.data.authorization_url;
      const reference = init.data.reference;

      // Open Paystack payment page
      Linking.openURL(authUrl);

      // After payment, user returns to app manually
      Alert.alert(
        "Verify Payment",
        "After completing payment, click OK to verify.",
        [
          {
            text: "OK",
            onPress: async () => {
              const verify = await verifyPayment(reference, token);

              if (verify.success) {
                Alert.alert("Success", `Wallet funded with ₦${verify.amount}`);
                navigation.goBack();
              } else {
                Alert.alert("Failed", "Payment not successful");
              }
            }
          }
        ]
      );
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fund Wallet</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount (₦)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Email for Paystack"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Proceed to Paystack" onPress={handleFund} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 6
  }
});
