import { Detail } from "@raycast/api";
import { useEffect, useState } from "react";

export default function BoxBreathing() {
  const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"] as const;

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [seconds, setSeconds] = useState(4);
  const [completedReps, setCompletedReps] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [startTime] = useState(Date.now());

  const currentPhase = phases[currentPhaseIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          setCurrentPhaseIndex(nextPhaseIndex);
          return 4;
        }
        return prevSeconds - 1;
      });

      if (currentPhase === "Hold" && seconds === 1) {
        setCompletedReps((prevReps) => prevReps + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPhaseIndex, seconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTotalTimeElapsed(elapsedTimeInSeconds);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const markdown = `

  # 🧘 Breathing Exercise

  ## Phase: **${currentPhase}**

  ### Time Remaining:
  # **${seconds}s**

  ---
  **Current Rep**: ${completedReps + 1}
  
  **Reps Completed**: ${completedReps}
  **Elapsed Time**: ${totalTimeElapsed} seconds
  `;

  return <Detail markdown={markdown} navigationTitle="Box Breathing" />;
}
