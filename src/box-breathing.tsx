import { Detail, LocalStorage, ActionPanel, Action, Icon, showToast, Toast, Color } from "@raycast/api";
import { useEffect, useState } from "react";

export default function BoxBreathing() {
  const phases = ["💨 Breathe In", "🤐 Hold", "😮‍💨 Breathe Out", "🤐 Hold"];
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [seconds, setSeconds] = useState(4);
  const [completedReps, setCompletedReps] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const loadStats = async () => {
      const elapsedTime = await LocalStorage.getItem("totalTimeElapsed");
      const savedTime = elapsedTime ? Number(elapsedTime) : 0;

      setStartTime(Date.now() - savedTime * 1000);
    };
    loadStats();
  }, []);

  useEffect(() => {
    if (isTimerActive) {
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
    }
  }, [currentPhaseIndex, seconds, isTimerActive]);

  const updateTotalCompletedReps = async (newReps: number) => {
    const totalRepsString = await LocalStorage.getItem("totalCompletedReps");
    const totalReps = totalRepsString ? Number(totalRepsString) : 0;
    LocalStorage.setItem("totalCompletedReps", String(totalReps + newReps));
  };

  useEffect(() => {
    if (isTimerActive) {
      const interval = setInterval(() => {
        const elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        setTotalTimeElapsed(elapsedTimeInSeconds);
        LocalStorage.setItem("totalTimeElapsed", String(elapsedTimeInSeconds));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerActive, startTime]);

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

  const startBoxBreathing = () => {
    if (isTimerActive) {
      // setIsTimerActive(false);
      setSeconds(4);
      setCompletedReps(0);
      showToast({
        style: Toast.Style.Success,
        title: "Restarting",
        message: "Let's go from the top!",
      });
    } else {
      setIsTimerActive(true);
      setSeconds(4);
      showToast({
        style: Toast.Style.Success,
        title: "Starting",
        message: "You got this!",
      });
    }
  };

  const showEmojiNumber = () => {
    if (seconds === 4) {
      return "4️⃣";
    } else if (seconds === 3) {
      return "3️⃣";
    } else if (seconds === 2) {
      return "2️⃣";
    }
    return "1️⃣";
  };

  const markdown = `
  # 📦 Box Breathing 
  ${!isTimerActive ? "*Press enter to start*" : ""}
  # ${isTimerActive ? `**${showEmojiNumber()}**` : ""}
  ## ${displayedPhases()}
  
  
  &nbsp;

  ---
  
  
  **Reps Completed**: ${completedReps}

  `;

  return (
    <Detail
      markdown={markdown}
      navigationTitle="Box Breathing"
      actions={
        <ActionPanel>
          <Action
            title={isTimerActive ? "Restart Timer" : "Start Timer"}
            onAction={startBoxBreathing}
            icon={isTimerActive ? Icon.ArrowCounterClockwise : { source: Icon.Circle, tintColor: Color.Blue }}
          />
        </ActionPanel>
      }
    />
  );
}
