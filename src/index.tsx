import { List, ActionPanel, Action } from "@raycast/api";
import BoxBreathing from "./box-breathing";
import Stats from "./stats";
import TableClock from "./ten-seconds";

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
        title="🔟 10 Second Relief"
        accessories={[
          {
            text: "10",
          },
        ]}
        actions={
          <ActionPanel>
            <Action.Push title="Start Box Breathing" target={<TableClock />} />
          </ActionPanel>
        }
      />

      <List.Item
        title="📊 Stats"
        accessories={[
          {
            text: "But it's not a competition.",
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
