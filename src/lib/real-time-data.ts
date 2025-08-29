// src/lib/real-time-data.ts

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "./firebase";
import { mockNodes, mockAlerts, mockLogs } from "./mock-data"; // import your mock data

// Helper function to push a dataset into a collection
const pushData = async (collectionName: string, data: any[]) => {
  const colRef = collection(firestore, collectionName);

  for (const item of data) {
    try {
      await addDoc(colRef, {
        ...item,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`❌ Error adding document to ${collectionName}:`, error);
    }
  }
};

// Function to stream mock data to Firebase
export const streamMockData = async () => {
  console.log("🚀 Streaming mock data to Firebase...");

  await pushData("nodes", mockNodes);
  await pushData("alerts", mockAlerts);
  await pushData("logs", mockLogs);

  console.log("✅ Mock data pushed successfully!");
};
