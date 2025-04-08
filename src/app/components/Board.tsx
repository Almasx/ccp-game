import { Board as BoardType, Tile as TileType } from "../utils/game";
import { cn } from "../utils/cn";

interface BoardProps {
  board: BoardType;
  currentPosition?: number;
}

export function Board({ board, currentPosition }: BoardProps) {
  // Simple slicing into 4 sides
  const top = board.slice(0, 7);
  const right = board.slice(7, 12);
  const bottom = board.slice(12, 19).reverse();
  const left = board.slice(19).reverse();

  return (
    <div className="inline-block space-y-2.5">
      {/* Top row */}
      <div className="flex justify-center gap-2.5">
        {top.map((tile) => (
          <Tile
            key={tile.position}
            tile={tile}
            isActive={currentPosition === tile.position}
          />
        ))}
      </div>

      {/* Middle section with left and right columns */}
      <div className="flex justify-between gap-2.5">
        {/* Left column */}
        <div className="flex flex-col gap-2.5">
          {left.map((tile) => (
            <Tile
              key={tile.position}
              tile={tile}
              isActive={currentPosition === tile.position}
            />
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2.5">
          {right.map((tile) => (
            <Tile
              key={tile.position}
              tile={tile}
              isActive={currentPosition === tile.position}
            />
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-end gap-2.5">
        {bottom.map((tile) => (
          <Tile
            key={tile.position}
            tile={tile}
            isActive={currentPosition === tile.position}
          />
        ))}
      </div>
    </div>
  );
}

interface TileProps {
  tile: TileType;
  isActive?: boolean;
}

function Tile({ tile, isActive }: TileProps) {
  const isBuilding = tile.type !== "regular";
  const isBigBuilding = tile.type === "mansion" || tile.type === "skyscraper";

  return (
    <div
      className={cn(
        "shadow-[0px_6px_0px_0px_rgba(206,188,118,1)] duration-200 ease-in-out",
        "hover:shadow-[0px_3px_0px_0px_rgba(206,188,118,1)] hover:translate-y-1",
        tile.size === "lg" ? "size-24 rounded-3xl" : "size-16 rounded-2xl",
        isActive && "shadow-[0px_3px_0px_0px_rgba(206,188,118,1)] translate-y-1"
      )}
    >
      <div
        className={cn(
          "size-full bg-[#FFF9DE] relative",
          tile.size === "lg" ? "rounded-3xl" : "rounded-2xl",
          "shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.25),inset_0px_-2px_4px_0px_rgba(237,219,147,1)]"
        )}
      >
        {isBuilding && (
          <img
            src={`/building/${tile.type}.png`}
            alt={tile.type}
            className={cn(
              "absolute  left-1/2 -translate-x-1/2 object-contain",
              isBigBuilding ? "size-20" : "size-16",
              tile.size === "lg" ? "bottom-10" : "bottom-5"
            )}
          />
        )}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/images/player.png" alt="Player" className="w-10" />
          </div>
        )}
      </div>
    </div>
  );
}
