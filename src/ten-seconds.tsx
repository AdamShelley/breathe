import { Detail, showToast, Toast, ActionPanel, Action, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";

export default function CalmingTimer() {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const updateTotalElapsedTime = async () => {
    const totalElapsedTimeString = await LocalStorage.getItem("totalTimeElapsed");
    const totalElapsedTime = totalElapsedTimeString ? Number(totalElapsedTimeString) : 0;

    LocalStorage.setItem("totalElapsedTime", String(totalElapsedTime + 10));
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

  const markdown = `
# 🌼 Take a moment to relax 🌼
## Please take a deep breath and relax for a few moments.
${"🟢".repeat(secondsLeft) + "⚪️".repeat(10 - secondsLeft)}

**${secondsLeft} seconds**

${secondsLeft === 0 ? "Well done, take a deep breath and carry on with your day! 🌟" : ""}
  `;

  return (
    <Detail
      markdown={markdown}
      navigationTitle="Calm Down for 10 Seconds"
      actions={
        <ActionPanel>
          <Action title="Restart Timer" onAction={restartTimer} icon={{ source: "command-icon.png" }} />
        </ActionPanel>
      }
    />
  );
}
