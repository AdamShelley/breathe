import { Detail, LocalStorage } from "@raycast/api";

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

  const formatTime = (seconds) => {
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

  const markdown = `
  # 📊 Stats
  **Total Sessions Completed**: ${completedReps}

  &nbsp;

  **Total Breathing Time**: ${formattedTime}`;
  return <Detail markdown={markdown} navigationTitle="Your Breathing Stats" />;
};

export default Stats;
