import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { verifyPin } from "../api";

export default function PinLoginScreen({ route, navigation }) {
  const { token } = route.params;
  const [pin, setPinValue] = useState("");

  async function handleLogin() {
    const res = await verifyPin(pin, token);

    if (res.success) {
      navigation.replace("Home");
    } else {
      Alert.alert("Incorrect PIN");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter PIN</Text>

      <TextInput
        style={styles.input}
        placeholder="••••"
        placeholderTextColor="#777"
        keyboardType="numeric"
        secureTextEntry
        maxLength={6}
        value={pin}
        onChangeText={setPinValue}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Unlock</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20, paddingTop: 50 },
  title: { fontSize: 26, color: "#fff", marginBottom: 20, fontWeight: "600" },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 10
  },
  button: {
    backgroundColor: "#4c6ef5",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" }
});
