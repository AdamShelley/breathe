import { List, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";

const Stats: React.FC = () => {
  const [completedReps, setCompletedReps] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const reps = await LocalStorage.getItem("totalCompletedReps");
      const time = await LocalStorage.getItem("totalTimeElapsed");
      setCompletedReps(reps ? Number(reps) : 0);
      setTotalTimeElapsed(time ? Number(time) : 0);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let timeString = "";
    if (hours > 0) {
      timeString += `${hours}h `;
    }

    if (minutes > 0 || timeString.length > 0) {
      timeString += `${minutes}m `;
    }

    timeString += `${remainingSeconds}s`;
    return timeString.trim();
  };

  const formattedTime = formatTime(totalTimeElapsed);

  return (
    <List navigationTitle="Your Breathing Stats">
      <List.Item title="Total Sessions Completed" subtitle={`${completedReps}`} />
      <List.Item title="Total Breathing Time" subtitle={formattedTime} />
    </List>
  );
};

export default Stats;
