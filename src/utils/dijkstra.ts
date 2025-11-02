import appData from "../components/VirtualTour/appData";

export interface PathResult {
  path: string[];
  distance: number;
  steps: number;
  from_scene_name?: string;
  to_scene_name?: string;
}

// Dijkstra's algorithm to find the shortest path between two scenes
export function findShortestPath(fromId: string, toId: string): PathResult | null {
  if (!fromId || !toId) return null;

  const scenes = appData.scenes as any[];
  const nodes = new Set(scenes.map((s) => s.id));
  if (!nodes.has(fromId) || !nodes.has(toId)) return null;

  const neighbors: Record<string, string[]> = {};
  for (const s of scenes) {
    neighbors[s.id] = (s.linkHotspots || []).map((h: any) => h.target);
  }

  const queue: string[] = [fromId];
  const prev: Record<string, string | null> = {};
  prev[fromId] = null;
  const visited = new Set<string>([fromId]);

  let found = false;
  while (queue.length > 0) {
    const node = queue.shift() as string;
    if (node === toId) {
      found = true;
      break;
    }
    for (const nb of neighbors[node] || []) {
      if (!visited.has(nb)) {
        visited.add(nb);
        prev[nb] = node;
        queue.push(nb);
      }
    }
  }

  if (!found) return null;

  const path: string[] = [];
  let cur: string | null = toId;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur] ?? null;
  }

  const fromScene = scenes.find((s) => s.id === fromId);
  const toScene = scenes.find((s) => s.id === toId);

  return {
    path,
    distance: path.length - 1,
    steps: Math.max(0, path.length - 1),
    from_scene_name: fromScene?.name,
    to_scene_name: toScene?.name,
  };
}

export default findShortestPath;
