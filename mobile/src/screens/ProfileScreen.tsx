import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { apiGet } from "../api";
import { getKycStatus } from "../api";

export default function ProfileScreen({ route, navigation }) {
  const { token } = route.params;

  const [user, setUser] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState("loading");

  async function load() {
    const u = await apiGet("/auth/me", token);
    setUser(u);

    const kyc = await getKycStatus(token);
    setKycStatus(kyc.status);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {user && (
        <View style={styles.card}>
          <Text style={styles.label}>Name: {user.full_name}</Text>
          <Text style={styles.label}>Email: {user.email}</Text>
          <Text style={styles.label}>Phone: {user.phone}</Text>
          <Text style={styles.label}>KYC Status: {kycStatus}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Kyc", { token })}
      >
        <Text style={styles.buttonText}>
          {kycStatus === "approved" ? "KYC Approved" : "Start KYC"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("Settings", { token })}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20, paddingTop: 50 },
  title: { fontSize: 28, color: "#fff", marginBottom: 20, fontWeight: "600" },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 20
  },
  label: { color: "#fff", marginBottom: 10, fontSize: 16 },
  button: {
    backgroundColor: "#4c6ef5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  buttonSecondary: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333"
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" }
});
