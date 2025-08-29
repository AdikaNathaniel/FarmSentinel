"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { firestore } from "../lib/firebase";

interface Node {
  id: string;
  status: string;
  battery: number;
  health: string;
  lastPing: string;
}

export default function RealtimeData() {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    // Subscribe to latest nodes
    const q = query(collection(firestore, "nodes"), orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData: Node[] = snapshot.docs.map((doc) => {
        const { id: _id, ...data } = doc.data() as Node;
        return {
          id: doc.id,
          ...data,
        };
      });
      setNodes(newData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-3">🔴 Real-time Node Data</h2>
      <ul className="space-y-2">
        {nodes.map((node) => (
          <li
            key={node.id}
            className="p-3 border rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{node.id}</p>
              <p className="text-sm text-gray-500">Last Ping: {node.lastPing}</p>
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  node.health === "ok"
                    ? "bg-green-200 text-green-800"
                    : node.health === "warning"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {node.health.toUpperCase()}
              </span>
              <p className="text-xs text-gray-600">Battery: {node.battery}%</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
