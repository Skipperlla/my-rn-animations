import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppNavigation } from "./utils/useNavigation";
import { ComponentScreenList } from "./constants";

export function ComponentList() {
  const navigation = useAppNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>React Native Animations</Text>
      <Text style={styles.subtitle}>Tap any animation to see it in action</Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(ComponentScreenList).map((name) => (
          <TouchableOpacity
            accessibilityRole="button"
            key={name}
            style={styles.item}
            onPress={() => navigation.navigate(name as any)}
          >
            <Text style={styles.itemText}>{name}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
    color: "#f1f5f9",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#94a3b8",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: "#1e293b",
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e2e8f0",
  },
  arrow: {
    fontSize: 20,
    color: "#8b5cf6",
    fontWeight: "bold",
  },
});
