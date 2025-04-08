import { cn } from "~/utils";
import { useMemo } from "react";
import { useGameStore } from "~/lib/game-store";

export const Controls = () => {
  return (
    <div className="mt-auto bg-white border-2 border-neutral-300 rounded-2xl flex h-24 ">
      <div className="flex flex-col w-20 h-full">
        <Gems />
        <GPA />
      </div>
      <div className="flex flex-col w-80 h-full border-l border-neutral-200 items-center justify-center">
        <span className="text-2xl font-semibold mt-1 text-neutral-500">
          Roll a dice
        </span>
        <div className="flex items-center justify-center text-4xl">🎲</div>
      </div>
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

const Cards = () => {
  const card = useMemo(() => {
    return <img src="/images/card.svg" alt="Card" className="w-28" />;
  }, []);

  return (
    <div className="flex flex-col w-80 h-full border-l relative border-neutral-200 items-center justify-center rounded-r-2xl">
      <div className="overflow-hidden h-36 absolute bottom-0 w-[9rem] group/cards">
        {Array.from({ length: 8 }).map((_, index) => {
          const isEven = index % 2 === 0;
          const degree = Math.random() * 10 * (isEven ? 1 : -1);

          return (
            <div
              key={index}
              style={
                {
                  transform: `translateY(${30 + index * 2}px)`,
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
