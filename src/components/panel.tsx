import { AnimatePresence, motion } from "motion/react";
import Button from "./button";
import { useMemo, useState } from "react";
import { useGameStore } from "~/lib/game-store";
import { BaseCardEffect } from "~/lib/cards";
import { cn, TILE_POSITION } from "~/utils";
import { takeBusEvent } from "~/lib/events";

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
    <>
      <div className="relative z-20 overflow-hidden bg-white border-l w-80 border-neutral-200">
        <AnimatePresence mode="wait">
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            key={panelType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {panel}
          </motion.div>
        </AnimatePresence>
      </div>
      <BusStopPanel />
    </>
  );
};

const ProbabilityPanel = () => {
  const [number, setNumber] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "reveal">("idle");

  const handleRoll = useGameStore((state) => state.handleRoll);

  const roll = () => {
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    setStatus("reveal");
    setNumber(randomNumber);
    setTimeout(() => handleRoll(randomNumber), 2000);
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
            onClick={roll}
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
    </AnimatePresence>
  );
};

const ChoicePanel = () => {
  const choice = useGameStore((state) =>
    state.currentCard?.effects.find((effect) => effect.type === "choice")
  );

  const choose = useGameStore((state) => state.handleChoice);

  if (!choice) return null;

  return (
    <div className="flex items-center justify-center gap-6">
      {choice.options.map((option, index) => {
        const isDecline = option.effects.length === 0;

        return (
          <div
            className="relative flex flex-col items-center justify-end h-full gap-0 -mt-2"
            key={option.label}
          >
            {!isDecline && (
              <div className="flex items-center gap-2">
                {option.effects.map((effect, index) => {
                  effect = effect as BaseCardEffect;
                  const isLast = index === option.effects.length - 1;

                  return (
                    <>
                      <div
                        className={cn(
                          "gap-0.5 flex flex-col items-center",
                          getEffectColor(effect.type)
                        )}
                        key={`${index}-effect`}
                      >
                        <div className="flex items-center gap-2 text-xl italic font-semibold">
                          {effect.magnitude}
                          {<EffectImage type={effect.type} size="sm" />}
                        </div>
                      </div>

                      {!isLast && (
                        <span
                          className="text-xl italic font-semibold text-neutral-400"
                          key={`${index}-separator`}
                        >
                          &
                        </span>
                      )}
                    </>
                  );
                })}
              </div>
            )}
            <Button
              variant={isDecline ? "secondary" : "primary"}
              onClick={() => choose(index)}
            >
              {option.label}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

const getTitle = (effect: BaseCardEffect) => {
  const isPositive = effect.magnitude > 0;
  return isPositive ? "You gained" : "You lost";
};

export const getEffectColor = (type: BaseCardEffect["type"]) => {
  return type === "gems" ? "text-[#3EBDFE]" : "text-[#F25885]";
};

interface EffectImageProps {
  type: BaseCardEffect["type"];
  size?: "sm" | "md" | "lg";
}

export const EffectImage = ({ type, size = "md" }: EffectImageProps) => {
  const isGems = type === "gems";
  if (isGems)
    return (
      <img
        src="/images/gem.webp"
        alt="Gem"
        className={cn(
          "size-8",
          size === "sm" && "size-4",
          size === "lg" && "size-10"
        )}
      />
    );
  return (
    <span
      className={cn(
        "text-3xl -mx-1",
        size === "sm" && "text-2xl",
        size === "lg" && "text-4xl"
      )}
    >
      🧠
    </span>
  );
};

const EffectsPanel = () => {
  const effects = useGameStore((state) => {
    const card = state.currentCard;
    return card?.finalOutcome || card?.effects;
  });

  if (!effects || effects.length === 0) return null;

  if (effects.length === 1) {
    const effect = effects[0] as BaseCardEffect;

    return (
      <div
        className={cn(
          "gap-0.5 flex flex-col items-center",
          getEffectColor(effect.type)
        )}
      >
        <span className="text-sm font-medium">{getTitle(effect)}</span>
        <div className="flex items-center gap-3 text-5xl italic font-semibold">
          {effect.magnitude} {<EffectImage type={effect.type} size="lg" />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {effects.map((effect, index) => {
        effect = effect as BaseCardEffect;
        const isLast = index === effects.length - 1;
        return (
          <>
            <div
              className={cn(
                "gap-0.5 flex flex-col items-center",
                getEffectColor(effect.type)
              )}
              key={index}
            >
              <span className="text-sm font-medium">{getTitle(effect)}</span>
              <div className="flex items-center gap-3 text-4xl italic font-semibold">
                {effect.magnitude} {<EffectImage type={effect.type} />}
              </div>
            </div>

            {!isLast && (
              <span
                className="text-3xl italic font-semibold text-neutral-400"
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

  const handleSkipReveal = () => {
    setStatus("pending_action");
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
          onClick={handleSkipReveal}
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
          onClick={handleSkipReveal}
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
          className="flex items-center justify-between text-xl size-full px-9"
        >
          <Button onClick={handleBack}>-{number} back</Button>
          <Button onClick={handleForward}>+{number} forward</Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BusStopPanel = () => {
  const position = useGameStore((state) => state.position);
  const gpa = useGameStore((state) => state.gpa);

  const hasBusStop = TILE_POSITION.BUS_STOP.includes(position);

  const text = useMemo(() => {
    if (gpa >= 4) return "Ready to take final exam?";

    return (
      <span className="flex items-center gap-1">
        You need at least 4 <span className="mx-0.5">🧠</span> for exam
      </span>
    );
  }, [gpa]);

  return (
    <AnimatePresence initial={false}>
      {hasBusStop && (
        <motion.div
          className="absolute left-20 w-80 -top-0.5  flex items-center px-3 justify-between -translate-y-full bg-white/90 rounded-t-xl h-10 "
          animate={{
            y: 0,
            transition: { delay: 1, duration: 0.4, type: "spring", bounce: 0 },
          }}
          initial={{ y: "105%" }}
          exit={{ y: "105%" }}
          transition={{ duration: 0.4, type: "spring", bounce: 0 }}
        >
          <span className="font-semibold leading-none text-neutral-500">
            {text}
          </span>
          <Button
            className="scale-[0.6] py-1 -mx-6 -mt-0.5 text-xl "
            onClick={takeBusEvent}
            disabled={gpa < 4}
          >
            Take a bus
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
