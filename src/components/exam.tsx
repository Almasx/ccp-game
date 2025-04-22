import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { useEventListener } from "~/hooks";
import { EVENTS } from "~/lib/events";
import Button from "./button";
import { ChevronLeft } from "lucide-react";
import { useGameStore } from "~/lib/game-store";

type Step = "idle" | "dice" | "reveal" | "result";

export const Exam = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [step, setStep] = useState<Step>("idle");
  const [number, setNumber] = useState(0);

  const gpa = useGameStore((state) => state.gpa);
  const handleExam = useGameStore((state) => state.handleExam);

  const havePassed = useMemo(() => {
    return number + gpa >= 10;
  }, [number, gpa]);

  useEventListener(EVENTS.TAKE_BUS, () => {
    setIsOpen(true);
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleStart = () => {
    setStep("dice");
  };

  const handleRoll = () => {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    setNumber(randomNumber);
    setStep("reveal");

    setTimeout(() => {
      setStep("result");
    }, 2000);
  };

  const handleRestart = useCallback(() => {
    handleExam(havePassed ? "pass" : "fail");
    setIsOpen(false);
    setStep("idle");
  }, [havePassed, handleExam]);

  const currentStep = useMemo(() => {
    switch (step) {
      case "idle":
        return <IdleStep onStep={handleStart} onBack={handleClose} />;
      case "dice":
        return <DiceStep onRoll={handleRoll} />;
      case "reveal":
        return <RevealStep number={number} />;
      case "result":
        if (havePassed)
          return <WinStep number={number} onStep={handleRestart} />;
        return <LoseStep number={number} onStep={handleRestart} />;
    }
  }, [step, number, havePassed, handleRestart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto backdrop-blur-sm bg-white/90"
          onClick={handleClose}
        >
          <div className="w-80" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
              >
                {currentStep}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface IdleStepProps {
  onStep: () => void;
  onBack: () => void;
}

const IdleStep = ({ onStep, onBack }: IdleStepProps) => {
  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex items-center self-start gap-2 py-1 mb-10 -ml-6 rounded-xl text-neutral-500"
        onClick={onBack}
      >
        <ChevronLeft className="w-4 h-4" />
        Go back
      </button>

      <h1 className="font-medium">Final Exam</h1>
      <p className="whitespace-pre-line text-neutral-500">
        {`This exam will determine whether or not you gain a diploma. You will roll a six sided dice, and add it’s outcome to your current grade score. You must have 10 or more points to pass.

         If you do not pass, your grades will be halved and you will restart in your initial neighbourhood.

         Are you ready?`}
      </p>
      <Button
        className="self-start px-2 py-1 mt-10 rounded-xl"
        onClick={onStep}
      >
        Take a exam
      </Button>
    </div>
  );
};

interface DiceStepProps {
  onRoll: () => void;
}

const DiceStep = ({ onRoll }: DiceStepProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-semibold text-neutral-500">
        <Button
          onClick={onRoll}
          className="inline-flex scale-[0.6] py-1 -mx-2 text-xl"
        >
          Roll
        </Button>
        a dice
      </span>
      <div className="flex items-center justify-center text-5xl mt-0.5 mb-2">
        🎲
      </div>
    </div>
  );
};

interface RevealStepProps {
  number: number;
}

const RevealStep = ({ number }: RevealStepProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-semibold text-neutral-500">You rolled</p>
      <div className="flex items-center font-semibold justify-center italic text-5xl mt-0.5 mb-2">
        {number}
      </div>
    </div>
  );
};

interface WinStepProps {
  number: number;
  onStep: () => void;
}

const WinStep = ({ number, onStep }: WinStepProps) => {
  const gpa = useGameStore((state) => state.gpa);

  return (
    <div className="flex flex-col gap-2 pt-[30vh]">
      <p className="font-semibold text-neutral-800">You win</p>
      <p className="whitespace-pre-line text-neutral-500">
        {`You successfully passed exam
          ${gpa} + ${number} = ${gpa + number} 

          But what does that actually mean?`}
      </p>
      <p className="font-semibold text-neutral-500">Please read</p>
      <p className="whitespace-pre-line text-neutral-500">
        {`This game is based on real systems and real consequences. 

         In the 1930s, government agencies in the US created maps that graded neighborhoods by perceived “risk”. Areas with Black, immigrant, or working-class residents were outlined in the red neighborhoods. They were denied loans, insurance, and investment. This practice, known as redlining, helped shape where resources flowed - and where they didn’t.

         While illegal today, the impact of redlining is still visible across the country. We all know systemic racism exists. The point of this game is to surface the nuances - the parts you may not immediately link to injustice. Like how far you live from a grocery store. Whether your parents have time to help with homework. Their mood after being affected by the housing crisis. Or whether your school has a library that actually opens. 

         These things don’t happen randomly. They happen because of history. 

         This game asks you to think not only about where a student ends up, but where they start. 

         We believe play can be a powerful tool for reflection. And maybe, a starting point for change.`}
      </p>

      <Button
        className="self-start px-2 py-1 mt-10 mb-10 rounded-xl"
        onClick={onStep}
      >
        Restart
      </Button>
    </div>
  );
};

interface LoseStepProps {
  number: number;
  onStep: () => void;
}

const LoseStep = ({ number, onStep }: LoseStepProps) => {
  const gpa = useGameStore((state) => state.gpa);
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-neutral-500">You lose</p>
      <p className="whitespace-pre-line text-neutral-500">
        {`You failed the exam
          ${gpa} + ${number} = ${gpa + number}  
          
          Unfortunately, you have not succeeded. Your GPA has been halved. Try your next year.`}
      </p>

      <Button
        className="self-start px-2 py-1 mt-10 rounded-xl"
        onClick={onStep}
      >
        Back to game
      </Button>
    </div>
  );
};
