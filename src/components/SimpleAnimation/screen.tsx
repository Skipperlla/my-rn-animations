import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export function SimpleAnimationScreen() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { translateX: translateX.value },
      ],
    };
  });

  const handleScaleAnimation = () => {
    scale.value = withSequence(withSpring(1.5), withSpring(1));
  };

  const handleRotationAnimation = () => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), 3, false);
  };

  const handleMoveAnimation = () => {
    translateX.value = withSequence(
      withSpring(100),
      withSpring(-100),
      withSpring(0)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Simple Animation Demo</Text>

      <View style={styles.animationContainer}>
        <Animated.View style={[styles.animatedBox, animatedStyle]} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleScaleAnimation}>
          <Text style={styles.buttonText}>Scale Animation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRotationAnimation}
        >
          <Text style={styles.buttonText}>Rotation Animation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleMoveAnimation}>
          <Text style={styles.buttonText}>Move Animation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#f1f5f9",
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedBox: {
    width: 100,
    height: 100,
    backgroundColor: "#8b5cf6",
    borderRadius: 20,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
  },
});
