
'use server';
/**
 * @fileOverview A conversational AI farm assistant that can answer questions and provide audio responses.
 *
 * - askFarmAssistant - A function that takes a user's question and returns a text and audio response.
 * - AskFarmAssistantInput - The input type for the askFarmAssistant function.
 * - AskFarmAssistantOutput - The return type for the askFarmAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getWeatherForecastTool } from '@/ai/tools/get-weather-forecast';
import { getSystemStatusTool } from '@/ai/tools/get-system-status';
import wav from 'wav';

const AskFarmAssistantInputSchema = z.object({
  question: z.string().describe("The user's question about the farm."),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});
export type AskFarmAssistantInput = z.infer<typeof AskFarmAssistantInputSchema>;

const AskFarmAssistantOutputSchema = z.object({
  answer: z.string().describe('The text response to the user\'s question.'),
  audioDataUri: z.string().describe('The audio response as a data URI.'),
});
export type AskFarmAssistantOutput = z.infer<
  typeof AskFarmAssistantOutputSchema
>;

export async function askFarmAssistant(
  input: AskFarmAssistantInput
): Promise<AskFarmAssistantOutput> {
  return askFarmAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askFarmAssistantPrompt',
  tools: [getWeatherForecastTool, getSystemStatusTool],
  input: { schema: AskFarmAssistantInputSchema },
  prompt: `You are a friendly and helpful farm assistant named 'Sentinel'. Your goal is to answer the user's questions about their farm based on the available data from your tools.

  Keep your answers concise and conversational.

  User's question: "{{question}}"
  Farm location: latitude: {{{location.latitude}}}, longitude: {{{location.longitude}}}.
  `,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const askFarmAssistantFlow = ai.defineFlow(
  {
    name: 'askFarmAssistantFlow',
    inputSchema: AskFarmAssistantInputSchema,
    outputSchema: AskFarmAssistantOutputSchema,
  },
  async (input) => {
    // 1. Generate a text answer using the LLM and tools.
    const llmResponse = await prompt(input);
    const answer = llmResponse.text;

    // 2. Generate the audio response from the text answer.
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: answer,
    });

    if (!media) {
      throw new Error('No audio media was returned from the TTS model.');
    }
    
    // 3. Convert the raw PCM audio data to WAV format.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      answer: answer,
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
