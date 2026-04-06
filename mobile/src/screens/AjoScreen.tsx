import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { apiGet, apiPost } from "../api";

type Props = NativeStackScreenProps<RootStackParamList, "Ajo"> & {
  token: string;
};

export default function AjoScreen({ token }: Props) {
  const [groups, setGroups] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("1000");
  const [cycle, setCycle] = useState("7");

  async function loadGroups() {
    const res = await apiGet("/ajo/my-groups", token);
    setGroups(res);
  }

  async function createGroup() {
    await apiPost(
      "/ajo/groups",
      { name, contributionAmount: Number(amount), cycleDays: Number(cycle) },
      token
    );
    setName("");
    await loadGroups();
  }

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Ajo Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text>Contribution: ₦{item.contribution_amount}</Text>
            <Text>Cycle: {item.cycle_days} days</Text>
            <Text>Position: {item.position}</Text>
            <Text>Received: {item.has_received ? "Yes" : "No"}</Text>
          </View>
        )}
      />
      <View style={styles.form}>
        <Text style={styles.subtitle}>Create Group</Text>
        <TextInput
          style={styles.input}
          placeholder="Group name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Contribution amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cycle days"
          value={cycle}
          onChangeText={setCycle}
          keyboardType="numeric"
        />
        <Button title="Create" onPress={createGroup} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 22, marginBottom: 10 },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 10
  },
  cardTitle: { fontWeight: "bold", marginBottom: 4 },
  form: { marginTop: 20 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 6
  }
});
