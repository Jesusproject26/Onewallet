import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { getBanks, resolveAccount, withdrawToBank } from "../api";

export default function WithdrawToBankScreen({ route, navigation }) {
  const { token } = route.params;

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadBanks() {
    const list = await getBanks();
    setBanks(list);
  }

  useEffect(() => {
    loadBanks();
  }, []);

  async function handleResolve() {
    if (!selectedBank || accountNumber.length !== 10) {
      Alert.alert("Error", "Enter valid bank and account number");
      return;
    }

    setLoading(true);
    try {
      const res = await resolveAccount(accountNumber, selectedBank.code);
      setAccountName(res.account_name);
    } catch {
      Alert.alert("Error", "Unable to resolve account");
    }
    setLoading(false);
  }

  async function handleWithdraw() {
    if (!accountName) {
      Alert.alert("Error", "Resolve account first");
      return;
    }

    setLoading(true);
    try {
      await withdrawToBank(
        {
          amount: Number(amount),
          account_number: accountNumber,
          bank_code: selectedBank.code,
          account_name: accountName
        },
        token
      );

      navigation.navigate("Success", {
        message: "Withdrawal Successful"
      });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw to Bank</Text>

      {/* Bank Selection */}
      <Text style={styles.label}>Select Bank</Text>
      <View style={styles.bankList}>
        {banks.map((b) => (
          <TouchableOpacity
            key={b.code}
            style={[
              styles.bankItem,
              selectedBank?.code === b.code && styles.bankSelected
            ]}
            onPress={() => setSelectedBank(b)}
          >
            <Text style={styles.bankText}>{b.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Account Number */}
      <TextInput
        style={styles.input}
        placeholder="Account Number"
        placeholderTextColor="#777"
        keyboardType="numeric"
        maxLength={10}
        value={accountNumber}
        onChangeText={setAccountNumber}
      />

      <TouchableOpacity style={styles.resolveBtn} onPress={handleResolve}>
        <Text style={styles.resolveText}>Resolve Account</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator color="#4c6ef5" />}

      {accountName ? (
        <Text style={styles.accountName}>Account Name: {accountName}</Text>
      ) : null}

      {/* Amount */}
      <TextInput
        style={styles.input}
        placeholder="Amount (₦)"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
        <Text style={styles.buttonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20, paddingTop: 50 },
  title: { fontSize: 26, color: "#fff", marginBottom: 20, fontWeight: "600" },
  label: { color: "#aaa", marginBottom: 10 },
  bankList: { maxHeight: 150, marginBottom: 15 },
  bankItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    marginBottom: 5
  },
  bankSelected: { borderWidth: 1, borderColor: "#4c6ef5" },
  bankText: { color: "#fff" },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15
  },
  resolveBtn: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  resolveText: { color: "#fff", textAlign: "center" },
  accountName: { color: "#4caf50", marginBottom: 15, fontSize: 16 },
  button: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" }
});
