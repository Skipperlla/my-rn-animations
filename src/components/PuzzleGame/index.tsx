import React from "react";
import { Alert, StyleSheet, useWindowDimensions, View } from "react-native";
import { useImage } from "@shopify/react-native-skia";
import {
  useAnimatedReaction,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";

import { createImagePieces } from "./util";
import PuzzlePiece from "./ImagePiece";
import { scheduleOnRN } from "react-native-worklets";

// Constants
const PUZZLE_SIZE = 6;
const IMAGE_URL =
  "https://www.aljazeera.com/wp-content/uploads/2025/10/AFP__20251019__79CC422__v3__HighRes__AutoFormulaOneUsGrandPrixGrandPrix-1760932949.jpg?resize=770%2C513&quality=80";

/**
 * Fisher-Yates shuffle algorithm for array randomization
 */
const shuffleArray = (array: number[]): number[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
};

type PositionMap = { [key: number]: number };

const PuzzleGame = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const image = useImage(IMAGE_URL);

  // Create initial shuffled positions
  const initialOrder = shuffleArray(
    Array.from({ length: PUZZLE_SIZE }, (_, i) => i)
  );
  const positions = useSharedValue<PositionMap>(
    Object.assign(
      {},
      ...initialOrder.map((value: number, index: number) => ({
        [index]: value,
      }))
    )
  );

  /**
   * Checks if puzzle is solved and shows completion alert
   */
  const checkWinCondition = (currentPositions: PositionMap) => {
    const isWinning = Object.keys(currentPositions).every(
      (key) => currentPositions[parseInt(key)] === parseInt(key)
    );

    if (isWinning) {
      Alert.alert("🎉 Congratulations!", "You solved the puzzle!", [
        { text: "Play Again", onPress: restartGame },
        { text: "OK" },
      ]);
    }
  };

  /**
   * Restarts the game with new shuffled positions
   */
  const restartGame = () => {
    const newShuffledOrder = shuffleArray(
      Array.from({ length: PUZZLE_SIZE }, (_, i) => i)
    );
    positions.value = Object.assign(
      {},
      ...newShuffledOrder.map((value: number, index: number) => ({
        [index]: value,
      }))
    );
  };

  // Monitor position changes and check for win condition
  useAnimatedReaction(
    () => positions.value,
    (currentPositions) => {
      scheduleOnRN(checkWinCondition, currentPositions);
    }
  );

  if (!image) {
    return null;
  }

  const puzzlePieces = createImagePieces(image, screenWidth, screenHeight);

  return (
    <View style={styles.container}>
      <View style={styles.gameArea}>
        {initialOrder.map((_, index: number) => (
          <PuzzlePiece
            key={index}
            positions={positions}
            pieceId={index}
            picture={puzzlePieces[index].picture}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gameArea: {
    flex: 1,
    justifyContent: "center",
  },
});

export default PuzzleGame;
