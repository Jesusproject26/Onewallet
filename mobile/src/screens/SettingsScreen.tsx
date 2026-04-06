import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SettingsScreen({ route, navigation }) {
  const { token } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SetPin", { token })}
      >
        <Text style={styles.buttonText}>Change PIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20, paddingTop: 50 },
  title: { fontSize: 28, color: "#fff", marginBottom: 20, fontWeight: "600" },
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
