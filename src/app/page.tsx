"use client";

import { Board } from "~/components/board";
import { createBoard } from "~/utils";
import { useState } from "react";
import { Controls } from "~/components/controller";
import { CardReveal } from "~/components/card-reveal";
import Button from "~/components/button";
import { AnimatePresence, motion } from "motion/react";

export default function Home() {
  const [board] = useState(() => createBoard());
  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isGameStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="fixed inset-0 z-10 flex flex-col items-center justify-center w-full h-full bg-white gap-28"
          >
            <Button
              className="text-lg scale-[4] active:translate-y-3"
              onClick={() => setIsGameStarted(true)}
            >
              Start Game
            </Button>

            <p className="text-lg font-medium text-neutral-500">
              Most important button in your life
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="flex flex-col items-center min-h-screen gap-8 pt-40 pb-10">
        <img
          src="/images/background.png"
          alt="background"
          className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover -z-10"
        />
        <Board board={board} />
        <Controls />
        <CardReveal />
      </main>
    </>
  );
}
