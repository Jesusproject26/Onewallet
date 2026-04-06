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
import { initializeAjoPayment, verifyAjoPayment } from "../api";

export default function AjoContributionScreen({ route, navigation }) {
  const { token, group } = route.params;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  async function handlePay() {
    if (!email) {
      Alert.alert("Error", "Enter your email");
      return;
    }

    try {
      setLoading(true);

      const init = await initializeAjoPayment(
        group.id,
        Number(group.contribution_amount),
        email,
        token
      );

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
              const verify = await verifyAjoPayment(group.id, reference, token);

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
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajo Contribution</Text>

      <Text style={styles.label}>Group: {group.name}</Text>
      <Text style={styles.label}>Amount: ₦{group.contribution_amount}</Text>

     renderItem={({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.name}</Text>
    <Text>Contribution: ₦{item.contribution_amount}</Text>
    <Text>Cycle: {item.cycle_days} days</Text>
    <Text>Position: {item.position}</Text>
    <Text>Received: {item.has_received ? "Yes" : "No"}</Text>

    <TouchableOpacity
      style={{
        backgroundColor: "#4c6ef5",
        padding: 10,
        borderRadius: 8,
        marginTop: 10
      }}
      onPress={() =>
        navigation.navigate("AjoContribution", {
          token,
          group: item
        })
      }
    >
      <Text style={{ color: "#fff", textAlign: "center" }}>
        Pay Contribution
      </Text>
    </TouchableOpacity>
  </View>
)}


      {/* Success Modal */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.successText}>✓</Text>
            <Text style={styles.successLabel}>Contribution Successful</Text>
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
    fontSize: 26,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "600"
  },
  label: {
    color: "#ccc",
    marginBottom: 10,
    fontSize: 16
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
