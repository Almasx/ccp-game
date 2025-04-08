"use client";

import { Board } from "~/components/board";
import { createBoard } from "~/utils";
import { useState } from "react";
import { Controls } from "~/components/controller";
export default function Home() {
  const [board] = useState(() => createBoard());

  return (
    <main className="min-h-screen pt-40 pb-10 flex flex-col items-center gap-8">
      <Board board={board} />
      <Controls />
    </main>
  );
}
