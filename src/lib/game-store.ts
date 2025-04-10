import { create } from "zustand";
import { Direction, getNextPosition } from "../utils";
import {
  Card,
  BaseCardEffect,
  ProbabilityEffect,
  ChoiceEffect,
  createDeck,
  drawCard,
  applyBaseEffect,
  processRoll,
  processChoice,
  Neighborhood,
} from "./cards";
import { drawCardEvent } from "./events";

export const PANEL_TRANSITION_DURATION = 3000;

type Panel = "move" | "effects" | "action" | "probability" | "choice";

interface GameState {
  // State
  gems: number;
  gpa: number;
  position: number;
  deck: Card[];
  currentCard: Card | null;
  neighborhood: Neighborhood;
  panel: Panel;
  // Actions
  move: (spaces: number, direction: Direction) => void;
  updateGems: (amount: number) => void;
  updateGPA: (amount: number) => void;
  drawCard: () => void;
  applyEffects: (effects: BaseCardEffect[]) => void;
  handleRoll: (roll: number) => BaseCardEffect[];
  handleChoice: (choiceIndex: number) => BaseCardEffect[];
  processCard: () => void;
  resetGame: () => void;
}

const initialState = {
  gems: 2,
  gpa: 0.0,
  position: 0,
  deck: createDeck(),
  currentCard: null,
  neighborhood: "rich" as const,
  panel: "move" as const,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,
  move: (spaces: number, direction: Direction) => {
    const position = getNextPosition(get().position, direction, spaces);
    const neighborhood = getNeighborhoodFromPosition(position);
    // Update neighborhood based on position

    set({ position, neighborhood });
    get().drawCard();
    get().processCard();
  },

  updateGems: (amount) =>
    set((state) => ({ gems: Math.max(0, state.gems + amount) })),

  updateGPA: (amount) =>
    set((state) => ({
      gpa: Math.min(4.0, Math.max(0, state.gpa + amount)),
    })),

  drawCard: () => {
    set((state) => {
      console.log(state.neighborhood);
      const { card, remainingDeck } = drawCard(state.deck, state.neighborhood);
      drawCardEvent();

      return {
        deck: remainingDeck,
        currentCard: card,
      };
    });
  },

  processCard: () => {
    const { currentCard } = get();
    if (!currentCard) return;

    // Determine the type of card and set the panel accordingly
    let newPanel: Panel = "effects";

    // Check for special effect types that require user interaction
    const hasProbability = currentCard.effects.some(
      (effect) => effect.type === "probability"
    );
    const hasChoice = currentCard.effects.some(
      (effect) => effect.type === "choice"
    );

    if (hasProbability) {
      newPanel = "probability";
    } else if (hasChoice) {
      newPanel = "choice";
    } else {
      // Handle basic effects immediately (gems/gpa)
      const baseEffects = currentCard.effects.filter(
        (effect): effect is BaseCardEffect =>
          effect.type === "gems" || effect.type === "gpa"
      );

      get().applyEffects(baseEffects);
      setTimeout(() => set({ panel: "move" }), PANEL_TRANSITION_DURATION);
    }

    // Update the panel
    set({ panel: newPanel });
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
      (effect): effect is ProbabilityEffect => effect.type === "probability"
    );

    if (probEffect) {
      // Process the roll and get the resulting effects
      const effects = processRoll(probEffect, roll);
      get().applyEffects(effects);
      set({ panel: "effects" });
      return effects;
    }

    return [];
  },

  handleChoice: (choiceIndex: number) => {
    const { currentCard } = get();
    if (!currentCard) return [];

    // Find choice effects in the current card
    const choiceEffect = currentCard.effects.find(
      (effect): effect is ChoiceEffect => effect.type === "choice"
    );

    if (choiceEffect) {
      // Process the choice selection and get resulting effects
      const effects = processChoice(choiceEffect, choiceIndex);
      get().applyEffects(effects);

      // Store the resolved effects on the card itself
      set((state) => ({
        currentCard: { ...state.currentCard!, finalOutcome: effects },
        panel: "effects",
      }));

      return effects;
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
