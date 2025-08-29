
'use client';

import React, { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { managePest } from '@/ai/flows/pest-management-flow';
import type { ManagePestOutput } from '@/ai/flows/pest-management-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Bug, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bug className="mr-2 h-4 w-4" />}
      Analyze Pest
    </Button>
  );
}

type FormState = {
  message: string | null;
  result?: ManagePestOutput | null;
};

async function managePestAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const imageFile = formData.get('pestImage') as File;
  const userNotes = formData.get('userNotes') as string;

  if (!imageFile || imageFile.size === 0) {
    return { message: "Please upload an image of the pest." };
  }

  // Convert image to data URI
  const buffer = await imageFile.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const photoDataUri = `data:${imageFile.type};base64,${base64}`;

  try {
    const result = await managePest({ photoDataUri, userNotes });
    return { message: null, result };
  } catch (e: any) {
    console.error(e);
    return { message: e.message || "An unexpected error occurred during analysis." };
  }
}

export default function PestManager() {
  const initialState = { message: null, result: null };
  const [state, dispatch] = useActionState(managePestAction, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPreviewUrl(null);
    }
  };

  return (
    <Card>
      <form action={dispatch}>
        <CardHeader>
          <CardTitle>Pest Analysis</CardTitle>
          <CardDescription>Upload an image and add notes for analysis and management advice.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="pestImage">Pest Image</Label>
                    <Input id="pestImage" name="pestImage" type="file" accept="image/*" required onChange={handleImageChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="userNotes">Notes (Optional)</Label>
                    <Textarea id="userNotes" name="userNotes" placeholder="e.g., Found on the underside of tomato leaves. Small, green insects."/>
                </div>
                 <div className="aspect-video w-full rounded-lg border border-dashed flex items-center justify-center">
                    {previewUrl ? (
                        <Image src={previewUrl} alt="Pest preview" width={400} height={225} className="rounded-lg object-contain max-h-full" />
                    ) : (
                        <div className="text-center text-muted-foreground p-4">
                            <Bug className="mx-auto h-12 w-12" />
                            <p className="mt-2">Image preview will appear here.</p>
                        </div>
                    )}
                 </div>
            </div>
            <div className="space-y-4">
                <Label>Analysis Result</Label>
                {useFormStatus().pending ? (
                    <div className="space-y-4 rounded-lg border p-4">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : state?.result ? (
                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {state.result.isPest ? <Check className="h-6 w-6 text-green-500" /> : <X className="h-6 w-6 text-destructive" />}
                                <h3 className="text-xl font-semibold">{state.result.pestName}</h3>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium">Description</h4>
                            <p className="text-muted-foreground text-sm">{state.result.description}</p>
                        </div>
                         <div>
                            <h4 className="font-medium">Potential Impact</h4>
                            <p className="text-muted-foreground text-sm">{state.result.impact}</p>
                        </div>
                         <div>
                            <h4 className="font-medium">Management Recommendations</h4>
                            <p className="text-muted-foreground text-sm">{state.result.recommendations}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full min-h-64 items-center justify-center rounded-lg border border-dashed">
                        <div className="text-center text-muted-foreground">
                            <p>Your pest analysis will appear here.</p>
                        </div>
                    </div>
                )}
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          {state?.message && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
