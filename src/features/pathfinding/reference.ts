import type { CodeReference } from "../../types/codeReference";
import type { PathfindingAlgorithmId } from "./types";

export const pathfindingReferences: Record<PathfindingAlgorithmId, CodeReference> = {
  astar: {
    title: "A* Reference",
    summary:
      "A* combines path cost with a heuristic estimate so the frontier tends to move toward the destination instead of expanding uniformly.",
    stages: [
      {
        id: "configure",
        title: "Configure board",
        description:
          "Define the grid, obstacles, origin, and destination before the search queue is initialized.",
      },
      {
        id: "seed",
        title: "Seed frontier",
        description:
          "The start node enters the priority queue with a score based on cost-so-far plus heuristic distance.",
      },
      {
        id: "expand",
        title: "Expand node",
        description:
          "The next highest-priority node is removed from the queue and marked as visited before its neighbors are evaluated.",
      },
      {
        id: "queue",
        title: "Queue improved neighbors",
        description:
          "Neighbors receive updated costs when a better route is found, and their priority includes the heuristic distance to the goal.",
      },
      {
        id: "resolve",
        title: "Reconstruct path",
        description:
          "Once the destination is reached, parent links are followed backward to rebuild the final path.",
      },
      {
        id: "exhaust",
        title: "Exhaust frontier",
        description:
          "If the queue empties before the destination is reached, the board has no valid route.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `type Cell = { row: number; col: number };

function aStar(start: Cell, end: Cell, walls: Set<string>, rows: number, cols: number) {
  const queue = [{ cell: start, cost: 0, priority: heuristic(start, end) }];
  const parents = new Map<string, string>();
  const costs = new Map<string, number>([[key(start), 0]]);
  const visited = new Set<string>();

  while (queue.length > 0) {
    queue.sort((left, right) => left.priority - right.priority);
    const current = queue.shift()!;
    const currentKey = key(current.cell);

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    if (sameCell(current.cell, end)) return buildPath(parents, start, end);

    for (const neighbor of neighbors(current.cell, walls, rows, cols)) {
      const nextCost = current.cost + 1;
      const neighborKey = key(neighbor);

      if (nextCost >= (costs.get(neighborKey) ?? Number.POSITIVE_INFINITY)) continue;
      parents.set(neighborKey, currentKey);
      costs.set(neighborKey, nextCost);
      queue.push({
        cell: neighbor,
        cost: nextCost,
        priority: nextCost + heuristic(neighbor, end),
      });
    }
  }

  return [];
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `import heapq

def a_star(start, end, walls, rows, cols):
    queue = [(heuristic(start, end), 0, start)]
    parents: dict[tuple[int, int], tuple[int, int]] = {}
    costs = {start: 0}
    visited: set[tuple[int, int]] = set()

    while queue:
        _, cost, current = heapq.heappop(queue)
        if current in visited:
            continue

        visited.add(current)
        if current == end:
            return build_path(parents, start, end)

        for neighbor in neighbors(current, walls, rows, cols):
            next_cost = cost + 1
            if next_cost >= costs.get(neighbor, float("inf")):
                continue

            parents[neighbor] = current
            costs[neighbor] = next_cost
            priority = next_cost + heuristic(neighbor, end)
            heapq.heappush(queue, (priority, next_cost, neighbor))

    return []`,
      },
      {
        language: "java",
        label: "Java",
        code: `static List<Cell> aStar(Cell start, Cell end, Set<String> walls, int rows, int cols) {
    PriorityQueue<Node> queue = new PriorityQueue<>(Comparator.comparingInt(node -> node.priority));
    Map<String, String> parents = new HashMap<>();
    Map<String, Integer> costs = new HashMap<>();
    Set<String> visited = new HashSet<>();

    queue.add(new Node(start, 0, heuristic(start, end)));
    costs.put(key(start), 0);

    while (!queue.isEmpty()) {
        Node current = queue.poll();
        String currentKey = key(current.cell);

        if (visited.contains(currentKey)) continue;
        visited.add(currentKey);
        if (sameCell(current.cell, end)) return buildPath(parents, start, end);

        for (Cell neighbor : neighbors(current.cell, walls, rows, cols)) {
            int nextCost = current.cost + 1;
            String neighborKey = key(neighbor);
            int known = costs.getOrDefault(neighborKey, Integer.MAX_VALUE);

            if (nextCost >= known) continue;
            parents.put(neighborKey, currentKey);
            costs.put(neighborKey, nextCost);
            queue.add(new Node(neighbor, nextCost, nextCost + heuristic(neighbor, end)));
        }
    }

    return List.of();
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

using Cell = pair<int, int>;

struct Node {
    Cell cell;
    int cost;
    int priority;
};

struct HigherPriority {
    bool operator()(const Node& left, const Node& right) const {
        return left.priority > right.priority;
    }
};

vector<Cell> aStar(const Cell& start, const Cell& end,
                   const unordered_set<string>& walls,
                   int rows, int cols) {
    priority_queue<Node, vector<Node>, HigherPriority> queue;
    unordered_map<string, string> parents;
    unordered_map<string, int> costs;
    unordered_set<string> visited;

    queue.push({start, 0, heuristic(start, end)});
    costs[key(start)] = 0;

    while (!queue.empty()) {
        Node current = queue.top();
        queue.pop();
        string currentKey = key(current.cell);

        if (visited.contains(currentKey)) continue;
        visited.insert(currentKey);
        if (current.cell == end) return buildPath(parents, start, end);

        for (const Cell& neighbor : neighbors(current.cell, walls, rows, cols)) {
            int nextCost = current.cost + 1;
            string neighborKey = key(neighbor);
            int known = costs.contains(neighborKey) ? costs[neighborKey] : INT_MAX;

            if (nextCost >= known) continue;
            parents[neighborKey] = currentKey;
            costs[neighborKey] = nextCost;
            queue.push({neighbor, nextCost, nextCost + heuristic(neighbor, end)});
        }
    }

    return {};
}`,
      },
    ],
  },
  dijkstra: {
    title: "Dijkstra Reference",
    summary:
      "Dijkstra explores by the cheapest known path cost only, making it a reliable baseline for shortest-path routing without heuristics.",
    stages: [
      {
        id: "configure",
        title: "Configure board",
        description:
          "The board layout and blocked cells are prepared before the cost-driven search begins.",
      },
      {
        id: "seed",
        title: "Seed frontier",
        description:
          "The start node enters the queue with zero cost because no movement has occurred yet.",
      },
      {
        id: "expand",
        title: "Expand cheapest node",
        description:
          "The frontier always processes the node with the smallest known distance from the origin.",
      },
      {
        id: "queue",
        title: "Relax neighbors",
        description:
          "Neighbor distances are updated whenever a shorter path is found, and the revised nodes are pushed into the queue.",
      },
      {
        id: "resolve",
        title: "Reconstruct path",
        description:
          "When the destination is reached, the parent map is traced backward to produce the final route.",
      },
      {
        id: "exhaust",
        title: "Exhaust frontier",
        description:
          "If no more reachable nodes remain in the queue, the destination cannot be reached on the current board.",
      },
    ],
    snippets: [
      {
        language: "typescript",
        label: "TypeScript",
        code: `type Cell = { row: number; col: number };

function dijkstra(start: Cell, end: Cell, walls: Set<string>, rows: number, cols: number) {
  const queue = [{ cell: start, cost: 0 }];
  const parents = new Map<string, string>();
  const costs = new Map<string, number>([[key(start), 0]]);
  const visited = new Set<string>();

  while (queue.length > 0) {
    queue.sort((left, right) => left.cost - right.cost);
    const current = queue.shift()!;
    const currentKey = key(current.cell);

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    if (sameCell(current.cell, end)) return buildPath(parents, start, end);

    for (const neighbor of neighbors(current.cell, walls, rows, cols)) {
      const nextCost = current.cost + 1;
      const neighborKey = key(neighbor);

      if (nextCost >= (costs.get(neighborKey) ?? Number.POSITIVE_INFINITY)) continue;
      parents.set(neighborKey, currentKey);
      costs.set(neighborKey, nextCost);
      queue.push({ cell: neighbor, cost: nextCost });
    }
  }

  return [];
}`,
      },
      {
        language: "python",
        label: "Python",
        code: `import heapq

def dijkstra(start, end, walls, rows, cols):
    queue = [(0, start)]
    parents: dict[tuple[int, int], tuple[int, int]] = {}
    costs = {start: 0}
    visited: set[tuple[int, int]] = set()

    while queue:
        cost, current = heapq.heappop(queue)
        if current in visited:
            continue

        visited.add(current)
        if current == end:
            return build_path(parents, start, end)

        for neighbor in neighbors(current, walls, rows, cols):
            next_cost = cost + 1
            if next_cost >= costs.get(neighbor, float("inf")):
                continue

            parents[neighbor] = current
            costs[neighbor] = next_cost
            heapq.heappush(queue, (next_cost, neighbor))

    return []`,
      },
      {
        language: "java",
        label: "Java",
        code: `static List<Cell> dijkstra(Cell start, Cell end, Set<String> walls, int rows, int cols) {
    PriorityQueue<Node> queue = new PriorityQueue<>(Comparator.comparingInt(node -> node.cost));
    Map<String, String> parents = new HashMap<>();
    Map<String, Integer> costs = new HashMap<>();
    Set<String> visited = new HashSet<>();

    queue.add(new Node(start, 0, 0));
    costs.put(key(start), 0);

    while (!queue.isEmpty()) {
        Node current = queue.poll();
        String currentKey = key(current.cell);

        if (visited.contains(currentKey)) continue;
        visited.add(currentKey);
        if (sameCell(current.cell, end)) return buildPath(parents, start, end);

        for (Cell neighbor : neighbors(current.cell, walls, rows, cols)) {
            int nextCost = current.cost + 1;
            String neighborKey = key(neighbor);
            int known = costs.getOrDefault(neighborKey, Integer.MAX_VALUE);

            if (nextCost >= known) continue;
            parents.put(neighborKey, currentKey);
            costs.put(neighborKey, nextCost);
            queue.add(new Node(neighbor, nextCost, nextCost));
        }
    }

    return List.of();
}`,
      },
      {
        language: "cpp",
        label: "C++",
        code: `using namespace std;

using Cell = pair<int, int>;

struct Node {
    Cell cell;
    int cost;
};

struct LowerCost {
    bool operator()(const Node& left, const Node& right) const {
        return left.cost > right.cost;
    }
};

vector<Cell> dijkstra(const Cell& start, const Cell& end,
                      const unordered_set<string>& walls,
                      int rows, int cols) {
    priority_queue<Node, vector<Node>, LowerCost> queue;
    unordered_map<string, string> parents;
    unordered_map<string, int> costs;
    unordered_set<string> visited;

    queue.push({start, 0});
    costs[key(start)] = 0;

    while (!queue.empty()) {
        Node current = queue.top();
        queue.pop();
        string currentKey = key(current.cell);

        if (visited.contains(currentKey)) continue;
        visited.insert(currentKey);
        if (current.cell == end) return buildPath(parents, start, end);

        for (const Cell& neighbor : neighbors(current.cell, walls, rows, cols)) {
            int nextCost = current.cost + 1;
            string neighborKey = key(neighbor);
            int known = costs.contains(neighborKey) ? costs[neighborKey] : INT_MAX;

            if (nextCost >= known) continue;
            parents[neighborKey] = currentKey;
            costs[neighborKey] = nextCost;
            queue.push({neighbor, nextCost});
        }
    }

    return {};
}`,
      },
    ],
  },
};
