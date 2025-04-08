import { create } from "zustand";
import { Direction, getNextPosition } from "../utils";

interface GameState {
  // State
  gems: number;
  gpa: number;
  position: number;

  // Actions
  move: (spaces: number, direction: Direction) => void;
  updateGems: (amount: number) => void;
  updateGPA: (amount: number) => void;
  resetGame: () => void;
}

const initialState = {
  gems: 50,
  gpa: 4.0,
  position: 0,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  move: (spaces: number, direction: Direction) =>
    set((state) => ({
      position: getNextPosition(state.position, direction, spaces),
    })),

  updateGems: (amount) =>
    set((state) => ({ gems: Math.max(0, state.gems + amount) })),

  updateGPA: (amount) =>
    set((state) => ({
      gpa: Math.min(4.0, Math.max(0, state.gpa + amount)),
    })),

  resetGame: () => set(initialState),
}));
