import { Detail, showToast, Toast, ActionPanel, Action, Icon } from "@raycast/api";
import { useState, useEffect } from "react";

export default function WimHof() {
  const [breaths, setBreaths] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const secondHolds = [45, 60, 90];
  const breathStates = ["Breathe In", "Breathe Out"];
  const [currentBreathState, setCurrentBreathState] = useState(breathStates[0]);
  const currentRep = 1;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && breaths === 10) {
      // set breath hold timer
      timer = setTimeout(
        () => {
          showToast(Toast.Style.Success, "Breath hold!");
        },
        secondHolds[currentRep - 1] * 1000,
      );
    } else if (isRunning && breaths <= 30) {
      timer = setInterval(() => {
        setBreaths((currentBreaths) => currentBreaths + 1);
      }, 4000);

      // Change text to breathe out every 2 seconds
      const breathStateTimer = setInterval(() => {
        setCurrentBreathState((currentState) => {
          return currentState === breathStates[0] ? breathStates[1] : breathStates[0];
        });
      }, 2000);
    } else if (breaths === 30) {
      setIsRunning(false);
      showToast(Toast.Style.Success, "Breath hold!");
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const markdown = `
# Wim Hof Meditation

### Breaths: ${breaths}
### ${currentBreathState}

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
