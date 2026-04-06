import { useEffect, useState } from "react";

interface UsePlaybackOptions {
  totalSteps: number;
  delayMs: number;
  timelineKey: number;
  autoPlay: boolean;
}

export function usePlayback({
  totalSteps,
  delayMs,
  timelineKey,
  autoPlay,
}: UsePlaybackOptions) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(autoPlay && totalSteps > 1);
  }, [autoPlay, timelineKey, totalSteps]);

  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) {
      return undefined;
    }

    if (stepIndex >= totalSteps - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, totalSteps - 1));
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs, isPlaying, stepIndex, totalSteps]);

  const clampStep = (nextStep: number) =>
    Math.max(0, Math.min(totalSteps - 1, nextStep));

  return {
    stepIndex,
    isPlaying,
    play: () => {
      if (totalSteps > 1) {
        setIsPlaying(true);
      }
    },
    pause: () => setIsPlaying(false),
    reset: () => {
      setIsPlaying(false);
      setStepIndex(0);
    },
    scrubTo: (nextStep: number) => {
      setIsPlaying(false);
      setStepIndex(clampStep(nextStep));
    },
  };
}
