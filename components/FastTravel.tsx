"use client";

import { useState } from "react";

// Load route data from JSON file
import routeData from "@/data/fast-travel-routes.json";
import EmptyState from "@/components/EmptyState";

interface Node {
  id: string;
  name: string;
  type: string;
  area: string;
}

interface Edge {
  from: string;
  to: string;
  mode: string;
  time: number;
  steps: string[];
  transfer?: string;
}

interface RouteData {
  nodes: Node[];
  edges: Edge[];
}

interface RouteResult {
  totalTime: number;
  path: {
    from: string;
    to: string;
    mode: string;
    time: number;
    steps: string[];
    transfer?: string;
  }[];
}

const routes = routeData as RouteData;

// Generate human-readable route directions (MapQuest style)
function generateRouteDirections(path: RouteResult["path"]): string {
  if (path.length === 0) return "";

  const getNodeName = (nodeId: string) => {
    const node = routes.nodes.find((n) => n.id === nodeId);
    return node ? node.name : nodeId;
  };

  const getTransportationLabel = (mode: string) => {
    switch (mode) {
      case "monorail":
        return "Monorail";
      case "skyliner":
        return "Disney Skyliner";
      case "bus":
        return "Disney Bus";
      case "boat":
        return "Boat";
      case "walking":
        return "Walk";
      default:
        return mode;
    }
  };

  // Direct route (no transfers)
  if (path.length === 1) {
    const segment = path[0];
    const fromName = getNodeName(segment.from);
    const toName = getNodeName(segment.to);
    const transport = getTransportationLabel(segment.mode);

    if (segment.mode === "walking") {
      return `Walk from ${fromName} to ${toName} (${segment.time} min).`;
    }

    return `Take the ${transport} from ${fromName} to ${toName} (${segment.time} min).`;
  }

  // Multi-segment route with transfers
  const directions: string[] = [];

  path.forEach((segment, index) => {
    const fromName = getNodeName(segment.from);
    const toName = getNodeName(segment.to);
    const transport = getTransportationLabel(segment.mode);

    if (index === 0) {
      // First segment: departure
      if (segment.mode === "walking") {
        directions.push(`Walk from ${fromName} (${segment.time} min)`);
      } else {
        directions.push(`Take the ${transport} from ${fromName} (${segment.time} min)`);
      }
    } else if (index === path.length - 1) {
      // Last segment: arrival
      // Check if there's a transfer point before this segment
      const hasTransfer = path[index - 1]?.transfer;
      if (hasTransfer) {
        const transferNode = routes.nodes.find((n) => n.id === path[index - 1].transfer);
        const transferName = transferNode ? transferNode.name : path[index - 1].transfer;
        directions.push(`Transfer at ${transferName}`);
      }

      if (segment.mode === "walking") {
        directions.push(`Walk to ${toName} (${segment.time} min)`);
      } else {
        directions.push(`Ride to ${toName} (${segment.time} min)`);
      }
    }
    // Middle segments are handled implicitly by the transfer logic
  });

  return directions.join(", then ");
}

// Dijkstra's algorithm for shortest path
function findShortestPath(fromId: string, toId: string, edges: Edge[]): RouteResult | null {
  if (fromId === toId) {
    return null;
  }

  // Build adjacency list
  const graph: { [key: string]: { [key: string]: Edge } } = {};
  edges.forEach((edge) => {
    if (!graph[edge.from]) graph[edge.from] = {};
    graph[edge.from][edge.to] = edge;
  });

  // Dijkstra's algorithm
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: { edge: Edge; from: string } | null } = {};
  const visited = new Set<string>();

  // Initialize
  routes.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[fromId] = 0;

  while (visited.size < routes.nodes.length) {
    // Find unvisited node with minimum distance
    let minNode: string | null = null;
    let minDistance = Infinity;

    routes.nodes.forEach((node) => {
      if (!visited.has(node.id) && distances[node.id] < minDistance) {
        minDistance = distances[node.id];
        minNode = node.id;
      }
    });

    if (minNode === null || minNode === toId) break;
    visited.add(minNode);

    // Update distances to neighbors
    const neighbors = graph[minNode] || {};
    Object.entries(neighbors).forEach(([neighborId, edge]) => {
      const newDist = distances[minNode!] + edge.time;
      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist;
        previous[neighborId] = { edge, from: minNode! };
      }
    });
  }

  // Reconstruct path
  if (distances[toId] === Infinity) {
    return null;
  }

  const path: RouteResult["path"] = [];
  let current = toId;

  while (previous[current] !== null) {
    const { edge, from } = previous[current]!;
    path.unshift({ ...edge, from, to: current });
    current = from;
  }

  return {
    totalTime: distances[toId],
    path,
  };
}

