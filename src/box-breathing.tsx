import { Detail, LocalStorage, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";

export default function BoxBreathing() {
  const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"];
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [seconds, setSeconds] = useState(4);
  const [completedReps, setCompletedReps] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const loadStats = async () => {
      const savedReps = await LocalStorage.getItem("completedReps");
      const elapsedTime = await LocalStorage.getItem("totalTimeElapsed");
      setCompletedReps(savedReps ? Number(savedReps) : 0);
      const savedTime = elapsedTime ? Number(elapsedTime) : 0;
      setTotalTimeElapsed(savedTime);
      setStartTime(Date.now() - savedTime * 1000);
    };
    loadStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          setCurrentPhaseIndex(nextPhaseIndex);
          if (nextPhaseIndex === 0) {
            setCompletedReps((prevReps) => {
              const newReps = prevReps + 1;
              LocalStorage.setItem("completedReps", String(newReps));
              return newReps;
            });
          }
          return 4;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPhaseIndex, seconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTotalTimeElapsed(elapsedTimeInSeconds);
      LocalStorage.setItem("totalTimeElapsed", String(elapsedTimeInSeconds));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const displayedPhases = () => {
    const phaseItems = [...phases];
    while (phaseItems[0] !== phases[currentPhaseIndex]) {
      phaseItems.push(phaseItems.shift()!); // Assertion used here
    }
    return phaseItems.join(" ― ");
  };

  const runHuDWarning = async () => {
    if (completedReps === 0) return;

    const options: Toast.Options = {
      style: Toast.Style.Success,
      title: "Well done! 🎉",
      message: `You've completed ${completedReps} reps of Box Breathing!`,
      primaryAction: {
        title: "Reset",
        onAction: (toast) => {
          toast.hide();
        },
      },
    };
    await showToast(options);
  };

  useEffect(() => {
    return () => {
      runHuDWarning();
    };
  }, []);

  const markdown = `
  # ------------  📦 Box Breathing ------------
  
  # **${seconds}**
  ## **${displayedPhases()}**
  
  ---
  
  **Current Rep**: ${completedReps + 1}
  
  **Reps Completed**: ${completedReps}

  `;

  return <Detail markdown={markdown} navigationTitle="Box Breathing" />;
}
