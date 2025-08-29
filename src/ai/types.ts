import { z } from 'zod';

export const WeatherSummaryInputSchema = z.object({
  latitude: z.number().describe('The latitude for the weather forecast.'),
  longitude: z.number().describe('The longitude for the weather forecast.'),
});
export type WeatherSummaryInput = z.infer<typeof WeatherSummaryInputSchema>;

const ForecastDataSchema = z.object({
  date: z.string().describe('The date of the forecast in ISO format.'),
  tempHigh: z.number().describe('The high temperature in Celsius.'),
  tempLow: z.number().describe('The low temperature in Celsius.'),
  precipitation: z.number().describe('The precipitation amount in mm.'),
  condition: z.string().describe('A brief description of the weather condition.'),
});

export const WeatherSummaryOutputSchema = z.object({
  summary: z.string().describe('A farmer-friendly summary of the upcoming week\'s weather, highlighting key events like rain, high winds, or significant temperature changes.'),
  forecast: z.array(ForecastDataSchema).describe('The structured 7-day forecast data.'),
});
export type WeatherSummaryOutput = z.infer<typeof WeatherSummaryOutputSchema>;


export const ManagePestInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a potential pest (insect, weed, or fungus), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userNotes: z.string().describe('Any additional notes from the user about where the pest was found or its behavior.').optional(),
});
export type ManagePestInput = z.infer<typeof ManagePestInputSchema>;

export const ManagePestOutputSchema = z.object({
  isPest: z.boolean().describe('Whether or not the image contains a recognizable agricultural pest.'),
  pestName: z.string().describe('The common name of the identified pest.'),
  description: z.string().describe("A detailed description of the pest, its lifecycle, and characteristics."),
  impact: z.string().describe("The potential impact of this pest on crops."),
  recommendations: z.string().describe("High-level, non-pesticide recommendations for managing or controlling the pest."),
});
export type ManagePestOutput = z.infer<typeof ManagePestOutputSchema>;
