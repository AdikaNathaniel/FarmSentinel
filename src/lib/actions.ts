
'use server';

import { getWeatherSummary } from "@/ai/flows/weather-summary-flow";
import { predictBirdActivity } from "@/ai/flows/predict-bird-activity";
import { generateDailyBriefing } from "@/ai/flows/generate-daily-briefing-flow";
import { askFarmAssistant } from "@/ai/flows/ask-farm-assistant-flow";
import { mockDetectionFrequency } from "./mock-data";

type FormState = {
    message: string | null;
    result?: any;
    history?: any[];
};

// A mock function to get the user's configured farm location.
// In a real app, this would come from the user's profile in a database.
async function getFarmLocation() {
    return {
        latitude: 36.7783, // Default to Fresno, CA
        longitude: -119.4179
    }
}

export async function getWeatherForecastAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const location = await getFarmLocation();
    const result = await getWeatherSummary({ 
        latitude: location.latitude, 
        longitude: location.longitude 
    });
    return { message: null, result };
  } catch (e: any) {
    console.error(e);
    return { message: e.message || "An unexpected error occurred." };
  }
}

export async function predictBirdActivityAction(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      // In a real app, this data would be fetched from a database.
      const result = await predictBirdActivity({ detectionFrequency: mockDetectionFrequency });
      return { message: null, result };
    } catch (e: any) {
      console.error(e);
      return { message: e.message || "An unexpected error occurred." };
    }
}

export async function generateDailyBriefingAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
      const location = await getFarmLocation();
      const result = await generateDailyBriefing(location);
      return { message: null, result };
    } catch (e: any) {
      console.error(e);
      return { message: e.message || "An unexpected error occurred." };
    }
}


export async function askFarmAssistantAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const question = formData.get('question') as string;
    if (!question) {
        return { message: 'Please enter a question.', history: prevState.history };
    }

    const newHistory = [...(prevState.history || []), { role: 'user', text: question }];

    try {
        const location = await getFarmLocation();
        const result = await askFarmAssistant({ question, location });
        
        const assistantMessage = {
            role: 'assistant',
            text: result.answer,
            audioDataUri: result.audioDataUri,
        };

        return { 
            message: null, 
            history: [...newHistory, assistantMessage]
        };

    } catch (e: any) {
      console.error(e);
      return { message: e.message || "An unexpected error occurred.", history: newHistory };
    }
}
