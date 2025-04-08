"use client";

import { Board } from "./components/Board";
import { createBoard, getNextPosition, type Direction } from "./game/types";
import { useState } from "react";

export default function Home() {
  const [board] = useState(() => createBoard());
  const [currentPosition, setCurrentPosition] = useState(0);

  const move = (direction: Direction) => {
    setCurrentPosition((prev) => getNextPosition(prev, direction));
  };

  return (
    <main className="min-h-screen p-24">
      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-4">
          <button
            onClick={() => move(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Move Back
          </button>
          <button
            onClick={() => move(1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Move Forward
          </button>
        </div>

        <Board board={board} currentPosition={currentPosition} />
      </div>
    </main>
  );
}
