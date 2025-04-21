import { Location, Neighborhood } from "~/lib/cards";

export type NeighborhoodTile = "mansion" | "house" | "cottage" | "skyscraper";
export type ActionTile = "store" | "hotel" | "tutor";
export type RegularTile = "regular";

export type TileType = NeighborhoodTile | ActionTile | RegularTile;

export type TileSize = "sm" | "lg";

// Position on the board (0-23)
export type Position = number;

// Direction player can move
export type Direction = -1 | 1;

// Special tile positions
export const TILE_POSITION = {
  MANSION: 0, // Top-left corner
  STORE: 3, // Top middle
  HOUSE: 6, // Top-right corner
  HOTEL: 9, // Right side
  COTTAGE: 12, // Bottom-right corner
  TUTOR: 15, // Left side
  SKYSCRAPER: 18, // Bottom-left corner
};

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
      case TILE_POSITION.MANSION:
        tileType = "mansion";
        break;
      case TILE_POSITION.STORE:
        tileType = "store";
        break;
      case TILE_POSITION.HOUSE:
        tileType = "house";
        break;
      case TILE_POSITION.HOTEL:
        tileType = "hotel";
        break;
      case TILE_POSITION.COTTAGE:
        tileType = "cottage";
        break;
      case TILE_POSITION.SKYSCRAPER:
        tileType = "skyscraper";
        break;
      case TILE_POSITION.TUTOR:
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

export function getLocationFromPosition(position: number): Location {
  switch (true) {
    case position === TILE_POSITION.HOTEL:
      return "hotel";
    case position === TILE_POSITION.STORE:
      return "store";
    case position === TILE_POSITION.TUTOR:
      return "tutor";
    case position >= 0 && position <= 6:
      return "rich"; // Top side of board (positions 0-6)
    case position >= 7 && position <= 11:
      return "middle-income"; // Right side of board (positions 7-11)
    case position >= 12 && position <= 18:
      return "gentrified"; // Bottom side of board (positions 12-18)
    default:
      return "redlined"; // Left side of board (positions 19-23)
  }
}

// Helper function to get a starting position based on neighborhood
export function getPositionFromNeighborhood(
  neighborhood: Neighborhood
): number {
  switch (neighborhood) {
    case "rich":
      return TILE_POSITION.MANSION;
    case "gentrified":
      return TILE_POSITION.SKYSCRAPER;
    case "redlined":
      return TILE_POSITION.HOUSE;
    case "middle-income":
      return TILE_POSITION.COTTAGE;
    default:
      return TILE_POSITION.MANSION;
  }
}
