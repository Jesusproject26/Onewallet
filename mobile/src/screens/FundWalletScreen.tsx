import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Modal
} from "react-native";
import { initializePayment, verifyPayment } from "../api";

export default function FundWalletScreen({ route, navigation }) {
  const { token } = route.params;

  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  async function handleFund() {
    try {
      if (!amount || !email) {
        Alert.alert("Missing Info", "Enter amount and email");
        return;
      }

      setLoading(true);

      const init = await initializePayment(Number(amount), email, token);

      const authUrl = init.data.authorization_url;
      const reference = init.data.reference;

      Linking.openURL(authUrl);

      Alert.alert(
        "Verify Payment",
        "After completing payment, tap OK to verify.",
        [
          {
            text: "OK",
            onPress: async () => {
              const verify = await verifyPayment(reference, token);

              if (verify.success) {
                setSuccessVisible(true);
                setTimeout(() => {
                  setSuccessVisible(false);
                  navigation.goBack();
                }, 2000);
              } else {
                Alert.alert("Failed", "Payment not successful");
              }
            }
          }
        ]
      );
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fund Wallet</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount (₦)"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Email for Paystack"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleFund} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Proceed to Paystack"}
        </Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.successText}>✓</Text>
            <Text style={styles.successLabel}>Payment Successful</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 20,
    paddingTop: 50
  },
  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "600"
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15
  },
  button: {
    backgroundColor: "#4c6ef5",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    backgroundColor: "#111",
    padding: 40,
    borderRadius: 20,
    alignItems: "center"
  },
  successText: {
    fontSize: 60,
    color: "#4caf50",
    marginBottom: 10
  },
  successLabel: {
    color: "#fff",
    fontSize: 18
  }
});