// Group nodes by area for better organization
const nodesByArea = routes.nodes.reduce((acc, node) => {
  if (!acc[node.area]) acc[node.area] = [];
  acc[node.area].push(node);
  return acc;
}, {} as { [key: string]: Node[] });

const areaLabels: { [key: string]: string } = {
  "theme-parks": "Theme Parks",
  "entertainment": "Entertainment",
  "resorts": "Resorts",
  "transportation": "Transportation",
};

export default function FastTravel({ compact = false }: { compact?: boolean }) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [result, setResult] = useState<RouteResult | null>(null);

  const handleFindRoute = () => {
    if (!fromLocation || !toLocation) {
      alert("Please select both locations");
      return;
    }

    if (fromLocation === toLocation) {
      alert("You're already there! Select different locations.");
      return;
    }

    const route = findShortestPath(fromLocation, toLocation, routes.edges);
    setResult(route);
  };

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
    setResult(null);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "monorail":
        return "🚝";
      case "bus":
        return "🚌";
      case "skyliner":
        return "✈️";
      case "boat":
        return "⛵";
      case "walking":
        return "🚶";
      default:
        return "🚕";
    }
  };

  const getModePill = (mode: string) => {
    switch (mode) {
      case "monorail":
        return "pill-info";
      case "bus":
        return "pill-success";
      case "skyliner":
        return "pill-accent2";
      case "boat":
        return "pill-accent";
      case "walking":
        return "pill-warning";
      default:
        return "pill-accent";
    }
  };

  if (compact) {
    return (
      <div className="space-y-4" role="region" aria-label="Fast Travel Route Finder">
        {/* Route selection */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          <div>
            <label htmlFor="from-compact" className="block text-sm font-medium text-text-muted mb-2">
              From
            </label>
            <select
              id="from-compact"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="input-landio"
              aria-label="Select starting location"
            >
              <option value="">Select starting point</option>
              {Object.entries(nodesByArea).map(([area, nodes]) => (
                <optgroup key={area} label={areaLabels[area] || area}>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={swapLocations}
              className="btn-icon hover:rotate-180"
              aria-label="Swap from and to locations"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <div>
            <label htmlFor="to-compact" className="block text-sm font-medium text-text-muted mb-2">
              To
            </label>
            <select
              id="to-compact"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="input-landio"
              aria-label="Select destination"
            >
              <option value="">Select destination</option>
              {Object.entries(nodesByArea).map(([area, nodes]) => (
                <optgroup key={area} label={areaLabels[area] || area}>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleFindRoute}
            className="btn-primary hover:scale-105"
          >
            Find Fastest Route
          </button>
        </div>

        {/* Result display */}
        {result === null && fromLocation && toLocation && (
          <EmptyState
            icon={
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="No Route Found"
            description="No direct route found between these locations. Try selecting different locations."
          />
        )}

        {result && (
          <div className="border-t border-border pt-4" role="region" aria-live="polite">
            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-16 h-16 rounded-full ${getModePill(result.path[0]?.mode || "bus")} flex items-center justify-center text-3xl`} aria-hidden="true">
                {getModeIcon(result.path[0]?.mode || "bus")}
              </div>
              <div className="flex-1">
                <div className="text-display-lg font-bold font-display text-text">
                  {result.totalTime} minutes
                </div>
                <div className="text-sm text-text-muted">
                  {result.path.length > 1 ? `${result.path.length} transfers` : "Direct route"} • {result.path[0]?.mode || "bus"}
                </div>
              </div>
              <button
                onClick={() => setResult(null)}
                className="btn-ghost text-sm"
                aria-label="Clear route result"
                type="button"
              >
                Clear
              </button>
            </div>
            {/* Route Directions - MapQuest Style */}
            <div className="mt-4 p-4 bg-surface2 rounded-lg border border-border">
              <p className="text-sm font-medium text-text-muted mb-1">Directions</p>
              <p className="text-text leading-relaxed">{generateRouteDirections(result.path)}</p>
            </div>
          </div>
        )}

        {!result && !fromLocation && !toLocation && (
          <div className="text-center py-4">
            <p className="text-text-muted">Select your starting point and destination above to find the fastest route.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" role="region" aria-label="Fast Travel Route Finder">
      {/* ========================================
           EXPLANATION CARD - Landio Style
           ======================================== */}
      <div className="card-landio card-landio-featured mb-8 bg-gradient-to-br from-surface2 to-surface">
        <div className="section-header">
          <span className="pill-accent2 landio-kicker">FAST TRAVEL</span>
          <h2 className="text-display-xl font-bold font-display text-text mb-3 flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">✈️</span>
            Get There Fast
          </h2>
        </div>
        <p className="text-text-muted leading-relaxed">
          Find the quickest route between Disney locations using monorails, buses, boats,
          Skyliner, and walking paths.
        </p>
      </div>

      {/* ========================================
           ROUTE SELECTION - Landio Style
           ======================================== */}
      <div className="card-landio mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-text-muted mb-2">
              From
            </label>
            <select
              id="from"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="input-landio"
              aria-label="Select starting location"
            >
              <option value="">Select starting point</option>
              {Object.entries(nodesByArea).map(([area, nodes]) => (
                <optgroup key={area} label={areaLabels[area] || area}>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={swapLocations}
              className="btn-icon hover:rotate-180"
              aria-label="Swap from and to locations"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <div>
            <label htmlFor="to" className="block text-sm font-medium text-text-muted mb-2">
              To
            </label>
            <select
              id="to"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="input-landio"
              aria-label="Select destination"
            >
              <option value="">Select destination</option>
              {Object.entries(nodesByArea).map(([area, nodes]) => (
                <optgroup key={area} label={areaLabels[area] || area}>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleFindRoute}
            className="btn-primary hover:scale-105"
          >
            Find Fastest Route
          </button>
        </div>
      </div>

      {/* ========================================
           RESULTS - Landio Style
           ======================================== */}
      {result === null && fromLocation && toLocation && (
        <EmptyState
          icon={
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="No Route Found"
          description="No direct route found between these locations. Try selecting different locations."
        />
      )}

      {result && (
        <div className="card-landio card-landio-featured" role="region" aria-live="polite">
          <div className="section-header border-b border-border pb-4">
            <span className="pill-success landio-kicker">ROUTE FOUND</span>
            <h3 className="text-display-lg font-bold font-display text-text">
              Total: {result.totalTime} minutes
            </h3>
          </div>

          {/* Route Directions - MapQuest Style */}
          <div className="p-6 bg-surface2 border-b border-border">
            <p className="text-sm font-medium text-text-muted mb-1">Directions</p>
            <p className="text-text leading-relaxed">{generateRouteDirections(result.path)}</p>
          </div>

          <div className="p-6 space-y-6">
            {result.path.map((segment, index) => (
              <div key={index} className="relative" role="listitem">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getModePill(segment.mode)} flex items-center justify-center text-2xl`} aria-hidden="true">
                    {getModeIcon(segment.mode)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-text capitalize">{segment.mode}</h4>
                      <span className={`text-sm ${getModePill(segment.mode)} tag-landio`} aria-label={`${segment.time} minutes`}>
                        {segment.time} min
                      </span>
                      {segment.transfer && (
                        <span className="tag-landio pill-warning">
                          Transfer at {segment.transfer}
                        </span>
                      )}
                    </div>
                    <ol className="text-sm text-text-muted space-y-1">
                      {segment.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="text-accent flex-shrink-0" aria-hidden="true">{stepIndex + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {index < result.path.length - 1 && (
                  <div className="ml-6 mt-4 pb-4 border-l-2 border-dashed border-border" aria-hidden="true"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !fromLocation && !toLocation && (
        <EmptyState
          icon={
            <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          title="Find Your Route"
          description="Select your starting point and destination to find the fastest route."
        />
      )}
    </div>
  );
}
