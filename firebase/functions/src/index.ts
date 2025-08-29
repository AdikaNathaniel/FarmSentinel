
/**
 * This is the main entry point for all Firebase Cloud Functions.
 * It exports all the functions from the other files in this directory.
 * When you deploy, Firebase will look at this file to determine which
 * functions to make available.
 */

// Initialize Firebase Admin SDK
import { initializeApp } from "firebase-admin/app";
initializeApp();

// Export all functions from their respective files
export * from "./api/node-comms";
export * from "./callable/app-functions";
export * from "./triggers/firestore-triggers";
