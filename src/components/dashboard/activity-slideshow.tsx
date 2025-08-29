'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BirdDetectionFrequencyChart from '@/components/activity/bird-detection-frequency-chart';
import NodeActivationChart from '@/components/activity/node-activation-chart';

const chartComponents = [
  { title: 'Bird Detection Frequency', description: 'Detections per hour over the last 24 hours.', component: <BirdDetectionFrequencyChart /> },
  { title: 'Node Activation Count', description: 'Activations per node in the last 24 hours.', component: <NodeActivationChart /> },
];

export default function ActivitySlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % chartComponents.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + chartComponents.length) % chartComponents.length);
  };
  
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);
  
  const currentChart = chartComponents[currentIndex];

  return (
      <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{currentChart.title}</CardTitle>
                    <CardDescription>{currentChart.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="icon" className="h-8 w-8" onClick={prevSlide}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8" onClick={nextSlide}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {currentChart.component}
        </CardContent>
      </Card>
  );
}
