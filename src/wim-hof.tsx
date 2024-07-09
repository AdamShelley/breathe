import { Detail, showToast, Toast, ActionPanel, Action, Icon, Alert } from "@raycast/api";
import { useState, useEffect } from "react";

export default function WimHof() {
  const [breaths, setBreaths] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const secondHolds = [45, 60, 90];
  const breathStates = ["Breathe In", "Breathe Out"];
  const [currentBreathState, setCurrentBreathState] = useState(breathStates[0]);
  const currentRep = 1;

  const breathMessage = async () => {
    await showToast({ title: "Breath Hold", message: "Breath Hold" });
  };

  const secondsMessage = async () => {
    await showToast({ title: "Timer Start", message: "Timer Started" });
  };

  useEffect(() => {
    if (breaths === 5) {
      breathMessage();
    } else if (breaths <= 30) {
      secondsMessage();
      setTimeout(() => {
        setBreaths((prevBreaths) => prevBreaths + 1);
      }, 4000);

      if (currentBreathState === breathStates[0]) {
        setCurrentBreathState(breathStates[1]);
      } else {
        setCurrentBreathState(breathStates[0]);
      }
    }
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const markdown = `
# Wim Hof Meditation

**Breaths**: ${breaths}
**Current Rep**: ${currentRep}
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
