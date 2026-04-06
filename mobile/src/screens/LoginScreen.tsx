import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { apiPost } from "../api";

interface Props {
  onLoggedIn: (token: string) => void;
}

export default function LoginScreen({ onLoggedIn }: Props) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  async function handleSubmit() {
    try {
      setError("");
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const res = await apiPost(path, { phone, password });
      onLoggedIn(res.token);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OneWallet</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={mode === "login" ? "Login" : "Register"} onPress={handleSubmit} />
      <View style={{ height: 10 }} />
      <Button
        title={mode === "login" ? "Switch to Register" : "Switch to Login"}
        onPress={() => setMode(mode === "login" ? "register" : "login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6
  },
  error: { color: "red", marginBottom: 10 }
});
