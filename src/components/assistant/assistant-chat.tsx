
'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { askFarmAssistantAction } from '@/lib/actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Send, Bot, User, Volume2, Waves } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  text: string;
  audioDataUri?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      <span className="sr-only">Send</span>
    </Button>
  );
}

export default function AssistantChat() {
  const initialState: { message: string | null, history: Message[] } = { message: null, history: [] };
  const [state, dispatch] = useActionState(askFarmAssistantAction, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const latestMessage = state.history[state.history.length - 1];
    if (latestMessage?.role === 'assistant' && latestMessage.audioDataUri && audioRef.current) {
        audioRef.current.src = latestMessage.audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [state.history]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [state.history]);

  return (
    <Card className="flex flex-col h-full max-h-[70vh]">
      <CardContent className="flex-grow p-4">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {state.history.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <Bot className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-semibold">Farm Sentinel Assistant</h3>
                    <p className="mt-2">I'm ready to help. Ask me about your system status, weather, or recent activity.</p>
                    <p className="text-xs mt-4">For example: <em className="italic">"How many nodes are offline?"</em></p>
                </div>
            )}
            {state.history.map((msg, index) => (
              <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                {msg.role === 'assistant' && (
                  <Avatar>
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                    "rounded-lg px-4 py-3 max-w-sm", 
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <p className="text-sm">{msg.text}</p>
                   {msg.audioDataUri && (
                     <Button variant="ghost" size="sm" className="mt-2 -ml-2 h-auto p-2" onClick={() => audioRef.current?.play()}>
                        <Volume2 className="h-4 w-4 mr-2"/>
                        Play Audio
                     </Button>
                   )}
                </div>
                {msg.role === 'user' && (
                  <Avatar>
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {useFormStatus().pending && (
                <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                     <div className="rounded-lg px-4 py-3 max-w-sm bg-muted flex items-center gap-2">
                        <Waves className="h-5 w-5 text-primary animate-pulse" />
                        <p className="text-sm text-muted-foreground italic">Thinking...</p>
                     </div>
                </div>
             )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form action={(formData) => {
            dispatch(formData);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }} className="flex w-full gap-2">
          <Input name="question" placeholder="Ask your question..." required ref={inputRef} />
          <SubmitButton />
        </form>
         <audio ref={audioRef} className="hidden" />
      </CardFooter>
        {state.message && (
            <div className="p-6 pt-0">
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
            </div>
          )}
    </Card>
  );
}
