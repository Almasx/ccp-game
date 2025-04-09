import { cn } from "~/utils";
import { useMemo, useState } from "react";
import { useGameStore } from "~/lib/game-store";
import Button from "./button";
import { AnimatePresence, motion } from "motion/react";
import { EVENTS } from "~/lib/events";
import { useEventListener } from "~/hooks";

export const Controls = () => {
  return (
    <div className="mt-auto bg-white border-2 border-neutral-300 rounded-2xl flex h-24 fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
      <div className="flex flex-col w-20 h-full">
        <Gems />
        <GPA />
      </div>
      <MovePanel />
      {/* <SituationPanel /> */}
      <Cards />
    </div>
  );
};

const Gems = () => {
  const gems = useGameStore((state) => state.gems);

  const image = useMemo(
    () => (
      <img
        src="/images/gem.png"
        alt="Gem"
        width={28}
        height={28}
        className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
      />
    ),
    []
  );

  return (
    <div className="w-full border-b group/gem border-neutral-300 items-center flex flex-col overflow-hidden h-1/2">
      <span className="text-[#3EBDFE] text-2xl font-semibold italic mt-1 group-hover/gem:scale-90 transition-all duration-300 group-hover/gem:opacity-50">
        {gems}
      </span>
      <div className="flex relative items-center -mt-1">
        <div className="translate-y-0.5 translate-x-2 -rotate-12 transition-transform duration-300 transform-gpu group-hover/gem:-translate-y-1 group-hover/gem:rotate-[-5deg]">
          {image}
        </div>
        <div className="translate-y-1.5 z-10 relative transition-transform duration-300 delay-75 transform-gpu group-hover/gem:-translate-y-2">
          {image}
        </div>
        <div className="translate-y-1 -translate-x-2 rotate-6 transition-transform duration-300 delay-150 transform-gpu group-hover/gem:-translate-y-1 group-hover/gem:rotate-12">
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
    <div className="w-full group/gpa border-neutral-300 items-center flex flex-col overflow-hidden h-1/2">
      <span className="text-[#F25885] text-2xl font-semibold italic mt-1 group-hover/gpa:scale-90 transition-all duration-300 group-hover/gpa:opacity-50">
        {gpa}
      </span>
      <div className="flex relative items-center -mt-1">
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
  const card = useMemo(() => {
    return <img src="/images/card.svg" alt="Card" className="w-28" />;
  }, []);

  const [deck, setDeck] = useState(Array.from({ length: 8 }, generateId));

  useEventListener(EVENTS.DRAW_CARD, () => {
    setDeck((d) => d.slice(0, -1));
    setTimeout(() => setDeck((d) => [generateId()].concat(d)), 1000);
  });

  return (
    <div className="flex flex-col w-40 h-full border-l relative border-neutral-200 items-center justify-center rounded-r-2xl">
      <div className="overflow-hidden h-36 absolute bottom-0 w-[9rem] group/cards">
        <AnimatePresence>
          {deck.map((id, index) => {
            const isEven = index % 2 === 0;
            const degree = Math.random() * 10 * (isEven ? 1 : -1);

            return (
              <motion.div
                key={`card-${id}`}
                initial={{ y: 30 + index * 2 }}
                animate={{ y: 30 + index * 2 }}
                exit={{ y: 30 + index * 2 + 1000 }}
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
                {card}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SituationPanel = () => {
  return (
    <div className="flex flex-col overflow-hidden w-80 h-full border-l border-neutral-200 items-center justify-center">
      <div className="gap-4 flex justify-center items-center">
        <div className="gap-0.5 flex flex-col items-center text-[#3EBDFE]">
          <span className="text-sm font-medium">You lost</span>
          <div className="flex italic text-4xl font-semibold gap-3 items-center">
            -2 <img src="/images/gem.png" alt="Gem" className="size-8" />
          </div>
        </div>

        <span className="text-3xl italic text-neutral-400 font-semibold">
          &
        </span>

        <div className="gap-0.5 flex flex-col items-center text-[#F25885]">
          <span className="text-sm font-medium">You gained</span>
          <div className="flex italic text-4xl font-semibold gap-3 items-center">
            +2 <span className="text-3xl -mx-1">🧠</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MovePanel = () => {
  const [status, setStatus] = useState<"idle" | "reveal" | "pending_action">(
    "idle"
  );
  const [number, setNumber] = useState<number>(0);

  const move = useGameStore((state) => state.move);

  const handleRoll = () => {
    setStatus("reveal");
    setNumber(Math.floor(Math.random() * 6) + 1);
    setTimeout(() => {
      setStatus("pending_action");
    }, 2000);
  };

  return (
    <div className="flex flex-col overflow-hidden w-80 h-full border-l border-neutral-200 items-center justify-center">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.span
            key="top"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="font-semibold text-neutral-500"
          >
            <Button
              onClick={handleRoll}
              className="inline-flex scale-[0.6] py-1 -mx-2 text-xl"
            >
              Roll
            </Button>
            a dice
          </motion.span>
        )}
        {status === "idle" && (
          <motion.div
            key="bottom"
            initial={{ y: "150%" }}
            animate={{ y: 0 }}
            exit={{ y: "150%" }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center text-5xl mt-0.5 mb-2"
          >
            🎲
          </motion.div>
        )}
        {status === "reveal" && (
          <motion.div
            key="reveal number"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="font-semibold text-neutral-500"
          >
            You picked
          </motion.div>
        )}
        {status === "reveal" && (
          <motion.div
            key="number"
            initial={{ y: "150%" }}
            animate={{ y: 0 }}
            exit={{
              opacity: 0,
              filter: "blur(4px)",
              transition: { duration: 0.3 },
            }}
            transition={{ duration: 0.5 }}
            className="flex items-center font-semibold justify-center italic text-5xl mt-0.5 mb-2"
          >
            {number}
          </motion.div>
        )}
        {status === "pending_action" && (
          <motion.div
            key="pending action"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="size-full flex justify-between items-center px-9 text-xl"
          >
            <Button
              onClick={() => {
                move(number, -1);
                setStatus("idle");
              }}
            >
              -{number} back
            </Button>
            <Button
              onClick={() => {
                move(number, 1);
                setStatus("idle");
              }}
            >
              +{number} forward
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
