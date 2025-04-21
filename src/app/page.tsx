"use client";

import { Board } from "~/components/board";
import { Controls } from "~/components/controller";
import { CardReveal } from "~/components/card-reveal";
import { StartGame } from "~/components/start-game";
import { useGameStore } from "~/lib/game-store";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Exam } from "~/components/exam";
export default function Home() {
  const state = useGameStore((state) => state.state);

  const screen = useMemo(() => {
    switch (state) {
      case "playing":
        return <Game />;
      case "idle":
        return <StartGame />;
    }
  }, [state]);

  return (
    <>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {screen}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

const Game = () => {
  return (
    <main className="flex flex-col items-center min-h-screen gap-8 pt-40 pb-10">
      <img
        src="/images/bg.webp"
        alt="background"
        className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover -z-10"
      />
      <Board />
      <Controls />
      <CardReveal />
      <Exam />
    </main>
  );
};
