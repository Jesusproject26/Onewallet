import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { apiGet } from "../api";

export default function WalletOverviewScreen({ route, navigation }) {
  const { token } = route.params;

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  async function load() {
    const wallet = await apiGet("/wallet/balance", token);
    setBalance(wallet.balance);

    const tx = await apiGet("/wallet/transactions", token);
    setTransactions(tx.slice(0, 5)); // last 5
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  function renderItem({ item }) {
    const isCredit = item.type === "credit";
    return (
      <View style={styles.txCard}>
        <Text style={[styles.txAmount, isCredit ? styles.credit : styles.debit]}>
          {isCredit ? "+" : "-"}₦{item.amount}
        </Text>
        <Text style={styles.txDesc}>{item.description}</Text>
        <Text style={styles.txDate}>{new Date(item.created_at).toLocaleString()}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wallet</Text>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>₦{balance}</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("FundWallet", { token })}
        >
          <Text style={styles.actionText}>Fund</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Withdraw", { token })}
        >
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("TransactionHistory", { token })}
        >
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Ajo Shortcut */}
      <TouchableOpacity
        style={styles.ajoButton}
        onPress={() => navigation.navigate("Ajo", { token })}
      >
        <Text style={styles.ajoText}>Ajo Groups</Text>
      </TouchableOpacity>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20, paddingTop: 50 },
  title: { fontSize: 28, color: "#fff", marginBottom: 20, fontWeight: "600" },

  balanceCard: {
    backgroundColor: "#1a1a1a",
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 25
  },
  balanceLabel: { color: "#aaa", fontSize: 16 },
  balanceValue: { color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 5 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  actionButton: {
    backgroundColor: "#4c6ef5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "30%"
  },
  actionText: { color: "#fff", textAlign: "center", fontWeight: "600" },

  ajoButton: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#333"
  },
  ajoText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },

  sectionTitle: { color: "#fff", fontSize: 20, marginBottom: 10, fontWeight: "600" },

  txCard: {
    backgroundColor: "#151515",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 10
  },
  txAmount: { fontSize: 18, fontWeight: "600" },
  credit: { color: "#4caf50" },
  debit: { color: "#f44336" },
  txDesc: { color: "#ccc", marginTop: 5 },
  txDate: { color: "#777", fontSize: 12, marginTop: 5 }
});
