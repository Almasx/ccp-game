export type TileType = "corner" | "regular" | "store" | "house" | "hotel";

// Position on the board (0-23)
export type Position = number;

// Direction player can move
export type Direction = -1 | 1;

// Represents a tile on the board
export interface Tile {
  type: TileType;
  position: Position;
}

// The game board is a fixed array of tiles
export type Board = Tile[];

// Helper to create the initial board
export function createBoard(): Board {
  const board: Board = [];

  // Total number of positions (24 = 4 corners + 5 tiles per side * 4 sides)
  const TOTAL_POSITIONS = 24;

  for (let i = 0; i < TOTAL_POSITIONS; i++) {
    // Corners are at positions 0, 6, 12, 18
    const isCorner = i % 6 === 0;

    board.push({
      position: i,
      type: isCorner ? "corner" : "regular",
    });
  }

  return board;
}

// Helper to get next position
export function getNextPosition(
  currentPosition: Position,
  direction: Direction,
  boardSize: number = 24
): Position {
  const nextPos = (currentPosition + direction + boardSize) % boardSize;
  return nextPos >= 0 ? nextPos : boardSize + nextPos;
}
