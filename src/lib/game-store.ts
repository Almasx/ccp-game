import { create } from "zustand";
import { Direction, getNextPosition } from "../utils";
import {
  Card,
  BaseCardEffect,
  createDeck,
  drawCard,
  applyBaseEffect,
  processRoll,
  processChoice,
  Neighborhood,
} from "./cards";

interface GameState {
  // State
  gems: number;
  gpa: number;
  position: number;
  deck: Card[];
  currentCard: Card | null;
  neighborhood: Neighborhood;

  // Actions
  move: (spaces: number, direction: Direction) => void;
  updateGems: (amount: number) => void;
  updateGPA: (amount: number) => void;
  drawCard: () => void;
  applyEffects: (effects: BaseCardEffect[]) => void;
  handleRoll: (roll: number) => BaseCardEffect[];
  handleChoice: (choiceIndex: number) => BaseCardEffect[];
  resetGame: () => void;
}

const initialState = {
  gems: 50,
  gpa: 4.0,
  position: 0,
  deck: createDeck(),
  currentCard: null,
  neighborhood: "rich" as const,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,
  move: (spaces: number, direction: Direction) =>
    set((state) => {
      const position = getNextPosition(state.position, direction, spaces);
      // Update neighborhood based on position

      return {
        position,
        neighborhood: getNeighborhoodFromPosition(position),
      };
    }),

  updateGems: (amount) =>
    set((state) => ({ gems: Math.max(0, state.gems + amount) })),

  updateGPA: (amount) =>
    set((state) => ({
      gpa: Math.min(4.0, Math.max(0, state.gpa + amount)),
    })),

  drawCard: () => {
    set((state) => {
      const { card, remainingDeck } = drawCard(state.deck, state.neighborhood);
      return {
        deck: remainingDeck,
        currentCard: card,
      };
    });
  },

  applyEffects: (effects: BaseCardEffect[]) => {
    effects.forEach((effect) => {
      const { gems, gpa } = applyBaseEffect(effect);
      if (gems !== undefined) get().updateGems(gems);
      if (gpa !== undefined) get().updateGPA(gpa);
    });
  },

  handleRoll: (roll: number) => {
    const { currentCard } = get();
    if (!currentCard) return [];

    // Find probability effects in the current card
    const probEffect = currentCard.effects.find(
      (effect) => effect.type === "probability"
    );

    if (probEffect && probEffect.type === "probability") {
      // Process the roll and get the resulting effects
      return processRoll(probEffect, roll);
    }

    return [];
  },

  handleChoice: (choiceIndex: number) => {
    const { currentCard } = get();
    if (!currentCard) return [];

    // Find choice effects in the current card
    const choiceEffect = currentCard.effects.find(
      (effect) => effect.type === "choice"
    );

    if (choiceEffect && choiceEffect.type === "choice") {
      // Process the choice selection and get resulting effects
      return processChoice(choiceEffect, choiceIndex);
    }

    return [];
  },

  resetGame: () => set({ ...initialState, deck: createDeck() }),
}));

// Helper function to determine neighborhood from board position
function getNeighborhoodFromPosition(position: number): Neighborhood {
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
