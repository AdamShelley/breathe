import { Detail, showToast, ActionPanel, Action, Icon } from "@raycast/api";
import { useState, useEffect, useRef } from "react";

export default function WimHof() {
  const [breaths, setBreaths] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const secondHolds = [10, 15, 20];
  const [recoveryBreath, setRecoveryBreath] = useState(0);
  const [breathHeld, setBreathHeld] = useState(0);
  const breathStates = ["Breathe In", "Breathe Out", "Hold Out", "Hold In"];
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
    clearAllIntervals();

    if (breaths === 1) secondsMessage();

    intervalRef.current = setInterval(() => {
      setBreaths((prevBreaths) => prevBreaths + 1);
    }, 4000);

    breathStateRef.current = setInterval(() => {
      setCurrentBreathState((prevBreathState) => {
        return prevBreathState === breathStates[0] ? breathStates[1] : breathStates[0];
      });
    }, 2000);
  };

  const startHoldOut = () => {
    clearAllIntervals();

    setCurrentBreathState(breathStates[2]);
    breathMessage("Start Breath Hold");

    let localBreathHeld = 0;
    timeoutRef.current = setInterval(() => {
      localBreathHeld += 1;
      setBreathHeld(localBreathHeld);

      if (localBreathHeld === secondHolds[currentRep - 1]) {
        breathMessage("Well Done");
        clearInterval(timeoutRef.current!);
        startHoldIn();
      }
    }, 1000);
  };

  const startHoldIn = () => {
    clearAllIntervals();

    setCurrentBreathState(breathStates[3]);
    breathMessage("Start Breath Hold");

    let localBreathIn = 0;

    // Trigger every second

    localBreathIn += 1;
    setRecoveryBreath(localBreathIn);

    setTimeout(() => {
      setCurrentBreathState(breathStates[0]);
      setBreaths(0);
      setBreathHeld(0);
      if (currentRep < 3) {
        setCurrentRep(currentRep + 1);
        startBreathing();
      } else {
        setIsRunning(false);
        breathMessage("Finished all reps");
      }
    }, 15000);
  };

  // const pause = (milliseconds: number) => {
  //   return new Promise((resolve) => {
  //     pauseRef.current = setTimeout(resolve, milliseconds);
  //   }).then(() => {
  //     startBreathing();
  //   });
  // };

  useEffect(() => {
    if (isRunning) {
      if (breaths === 1) {
        breathMessage("Starting Breath hold");
      }
      if (breaths === 5) {
        startHoldOut();
      } else {
        startBreathing();
      }
    } else {
      clearAllIntervals();
    }

    return () => {
      clearAllIntervals();
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

  const clearAllIntervals = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathStateRef.current) clearInterval(breathStateRef.current);
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    if (pauseRef.current) clearTimeout(pauseRef.current);
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

${currentBreathState === "Hold In" ? `${recoveryBreath} seconds` : ""}


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
