import { config } from 'dotenv';
config();

// Genkit flows are imported here to be available for the development server.
import './flows/pest-management-flow';
import './flows/predict-bird-activity';
import './flows/generate-daily-briefing-flow';
import './flows/ask-farm-assistant-flow';
