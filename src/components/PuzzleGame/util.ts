import {
  ClipOp,
  SkImage,
  SkPicture,
  Skia,
  createPicture,
  rect,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

type IParticle = {
  x: number;
  y: number;
  savedX: number;
  savedY: number;
  vx: number;
  vy: number;
  picture: SkPicture;
};

// Grid configuration
const GRID_ROWS = 2;
const GRID_COLS = 3;
const PIECE_GAP = 6;
const IMAGE_SIZE = 400;

/**
 * Creates puzzle pieces from an image for a 2x3 grid layout
 */
export const createImagePieces = (
  image: SkImage,
  screenWidth: number,
  screenHeight: number
): IParticle[] => {
  const pieces: IParticle[] = [];
  const paint = Skia.Paint();

  const pieceWidth = IMAGE_SIZE / GRID_COLS;
  const pieceHeight = IMAGE_SIZE / GRID_ROWS;

  // Calculate total dimensions including gaps
  const totalWidth = IMAGE_SIZE + (GRID_COLS - 1) * PIECE_GAP;
  const totalHeight = IMAGE_SIZE + (GRID_ROWS - 1) * PIECE_GAP;

  // Center the puzzle on screen
  const offsetX = (screenWidth - totalWidth) / 2;
  const offsetY = (screenHeight - totalHeight) / 2;

  // Generate puzzle pieces in grid layout
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const sourceX = col * pieceWidth;
      const sourceY = row * pieceHeight;

      const displayX = sourceX + col * PIECE_GAP;
      const displayY = sourceY + row * PIECE_GAP;

      const picture = createPicture((canvas) => {
        // Create clipping path for piece
        const clipPath = Skia.Path.Make();
        clipPath.addRect(rect(0, 0, pieceWidth, pieceHeight));
        canvas.clipPath(clipPath, ClipOp.Intersect, true);

        // Calculate source rectangle from original image
        const srcX = (sourceX / IMAGE_SIZE) * image.width();
        const srcY = (sourceY / IMAGE_SIZE) * image.height();
        const srcWidth = (pieceWidth / IMAGE_SIZE) * image.width();
        const srcHeight = (pieceHeight / IMAGE_SIZE) * image.height();

        canvas.drawImageRect(
          image,
          rect(srcX, srcY, srcWidth, srcHeight),
          rect(0, 0, pieceWidth, pieceHeight),
          paint
        );
      }, rect(0, 0, pieceWidth, pieceHeight));

      pieces.push({
        x: displayX + offsetX,
        y: displayY + offsetY,
        savedX: displayX + offsetX,
        savedY: displayY + offsetY,
        vx: 0,
        vy: 0,
        picture,
      });
    }
  }

  return pieces;
};

// Grid system constants for piece positioning
const COLUMNS = 3;
export const PIECE_MARGIN = 8;
export const PIECE_SIZE =
  Dimensions.get("window").width / COLUMNS - PIECE_MARGIN;

/**
 * Converts grid position index to screen coordinates
 */
export const getPosition = (index: number) => {
  "worklet";
  return {
    x: (index % COLUMNS) * PIECE_SIZE,
    y: Math.floor(index / COLUMNS) * PIECE_SIZE,
  };
};

/**
 * Converts screen coordinates to grid position index
 */
export const getOrder = (x: number, y: number) => {
  "worklet";
  const row = Math.round(y / PIECE_SIZE);
  const col = Math.round(x / PIECE_SIZE);
  return row * COLUMNS + col;
};
