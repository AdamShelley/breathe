import { Detail, showToast, ActionPanel, Action, Icon } from "@raycast/api";
import { useState, useEffect, useRef } from "react";

export default function WimHof() {
  const [breaths, setBreaths] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const secondHolds = [10, 15, 20];
  const [breathHeld, setBreathHeld] = useState(0);
  const breathStates = ["Breathe In", "Breathe Out"];
  const [currentBreathState, setCurrentBreathState] = useState(breathStates[0]);
  const [currentRep, setCurrentRep] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const breathStateRef = useRef<NodeJS.Timeout | null>(null);
  const pauseRef = useRef<NodeJS.Timeout | null>(null);

  const breathMessage = async (message: string) => {
    await showToast({ title: "Breath Hold", message: message });
  };

  const secondsMessage = async () => {
    await showToast({ title: "Timer Start", message: "Timer Started" });
  };

  const startBreathing = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathStateRef.current) clearInterval(breathStateRef.current);
    if (breaths === 1) secondsMessage();

    intervalRef.current = setInterval(() => {
      setBreaths((prevBreaths) => prevBreaths + 1);
    }, 4000);

    breathStateRef.current = setInterval(() => {
      setCurrentBreathState((prevBreathState) => {
        if (prevBreathState === breathStates[0]) {
          return breathStates[1];
        } else {
          return breathStates[0];
        }
      });
    }, 2000);
  };

  const startHold = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    if (breathStateRef.current !== null) clearInterval(breathStateRef.current);

    let localBreathHeld = 0;

    timeoutRef.current = setInterval(() => {
      breathMessage("Hold");
      localBreathHeld += 1;
      setBreathHeld(localBreathHeld);

      setBreathHeld((prevBreathHeld) => {
        const newBreathHeld = prevBreathHeld + 1;

        if (newBreathHeld === secondHolds[currentRep - 1]) {
          breathMessage("Well done");
          if (currentRep < 3) {
            breathMessage("Take a deep breath in and hold for 15 seconds");

            setBreaths(1);
            setBreathHeld(0);
            setCurrentRep(currentRep + 1);

            setTimeout(() => {
              pause(3000);
              startBreathing();
            }, 15000);
          } else {
            // Finished all reps
            setIsRunning(false);

            setTimeout(() => {
              showToast({ title: "Wim Hof Method", message: "Finished all reps" });
            }, 3000);
          }
        }

        return newBreathHeld;
      });
    }, 1000);
  };

  const pause = (milliseconds: number) => {
    return new Promise((resolve) => {
      pauseRef.current = setTimeout(resolve, milliseconds);
    }).then(() => {
      startBreathing();
    });
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
      if (breathStateRef.current !== null) clearInterval(breathStateRef.current);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      if (pauseRef.current !== null) clearTimeout(pauseRef.current);
    }

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (breathStateRef.current !== null) clearInterval(breathStateRef.current);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      if (pauseRef.current !== null) clearTimeout(pauseRef.current);
    };
  }, [isRunning, breaths, currentRep]);

  const startTimer = () => {
    setBreaths(1);
    setCurrentRep(1);
    setBreathHeld(0);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const breathHoldsCount = Math.max(secondHolds[currentRep - 1] - breathHeld, 0);
  const breathholds = "▣".repeat(breathHeld) + "□".repeat(breathHoldsCount);

  const markdown = `
# Wim Hof Meditation


**Breaths**: 

${breaths ? breaths : ""}



**Current State**: ${currentBreathState}

**Breath Held**: 

${breathholds}  **${breathHoldsCount} seconds**
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

// 30 breaths
// 1 min hold
// 15  second deep breath in
// repeat
