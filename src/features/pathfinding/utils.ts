import type { Cell, PathScenario } from "./types";

export function serializeCell(cell: Cell) {
  return `${cell.row}:${cell.col}`;
}

export function deserializeCell(key: string): Cell {
  const [row = 0, col = 0] = key.split(":").map(Number);
  return {
    row,
    col,
  };
}

export function sameCell(left: Cell, right: Cell) {
  return left.row === right.row && left.col === right.col;
}

export function createEmptyScenario(rows: number, cols: number): PathScenario {
  return {
    rows,
    cols,
    start: { row: Math.max(1, Math.floor(rows / 3)), col: 3 },
    end: { row: Math.max(1, Math.floor((rows * 2) / 3)), col: cols - 4 },
    walls: new Set<string>(),
  };
}

export function randomizeWalls(
  scenario: PathScenario,
  density: number,
): PathScenario {
  const walls = new Set<string>();

  for (let row = 0; row < scenario.rows; row += 1) {
    for (let col = 0; col < scenario.cols; col += 1) {
      const candidate = { row, col };

      if (sameCell(candidate, scenario.start) || sameCell(candidate, scenario.end)) {
        continue;
      }

      if (Math.random() < density) {
        walls.add(serializeCell(candidate));
      }
    }
  }

  return {
    ...scenario,
    walls,
  };
}
