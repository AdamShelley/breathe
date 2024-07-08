import { List, ActionPanel, Action, Icon } from "@raycast/api";
import BoxBreathing from "./box-breathing";
import Stats from "./stats";
import TableClock from "./ten-seconds";
import WimHof from "./wim-hof";

export default function BreathingPracticesList() {
  return (
    <List>
      <List.Item
        icon={Icon.Box}
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

      <List.Item
        icon={Icon.Clock}
        title="10 Second Relief"
        accessories={[
          {
            text: "10",
          },
        ]}
        actions={
          <ActionPanel>
            <Action.Push title="10 Second Timer" target={<TableClock />} />
          </ActionPanel>
        }
      />
      <List.Item
        icon={Icon.Clock}
        title="Wim Hof Breathing"
        accessories={[
          {
            text: "30-60-90",
          },
        ]}
        actions={
          <ActionPanel>
            <Action.Push title="10 Second Timer" target={<WimHof />} />
          </ActionPanel>
        }
      />

      <List.Item
        icon={Icon.BarChart}
        title="Stats"
        accessories={[
          {
            text: "But it's not a competition",
          },
        ]}
        actions={
          <ActionPanel>
            <Action.Push title="Stats" target={<Stats />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
