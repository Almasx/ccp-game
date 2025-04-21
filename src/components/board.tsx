import {
  cn,
  Tile as TileType,
  createBoard,
  TILE_POSITION,
  getLocationFromPosition,
} from "~/utils";
import { useGameStore } from "~/lib/game-store";

const board = createBoard();

export function Board() {
  // Simple slicing into 4 sides
  const top = board.slice(0, 7);
  const right = board.slice(7, 12);
  const bottom = board.slice(12, 19).reverse();
  const left = board.slice(19).reverse();

  return (
    <div className="inline-block space-y-2.5 relative">
      <School />
      {/* Top row */}
      <div className="flex justify-center gap-2.5">
        {top.map((tile) => (
          <Tile key={tile.position} tile={tile} direction="top" />
        ))}
      </div>

      {/* Middle section with left and right columns */}
      <div className="flex justify-between gap-2.5">
        {/* Left column */}
        <div className="flex flex-col gap-2.5">
          {left.map((tile) => (
            <Tile key={tile.position} tile={tile} direction="left" />
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2.5">
          {right.map((tile) => (
            <Tile key={tile.position} tile={tile} direction="right" />
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-end gap-2.5">
        {bottom.map((tile) => (
          <Tile key={tile.position} tile={tile} direction="bottom" />
        ))}
      </div>
    </div>
  );
}

type Direction = "top" | "right" | "bottom" | "left";
interface TileProps {
  tile: TileType;
  direction: Direction;
}

function Tile({ tile, direction }: TileProps) {
  const isActive = useGameStore((state) => state.position === tile.position);

  const location = getLocationFromPosition(tile.position).at(0)?.toUpperCase();

  const isBuilding = tile.type !== "regular";
  const isBigBuilding = tile.type === "mansion" || tile.type === "skyscraper";
  const hasBusStop = TILE_POSITION.BUS_STOP.includes(tile.position);

  return (
    <div
      className={cn(
        "shadow-[0px_6px_0px_0px_rgba(206,188,118,1)] duration-200 ease-in-out relative group/tile",
        "hover:shadow-[0px_3px_0px_0px_rgba(206,188,118,1)] hover:translate-y-1",
        tile.size === "lg" ? "size-24 rounded-3xl" : "size-16 rounded-2xl",
        isActive && "shadow-[0px_3px_0px_0px_rgba(206,188,118,1)] translate-y-1"
      )}
    >
      {hasBusStop && <BusStop direction={direction} />}
      <div
        className={cn(
          "size-full bg-[#FFF9DE] relative flex items-center justify-center",
          tile.size === "lg" ? "rounded-3xl" : "rounded-2xl",
          "shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.25),inset_0px_-2px_4px_0px_rgba(237,219,147,1)]"
        )}
      >
        {!isBuilding && (
          <div className="text-2xl font-bold text-[#F0E5B7] italic">
            {location}
          </div>
        )}
        {isBuilding && (
          <img
            src={`/building/${tile.type}.webp`}
            alt={tile.type}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 object-contain",
              isBigBuilding ? "size-20" : "size-16",
              tile.size === "lg" ? "bottom-10" : "bottom-5"
            )}
          />
        )}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/images/player.webp" alt="Player" className="size-10" />
          </div>
        )}
      </div>
    </div>
  );
}

interface BusStopProps {
  direction: Direction;
}

function BusStop({ direction }: BusStopProps) {
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center size-16 bg-[#D9E682] rounded-2xl ",
        direction === "left" &&
          "-right-2.5 translate-x-full group-hover/tile:-translate-y-1",
        direction === "right" &&
          "-left-2.5 -translate-x-full group-hover/tile:-translate-y-1",
        direction === "top" &&
          "-bottom-3 translate-y-full group-hover/tile:translate-y-[calc(100%-4px)]",
        direction === "bottom" &&
          "-top-3 -translate-y-full group-hover/tile:-translate-y-[calc(100%+4px)]",
        "duration-200 ease-in-out group-hover/tile:brightness-105 "
      )}
    >
      <img src="/building/bus.webp" alt="Bus Stop" className="size-14" />
    </div>
  );
}

function School() {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 size-36 bg-[#FEF5CA]/40 rounded-4xl border-[6px] border-[#B4C957] flex items-center justify-center">
      <img src="/building/school.webp" alt="School" className="size-24" />
    </div>
  );
}
