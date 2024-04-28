import { Detail, LocalStorage, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";

export default function BoxBreathing() {
  const phases = ["💨 Breathe In", "🤐 Hold", "😮‍💨 Breathe Out", "🤐 Hold"];
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [seconds, setSeconds] = useState(4);
  const [completedReps, setCompletedReps] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const loadStats = async () => {
      const elapsedTime = await LocalStorage.getItem("totalTimeElapsed");
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
              updateTotalCompletedReps(newReps);
              return newReps;
            });
          }
          return 4;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPhaseIndex, seconds, completedReps]);

  const updateTotalCompletedReps = async (newReps: number) => {
    const totalRepsString = await LocalStorage.getItem("totalCompletedReps");
    const totalReps = totalRepsString ? Number(totalRepsString) : 0;
    LocalStorage.setItem("totalCompletedReps", String(totalReps + newReps));
  };

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
      phaseItems.push(phaseItems.shift()!);
    }
    return phaseItems
      .map((phase, index) => {
        if (index === 0) {
          // Only bold the first item
          return `\n\n## **${phase}**\n\n`;
        }
        return `*${phase}*`;
      })
      .join("\n\n");
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
    runHuDWarning();
  }, []);

  const markdown = `
  # 📦 Box Breathing
  
  # **${seconds}**
  ## ${displayedPhases()}


  
  &nbsp;

  ---
  
  **Reps Completed**: ${completedReps}

  `;

  return <Detail markdown={markdown} navigationTitle="Box Breathing" />;
}
