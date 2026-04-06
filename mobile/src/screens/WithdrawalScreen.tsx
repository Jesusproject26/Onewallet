import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal
} from "react-native";
import { withdraw } from "../api";

export default function WithdrawalScreen({ route, navigation }) {
  const { token } = route.params;

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  async function handleWithdraw() {
    if (!amount) {
      Alert.alert("Error", "Enter an amount");
      return;
    }

    try {
      setLoading(true);
      const res = await withdraw(Number(amount), token);

      if (res.success) {
        setSuccessVisible(true);
        setTimeout(() => {
          setSuccessVisible(false);
          navigation.goBack();
        }, 2000);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Funds</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount (₦)"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleWithdraw} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Withdraw"}
        </Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.successText}>✓</Text>
            <Text style={styles.successLabel}>Withdrawal Successful</Text>
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
    backgroundColor: "#f44336",
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
