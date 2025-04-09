import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useEventListener, useMount } from "~/hooks";
import { EVENTS } from "~/lib/events";
import { useGameStore } from "~/lib/game-store";

export const CardReveal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentCard } = useGameStore();
  const isMounted = useMount();

  useEventListener(EVENTS.DRAW_CARD, () => {
    setIsOpen(true);

    setTimeout(() => setIsOpen(false), 3000);
  });

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-white/20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Card */}
      {isOpen && (
        <motion.div
          key="card"
          className="fixed top-0 z-20 flex items-center justify-center left-1/2 -translate-x-1/2 h-screen p-4"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          transition={{ duration: 1, type: "spring", bounce: 0 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white flex flex-col gap-y-4 rounded-2xl min-w-48 max-w-56 aspect-[4/5] border-4 border-yellow-300 ring-4 ring-white shadow-sm p-4 pt-6"
          >
            <h1 className="text-2xl grow leading-none font-bold text-neutral-800">
              {currentCard?.title}
            </h1>
            <p className="text-neutral-600 grow">{currentCard?.description}</p>
            <img
              src="/icons/q-mark.svg"
              alt="Question mark"
              className="mx-auto mt-6"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
