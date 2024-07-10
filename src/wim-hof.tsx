import { Detail, showToast, Toast, ActionPanel, Action, Icon, Alert } from "@raycast/api";
import { useState, useEffect, useRef } from "react";

export default function WimHof() {
  const [breaths, setBreaths] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const secondHolds = [45, 60, 90];
  const breathStates = ["Breathe In", "Breathe Out"];
  const [currentBreathState, setCurrentBreathState] = useState(breathStates[0]);
  const [currentRep, setCurrentRep] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const breathMessage = async (message: string) => {
    await showToast({ title: "Breath Hold", message: message });
  };

  const secondsMessage = async () => {
    await showToast({ title: "Timer Start", message: "Timer Started" });
  };

  const startBreathing = () => {
    secondsMessage();
    intervalRef.current = setInterval(() => {
      setBreaths((prevBreaths) => prevBreaths + 1);
    }, 3500);
  };

  const startHold = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);

    timeoutRef.current = setTimeout(
      () => {
        breathMessage("Well done");
        if (currentRep < 3) {
          setCurrentRep(currentRep + 1);
          setBreaths(1);
          startBreathing();
        } else {
          setIsRunning(false);
        }
      },
      secondHolds[currentRep - 1] * 1000,
    );
  };

  useEffect(() => {
    if (isRunning) {
      if (breaths === 1) {
        breathMessage("Starting Breath hold");
      }
      if (breaths === 5) {
        startHold();
      } else if (breaths <= 30) {
        startBreathing();
      }
    } else {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    }

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, [isRunning, breaths, currentRep]);

  const startTimer = () => {
    setBreaths(1);
    setCurrentRep(1);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const markdown = `
# Wim Hof Meditation


**Breaths**: ${breaths}

**Current Rep**: ${currentRep}

**Current State**: ${currentBreathState}
  `;

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          {isRunning ? (
            <Action title="Stop Timer" icon={Icon.XmarkCircle} onAction={stopTimer} />
          ) : (
            <Action title="Start Timer" icon={Icon.Play} onAction={startTimer} />
          )}
          <Action title="Restart Timer" icon={Icon.ArrowCounterClockwise} onAction={startTimer} />
        </ActionPanel>
      }
    />
  );
}
