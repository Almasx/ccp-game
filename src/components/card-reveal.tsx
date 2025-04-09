import { useState } from "react";
import ReactDOM from "react-dom";
import { useEventListener } from "~/hooks";
import { EVENTS } from "~/lib/events";
import { useGameStore } from "~/lib/game-store";

export const CardReveal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentCard } = useGameStore();

  useEventListener(EVENTS.DRAW_CARD, () => {
    setIsOpen(true);
  });

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/20"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-96 h-96 bg-white rounded-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h1>{currentCard?.title}</h1>
      </div>
    </div>,
    document.body
  );
};
