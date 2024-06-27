import { Detail, showToast, Toast, ActionPanel, Action, LocalStorage, Icon } from "@raycast/api";
import { useState, useEffect } from "react";

export default function CalmingTimer() {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const updateTotalElapsedTime = async () => {
    const totalElapsedTimeString = await LocalStorage.getItem("totalTimeElapsed");
    const totalElapsedTime = totalElapsedTimeString ? Number(totalElapsedTimeString) : 0;

    LocalStorage.setItem("totalElapsedTime", String(totalElapsedTime + 10));

    // Also add 1 to total completed sessions in stats
    const totalCompletedRepsString = await LocalStorage.getItem("totalCompletedReps");
    const totalCompletedReps = totalCompletedRepsString ? Number(totalCompletedRepsString) : 0;
    LocalStorage.setItem("totalCompletedReps", String(totalCompletedReps + 1));
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      const intervalId = setInterval(() => {
        setSecondsLeft((currentSeconds) => currentSeconds - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (secondsLeft === 0) {
      showToast({
        style: Toast.Style.Success,
        title: "Well done!",
        message: "Take a deep breath and carry on with your amazing day!",
      });
      updateTotalElapsedTime();
      setIsRunning(false);
    }
  }, [secondsLeft, isRunning]);

  const restartTimer = () => {
    setSecondsLeft(10);
    setIsRunning(true);
  };

  const progressBar = "▣".repeat(10 - secondsLeft) + "□".repeat(secondsLeft);

  const markdown = `
  # ◕ Take a Moment to Relax 

### Relax and watch the progress as you breathe:
  &nbsp;

${progressBar} **${secondsLeft} seconds**

&nbsp;

${secondsLeft === 0 ? "### 🎉 Great job! Feel refreshed and continue your day! 🎉" : "### Keep breathing slowly..."}
  `;

  return (
    <Detail
      markdown={markdown}
      navigationTitle="Calm Down for 10 Seconds"
      actions={
        <ActionPanel>
          <Action title="Restart Timer" onAction={restartTimer} icon={Icon.ArrowCounterClockwise} />
        </ActionPanel>
      }
    />
  );
}
