import { List, ActionPanel, Action } from "@raycast/api";
import BoxBreathing from "./box-breathing";
import Stats from "./stats";

export default function BreathingPracticesList() {
  return (
    <List>
      <List.Item
        title="📦 Box Breathing"
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

      <List.Item
        title="Stats"
        accessories={[
          {
            text: "📊",
          },
        ]}
        actions={
          <ActionPanel>
            <Action.Push title="Start Box Breathing" target={<Stats />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
