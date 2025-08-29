# Farm Sentinel

This is a Next.js starter project called Farm Sentinel, built in Firebase Studio. It's designed to demonstrate how to build a modern, AI-powered application for monitoring a smart scarecrow system.

## Features

*   **Dashboard:** An overview of your farm's status, node health, and recent bird activity.
*   **AI Daily Briefing:** Get an AI-powered summary of the day's weather, predicted bird activity, and system status.
*   **Activity & Environment:** Analyze historical data with charts for bird detections, node activations, and view a 7-day weather forecast.
*   **Node Management:** Monitor and manage all scarecrow nodes, view their status, and simulate commands.
*   **Alerts & Logs:** Review and filter through all system alerts and event logs.
*   **AI Pest Identification:** Upload a photo of a potential pest to get an AI-powered identification and analysis.
*   **AI Farm Assistant:** Chat with an AI assistant to get information about your farm with text and audio responses.
*   **User Profiles & Settings:** Manage your personal and farm information.
*   **Authentication:** Secure sign-in and sign-up functionality.

## Tech Stack

*   **Framework:** Next.js with App Router
*   **UI:** React, TypeScript, ShadCN UI, Tailwind CSS
*   **AI:** Genkit, Google AI (Gemini)
*   **Backend & Database:** Firebase (Authentication, Firestore, Cloud Functions, Cloud Storage)

---

## Running Locally

To run this project on your local machine, follow these steps:

### 1. Prerequisites

*   Node.js (v18 or later)
*   A Firebase project.
*   A Google AI API key for Genkit.

### 2. Installation

First, clone the repository and install the necessary dependencies:

```bash
npm install
```

### 3. Environment Variables

You'll need to set up your environment variables for Firebase and Google AI. Create a file named `.env` in the root of the project and add the following, replacing the placeholder values with your actual credentials.

You can find your Firebase credentials in your **Firebase project settings**. You can generate a Google AI API key from the **Google AI Studio**.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

# Google AI (Genkit) Configuration
GOOGLE_API_KEY="your_google_ai_api_key"
```

### 4. Run the Development Servers

This project requires two separate development servers to be running simultaneously: one for the Next.js frontend and one for the Genkit AI flows.

**Terminal 1: Start the Next.js App**

```bash
npm run dev
```
This will start the frontend application, usually on `http://localhost:3000`.

**Terminal 2: Start the Genkit AI Flows**

```bash
npm run genkit:watch
```
This will start the Genkit development server, which allows your AI flows to run and be tested locally.

Once both servers are running, you can open your browser to `http://localhost:3000` to see the application in action.
