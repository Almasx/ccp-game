import { cn } from "~/utils";
import { useMemo, useState } from "react";
import { useGameStore } from "~/lib/game-store";

import { AnimatePresence, motion } from "motion/react";
import { EVENTS } from "~/lib/events";
import { useEventListener, useMount } from "~/hooks";
import { Panel } from "./panel";

export const Controls = () => {
  return (
    <div className="fixed z-30 flex h-24 mt-auto -translate-x-1/2 bg-white border-2 border-neutral-300 rounded-2xl bottom-4 left-1/2">
      <div className="flex flex-col w-20 h-full">
        <Gems />
        <GPA />
      </div>
      <Panel />
      <Cards />
    </div>
  );
};

const Gems = () => {
  const gems = useGameStore((state) => state.gems);

  const image = useMemo(
    () => (
      <img
        src="/images/gem.webp"
        alt="Gem"
        width={28}
        height={28}
        className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
      />
    ),
    []
  );

  return (
    <div className="flex flex-col items-center w-full overflow-hidden border-b group/gem border-neutral-300 h-1/2">
      <span className="text-[#3EBDFE] text-2xl font-semibold italic mt-1 group-hover/gem:scale-90 transition-all duration-300 group-hover/gem:opacity-50">
        {gems}
      </span>
      <div className="relative flex items-center -mt-1">
        <div className="translate-y-0.5 translate-x-2 -rotate-12 transition-transform duration-300 transform-gpu group-hover/gem:-translate-y-1 group-hover/gem:rotate-[-5deg]">
          {image}
        </div>
        <div className="translate-y-1.5 z-10 relative transition-transform duration-300 delay-75 transform-gpu group-hover/gem:-translate-y-2">
          {image}
        </div>
        <div className="transition-transform duration-300 delay-150 -translate-x-2 translate-y-1 rotate-6 transform-gpu group-hover/gem:-translate-y-1 group-hover/gem:rotate-12">
          {image}
        </div>
        <div className="absolute inset-0 inset-x-2 bg-gradient-to-t from-[#3EBDFE] to-[#3EBDFE]/0 to-55% transition-opacity duration-300 group-hover/gem:opacity-0" />
      </div>
    </div>
  );
};

const GPA = () => {
  const gpa = useGameStore((state) => state.gpa);
  return (
    <div className="flex flex-col items-center w-full overflow-hidden group/gpa border-neutral-300 h-1/2">
      <span className="text-[#F25885] text-2xl font-semibold italic mt-1 group-hover/gpa:scale-90 transition-all duration-300 group-hover/gpa:opacity-50">
        {gpa.toFixed(2)}
      </span>
      <div className="relative flex items-center -mt-1">
        <span className="text-2xl translate-x-2 rotate-6 transition-transform duration-300 transform-gpu group-hover/gpa:rotate-12 group-hover/gpa:-translate-y-1.5 group-hover/gpa:translate-x-1.5">
          🎨
        </span>
        <span className="text-2xl transition-transform duration-300 delay-75 transform-gpu group-hover/gpa:-translate-y-2">
          🧠
        </span>
        <span className="text-2xl -translate-x-2 -rotate-3 transition-transform duration-300 delay-150 transform-gpu group-hover/gpa:rotate-[-12deg] group-hover/gpa:-translate-y-1.5 group-hover/gpa:-translate-x-1.5">
          📚
        </span>
      </div>
    </div>
  );
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

const Cards = () => {
  const [deck, setDeck] = useState(Array.from({ length: 8 }, generateId));

  useEventListener(EVENTS.DRAW_CARD, () => {
    setDeck((d) => d.slice(0, -1));
    setTimeout(() => setDeck((d) => [generateId()].concat(d)), 1000);
  });

  const mounted = useMount();

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col items-center justify-center w-40 h-full border-l border-neutral-200 rounded-r-2xl">
      <div className="overflow-hidden h-36 absolute bottom-0 w-[9rem] group/cards">
        <AnimatePresence>
          {deck.map((id, index) => {
            const isEven = index % 2 === 0;
            const degree = Math.random() * 10 * (isEven ? 1 : -1);
            const y = 30 + index * 2;

            return (
              <motion.div
                key={`card-${id}`}
                initial={{ y }}
                animate={{ y }}
                exit={{ y: y + 1000 }}
                style={
                  {
                    "--random": `${degree}deg`,
                  } as React.CSSProperties
                }
                className={cn(
                  "w-28 absolute -translate-x-1/2 left-1/2 transition-transform duration-300 transform-gpu",
                  "group-hover/cards:translate-y-[-15px] group-hover/cards:rotate-[var(--random)]",
                  "origin-bottom",
                  isEven ? "rotate-2" : "-rotate-1"
                )}
              >
                <img src="/images/card.svg" alt="Card" className="w-28" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
