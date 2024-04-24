import { List, ActionPanel, Action } from "@raycast/api";
import BoxBreathing from "./box-breathing";

export default function BreathingPracticesList() {
  return (
    <List>
      <List.Item
        title="Box Breathing"
        accessories={[
          {
            text: "4-4-4-4",
          },
        ]}
        actions={
          <ActionPanel>
            <Action.Push title="Start Box Breathing" target={<BoxBreathing />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
