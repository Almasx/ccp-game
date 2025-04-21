import { Neighborhood } from "~/lib/cards";

export type NeighborhoodTile = "mansion" | "house" | "cottage" | "skyscraper";
export type ActionTile = "store" | "hotel" | "tutor";
export type RegularTile = "regular";

export type TileType = NeighborhoodTile | ActionTile | RegularTile;

export type TileSize = "sm" | "lg";

// Position on the board (0-23)
export type Position = number;

// Direction player can move
export type Direction = -1 | 1;

// Represents a tile on the board
export interface Tile {
  type: TileType;
  position: Position;
  size: TileSize;
}

// The game board is a fixed array of tiles
export type Board = Tile[];

// Helper to create the initial board
export function createBoard(): Board {
  const board: Board = [];
  const TOTAL_POSITIONS = 24;

  for (let i = 0; i < TOTAL_POSITIONS; i++) {
    let tileType: TileType = "regular";
    const tileSize = i % 6 === 0 ? "lg" : "sm";

    // Place buildings according to their positions
    switch (i) {
      case 0: // Top-left corner
        tileType = "mansion";
        break;
      case 3: // Top middle
        tileType = "store";
        break;
      case 6: // Top-right corner
        tileType = "house";
        break;
      case 11: // Right side
        tileType = "hotel";
        break;
      case 12: // Bottom-right corner
        tileType = "cottage";
        break;
      case 18: // Bottom-left corner
        tileType = "skyscraper";
        break;
      case 15: // Left side
        tileType = "tutor";
        break;
    }

    board.push({
      position: i,
      type: tileType,
      size: tileSize,
    });
  }

  return board;
}

// Helper to get next position
export function getNextPosition(
  currentPosition: Position,
  direction: Direction,
  moveSize: number = 1,
  boardSize: number = 24
): Position {
  const nextPos =
    (currentPosition + direction * moveSize + boardSize) % boardSize;
  return nextPos >= 0 ? nextPos : boardSize + nextPos;
}

export function getNeighborhoodFromPosition(position: number): Neighborhood {
  if (position >= 0 && position <= 6) {
    return "rich"; // Top side of board (positions 0-6)
  } else if (position >= 7 && position <= 11) {
    return "middle-income"; // Right side of board (positions 7-11)
  } else if (position >= 12 && position <= 18) {
    return "gentrified"; // Bottom side of board (positions 12-18)
  } else {
    return "redlined"; // Left side of board (positions 19-23)
  }
}

// Helper function to get a starting position based on neighborhood
export function getPositionFromNeighborhood(
  neighborhood: Neighborhood
): number {
  switch (neighborhood) {
    case "rich":
      return 0;
    case "gentrified":
      return 6;
    case "redlined":
      return 12;
    case "middle-income":
      return 18;
    default:
      return 0;
  }
}
