import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { apiGet } from "../api";

export default function TransactionHistoryScreen({ route }) {
  const { token } = route.params;
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const res = await apiGet("/wallet/transactions", token);
    setItems(res);
  }

  useEffect(() => {
    load();
  }, []);

  function renderItem({ item }) {
    const isCredit = item.type === "credit";
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={[styles.amount, isCredit ? styles.credit : styles.debit]}>
            {isCredit ? "+" : "-"}₦{item.amount}
          </Text>
          <Text style={styles.type}>{item.type.toUpperCase()}</Text>
        </View>
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "600"
  },
  card: {
    backgroundColor: "#151515",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  amount: {
    fontSize: 18,
    fontWeight: "600"
  },
  credit: {
    color: "#4caf50"
  },
  debit: {
    color: "#f44336"
  },
  type: {
    color: "#aaa",
    fontSize: 12
  },
  description: {
    color: "#ddd",
    marginBottom: 4
  },
  date: {
    color: "#777",
    fontSize: 12
  }
});
