import { Detail } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
  const [phase, setPhase] = useState<"Breathe In" | "Hold" | "Breathe Out" | "Hold">("Breathe In");
  const [seconds, setSeconds] = useState<number>(4);
  const [completedReps, setCompletedReps] = useState<number>(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState<number>(0);
  const [repInProgress, setRepInProgress] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    setStartTime(Date.now());

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          switch (phase) {
            case "Breathe In":
              setPhase("Hold");
              return 4;
            case "Hold":
              if (!repInProgress) {
                // Start a new rep when transitioning to the first "Hold" in each cycle
                setRepInProgress(true);
              }
              setPhase("Breathe Out");
              return 4;
            case "Breathe Out":
              setPhase("Hold");
              return 4;
            default:
              return 4;
          }
        } else {
          return prevSeconds - 1;
        }
      });

      // Check for completed rep (entire 16-second cycle)
      if (repInProgress && phase === "Hold" && seconds === 4) {
        // Increment completed reps count when a full cycle is completed
        setCompletedReps((prevReps) => prevReps + 1);
        setRepInProgress(false); // Reset rep in progress flag for the next cycle
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, repInProgress]);

  useEffect(() => {
    const currentTime = Date.now();
    const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
    setTotalTimeElapsed(elapsedTimeInSeconds);
  }, [startTime]);

  const phaseText = phase === "Breathe In" ? "Breathe In" : phase === "Breathe Out" ? "Breathe Out" : "Hold";

  const markdown = `
  # Breathing Exercise

  \`\`\`plaintext
  ${seconds} seconds - ${phaseText}
  \`\`\`

  ---

  ## Completed Reps

  Reps Completed: ${completedReps}

  ---

  ## Total Time Elapsed
  
  ${totalTimeElapsed} seconds
  `;

  return <Detail markdown={markdown} navigationTitle="Breathe" />;
}
