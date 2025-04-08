import { Board as BoardType, Tile as TileType } from "../game/types";
import { cn } from "../utis";

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
  return (
    <div
      className={cn(
        "shadow-[0px_6px_0px_0px_rgba(206,188,118,1)] duration-200 ease-in-out ",
        "hover:shadow-[0px_3px_0px_0px_rgba(206,188,118,1)] hover:translate-y-1",
        tile.type === "corner" ? "size-24 rounded-3xl" : "size-16 rounded-2xl",
        isActive && "ring-4 ring-blue-500"
      )}
    >
      <div
        className={cn(
          "size-full bg-[#FFF9DE] ",
          tile.type === "corner" ? "rounded-3xl" : "rounded-2xl",
          "shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.25),inset_0px_-2px_4px_0px_rgba(237,219,147,1)]"
        )}
      />
    </div>
  );
}
