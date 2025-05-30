import { create } from "zustand";
import {
  Direction,
  getNextPosition,
  getPositionFromNeighborhood,
  getLocationFromPosition,
} from "~/utils/game";
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
  Location,
  spawn,
} from "./cards";
import { closeCardEvent, drawCardEvent } from "./events";

export const PANEL_TRANSITION_DURATION = 3000;

type Panel = "move" | "effects" | "action" | "probability" | "choice";

interface GameState {
  // State
  gems: number;
  gpa: number;
  position: number;
  deck: Card[];
  currentCard: Card | null;
  location: Location;
  panel: Panel;
  state: "idle" | "playing" | "game-over";
  // Actions
  move: (spaces: number, direction: Direction) => void;
  updateGems: (amount: number) => void;
  updateGPA: (amount: number) => void;
  drawCard: () => void;
  applyEffects: (effects: BaseCardEffect[]) => void;
  handleRoll: (roll: number) => BaseCardEffect[];
  handleChoice: (choiceIndex: number) => BaseCardEffect[];
  handleExam: (result: "pass" | "fail") => void;
  processCard: () => void;
  resetGame: () => void;
  changeState: (state: "idle" | "playing" | "game-over") => void;
  closeCard: () => void;
}

function initGameState() {
  const spawnConfig = spawn();

  return {
    state: "idle" as const,
    gems: spawnConfig.initialGems,
    gpa: 2,
    position: getPositionFromNeighborhood(spawnConfig.neighborhood),
    deck: createDeck(),
    currentCard: null,
    location: spawnConfig.neighborhood,
    panel: "move" as const,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initGameState(),

  move: (spaces: number, direction: Direction) => {
    const position = getNextPosition(get().position, direction, spaces);
    const location = getLocationFromPosition(position);

    set({ position, location });
    get().drawCard();
    get().processCard();
  },

  updateGems: (amount) =>
    set((state) => ({ gems: Math.max(0, state.gems + amount) })),

  updateGPA: (amount) =>
    set((state) => ({
      gpa: Math.max(0, state.gpa + amount),
    })),

  drawCard: () => {
    set((state) => {
      const { card, remainingDeck } = drawCard(state.deck, state.location);
      drawCardEvent();

      console.log(`DEBUG: drawCard`, card);

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
      setTimeout(() => set({ panel: "move" }), PANEL_TRANSITION_DURATION * 2);
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
      set({
        panel: "effects",
        currentCard: { ...currentCard, finalOutcome: effects },
      });
      setTimeout(() => set({ panel: "move" }), PANEL_TRANSITION_DURATION);
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
      if (effects.length > 0) {
        get().applyEffects(effects);

        // Store the resolved effects on the card itself
        set((state) => ({
          currentCard: { ...state.currentCard!, finalOutcome: effects },
          panel: "effects",
        }));

        setTimeout(() => set({ panel: "move" }), PANEL_TRANSITION_DURATION);
      }

      set({ panel: "move" });

      return effects;
    }

    return [];
  },

  handleExam: (result: "pass" | "fail") => {
    const { gpa, gems } = get();
    if (result === "pass") {
      get().updateGPA(gpa);
      get().changeState("idle");
      get().resetGame();
    } else {
      set({ gpa: Math.round(gpa / 2) });
      set({ gems: Math.round(gems / 2) });
    }
  },

  closeCard: () => {
    set({ panel: "move" });
    closeCardEvent();
  },

  changeState: (state: "idle" | "playing" | "game-over") => set({ state }),

  resetGame: () => set(initGameState()),
}));
