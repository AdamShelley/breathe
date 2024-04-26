import { useState, useEffect } from "react";
import { Detail } from "@raycast/api";

export default function TableClock() {
  const [position, setPosition] = useState(0);

  // Table dimensions
  const size = 4; // Simple 4x4 table
  const maxPositions = size * 4 - 4; // Number of edge cells in the table

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => (prevPosition + 1) % maxPositions); // Move the number clockwise
    }, 1000); // Update every second

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Generate formatted markdown table with "clock pulse"
  const generateTableMarkdown = (position: number) => {
    let markdown = "|";
    const totalCells = size * size;
    let edgePosition = 0;

    for (let i = 0; i < totalCells; i++) {
      const rowEnd = (i + 1) % size === 0;
      const isEdge = i < size || i % size === 0 || i % size === size - 1 || i >= totalCells - size;

      if (isEdge) {
        if (position === edgePosition) {
          markdown += " **1** |";
        } else {
          markdown += " 0 |";
        }
        edgePosition++; // Only increment the edge position counter for edge cells
      } else {
        markdown += "   |"; // Empty inner cells
      }

      if (rowEnd && i < totalCells - 1) {
        markdown += "\n|";
      }
    }

    return markdown;
  };

  return <Detail markdown={generateTableMarkdown(position)} navigationTitle="Table Clock" />;
}
