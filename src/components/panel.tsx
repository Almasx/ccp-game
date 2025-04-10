import { AnimatePresence, motion } from "motion/react";
import Button from "./button";
import { useCallback, useMemo, useState } from "react";
import { useGameStore } from "~/lib/game-store";
import { BaseCardEffect } from "~/lib/cards";
import { cn } from "~/utils";

export const Panel = () => {
  const panelType = useGameStore((state) => state.panel);

  const panel = useMemo(() => {
    switch (panelType) {
      case "move":
        return <MovePanel />;
      case "effects":
        return <EffectsPanel />;
      case "probability":
        return <ProbabilityPanel />;
      case "choice":
        return <ChoicePanel />;
    }
  }, [panelType]);

  return (
    <div className="flex flex-col overflow-hidden w-80 h-full border-l border-neutral-200 items-center justify-center">
      {panel}
    </div>
  );
};

const ProbabilityPanel = () => {
  return <div>Probability</div>;
};

const ChoicePanel = () => {
  return <div>Choice</div>;
};

const EffectsPanel = () => {
  const effects = useGameStore((state) => state.currentCard?.effects);

  const getImage = useCallback((effect: BaseCardEffect) => {
    const isGems = effect.type === "gems";

    return isGems ? (
      <img src="/images/gem.png" alt="Gem" className="size-8" />
    ) : (
      <span className="text-3xl">🧠</span>
    );
  }, []);

  const getTitle = useCallback((effect: BaseCardEffect) => {
    const isPositive = effect.magnitude > 0;
    return isPositive ? "You gained" : "You lost";
  }, []);

  const getColor = useCallback((effect: BaseCardEffect) => {
    return effect.type === "gems" ? "text-[#3EBDFE]" : "text-[#F25885]";
  }, []);

  if (!effects || effects.length === 0) return null;

  if (effects.length === 1) {
    const effect = effects[0] as BaseCardEffect;

    return (
      <div
        className={cn("gap-0.5 flex flex-col items-center", getColor(effect))}
      >
        <span className="text-sm font-medium">{getTitle(effect)}</span>
        <div className="flex italic text-5xl font-semibold gap-3 items-center">
          {effect.magnitude} {getImage(effect)}
        </div>
      </div>
    );
  }

  return (
    <div className="gap-4 flex justify-center items-center">
      {effects.map((effect, index) => {
        effect = effect as BaseCardEffect;
        const isLast = index === effects.length - 1;
        return (
          <>
            <div
              className={cn(
                "gap-0.5 flex flex-col items-center",
                getColor(effect)
              )}
              key={index}
            >
              <span className="text-sm font-medium">You lost</span>
              <div className="flex italic text-4xl font-semibold gap-3 items-center">
                {effect.magnitude} {getImage(effect)}
              </div>
            </div>

            {!isLast && (
              <span
                className="text-3xl italic text-neutral-400 font-semibold"
                key={`${index}-separator`}
              >
                &
              </span>
            )}
          </>
        );
      })}
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
    setTimeout(() => setStatus("pending_action"), 2000);
  };

  const handleBack = () => {
    move(number, -1);
    setStatus("idle");
  };

  const handleForward = () => {
    move(number, 1);
    setStatus("idle");
  };

  return (
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
          <Button onClick={handleBack}>-{number} back</Button>
          <Button onClick={handleForward}>+{number} forward</Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
