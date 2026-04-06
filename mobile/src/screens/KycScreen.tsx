import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { submitKyc } from "../api";

export default function KycScreen({ route, navigation }) {
  const { token } = route.params;

  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idImage, setIdImage] = useState("");
  const [selfie, setSelfie] = useState("");

  async function handleSubmit() {
    if (!idType || !idNumber || !idImage || !selfie) {
      Alert.alert("Error", "All fields required");
      return;
    }

    await submitKyc(
      {
        id_type: idType,
        id_number: idNumber,
        id_image: idImage,
        selfie_image: selfie
      },
      token
    );

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KYC Verification</Text>

      <TextInput
        style={styles.input}
        placeholder="ID Type (NIN, Voter's Card)"
        placeholderTextColor="#777"
        value={idType}
        onChangeText={setIdType}
      />

      <TextInput
        style={styles.input}
        placeholder="ID Number"
        placeholderTextColor="#777"
        value={idNumber}
        onChangeText={setIdNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="ID Image URL"
        placeholderTextColor="#777"
        value={idImage}
        onChangeText={setIdImage}
      />

      <TextInput
        style={styles.input}
        placeholder="Selfie Image URL"
        placeholderTextColor="#777"
        value={selfie}
        onChangeText={setSelfie}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit KYC</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20, paddingTop: 50 },
  title: { fontSize: 28, color: "#fff", marginBottom: 20, fontWeight: "600" },
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
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" }
});
