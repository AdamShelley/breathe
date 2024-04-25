import { Detail, LocalStorage } from "@raycast/api";

import { useState, useEffect } from "react";

const Stats: React.FC = () => {
  const [completedReps, setCompletedReps] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const reps = await LocalStorage.getItem("completedReps");
      const time = await LocalStorage.getItem("totalTimeElapsed");
      setCompletedReps(reps ? Number(reps) : 0);
      setTotalTimeElapsed(time ? Number(time) : 0);
    };

    fetchStats();
  }, []);

  const markdown = `
    # 📊 Stats
    **Total Sessions Completed**: ${completedReps}

    &nbsp;

    **Total Breathing Time**: ${totalTimeElapsed} seconds
  `;
  return <Detail markdown={markdown} navigationTitle="Your Breathing Stats" />;
};

export default Stats;
