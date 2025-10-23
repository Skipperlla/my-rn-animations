import React from "react";
import { Canvas, Picture, SkPicture } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getOrder, getPosition, PIECE_MARGIN } from "./util";

interface PuzzlePieceProps {
  picture: SkPicture;
  positions: SharedValue<{ [key: number]: number }>;
  pieceId: number;
}

const PIECE_SIZE = 120;

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  picture,
  positions,
  pieceId,
}) => {
  const currentPosition = getPosition(positions.value[pieceId]);
  const translateX = useSharedValue(currentPosition.x);
  const translateY = useSharedValue(currentPosition.y);
  const gestureContext = useSharedValue({ startX: 0, startY: 0 });
  const isBeingDragged = useSharedValue(false);

  // Update piece position when positions state changes
  useAnimatedReaction(
    () => positions.value[pieceId],
    (newPositionIndex) => {
      const newPosition = getPosition(newPositionIndex);
      translateX.value = withTiming(newPosition.x);
      translateY.value = withTiming(newPosition.y);
    }
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      gestureContext.value = {
        startX: translateX.value,
        startY: translateY.value,
      };
      isBeingDragged.value = true;
    })
    .onUpdate((event) => {
      translateX.value = gestureContext.value.startX + event.translationX;
      translateY.value = gestureContext.value.startY + event.translationY;

      const currentOrder = positions.value[pieceId];
      const newOrder = getOrder(translateX.value, translateY.value);

      // Swap pieces if hovering over different position
      if (currentOrder !== newOrder) {
        const pieceToSwap = Object.keys(positions.value).find(
          (key) => positions.value[parseInt(key)] === newOrder
        );

        if (pieceToSwap) {
          const updatedPositions = { ...positions.value };
          updatedPositions[pieceId] = newOrder;
          updatedPositions[parseInt(pieceToSwap)] = currentOrder;
          positions.value = updatedPositions;
        }
      }
    })
    .onEnd(() => {
      const finalPosition = getPosition(positions.value[pieceId]);
      translateX.value = withTiming(finalPosition.x);
      translateY.value = withTiming(finalPosition.y);
    })
    .onFinalize(() => {
      isBeingDragged.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute" as const,
      margin: PIECE_MARGIN * 2,
      zIndex: isBeingDragged.value ? 1000 : 1,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: isBeingDragged.value ? 1.1 : 1 },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <Canvas style={{ width: PIECE_SIZE, height: PIECE_SIZE }}>
          <Picture picture={picture} />
        </Canvas>
      </Animated.View>
    </GestureDetector>
  );
};

export default PuzzlePiece;
