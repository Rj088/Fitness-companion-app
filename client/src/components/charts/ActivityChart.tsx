import { Activity } from "@/lib/types";
import { useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";

interface ActivityChartProps {
  data: Activity[];
  period: "weekly" | "monthly";
}

export default function ActivityChart({ data, period }: ActivityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear existing elements
    const svg = svgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Determine scale based on max steps or max allowed value if steps are low
    const maxSteps = Math.max(...data.map(day => day.steps || 0), 1000);
    const yScale = Math.max(3000, Math.ceil(maxSteps / 1000) * 1000);

    // Y-axis labels
    const yLabels = [
      { value: yScale, label: `${yScale / 1000}k`, y: 20 },
      { value: (yScale * 2/3), label: `${Math.round(yScale * 2/3 / 1000)}k`, y: 60 },
      { value: (yScale * 1/3), label: `${Math.round(yScale * 1/3 / 1000)}k`, y: 100 },
      { value: 0, label: "0", y: 140 }
    ];

    // Add Y-axis labels
    yLabels.forEach(item => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "5");
      text.setAttribute("y", String(item.y));
      text.setAttribute("class", "text-xs text-gray-500");
      text.textContent = item.label;
      svg.appendChild(text);
    });

    // X-axis labels and positioning based on period
    const xLabels = [];
    let barWidth = 20;
    let barSpacing = 45;
    
    if (period === "weekly") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      for (let i = 0; i < 7; i++) {
        xLabels.push({
          text: days[i],
          x: 45 + i * barSpacing
        });
      }
    } else { // monthly
      // Show approximately every 5th day of the month or similar spacing
      const daysInMonth = 30; // Simplified
      const numberOfLabels = 6;
      barWidth = 10;
      barSpacing = 340 / (numberOfLabels + 1);
      
      for (let i = 0; i < numberOfLabels; i++) {
        const day = Math.ceil((i + 1) * (daysInMonth / (numberOfLabels + 1)));
        xLabels.push({
          text: String(day),
          x: 45 + i * barSpacing
        });
      }
    }

    // Add X-axis labels
    xLabels.forEach(label => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(label.x));
      text.setAttribute("y", "160");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("class", "text-xs text-gray-500");
      text.textContent = label.text;
      svg.appendChild(text);
    });

    // Grid lines
    for (let i = 0; i < 4; i++) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "20");
      line.setAttribute("y1", String(20 + i * 40));
      line.setAttribute("x2", "340");
      line.setAttribute("y2", String(20 + i * 40));
      line.setAttribute("stroke", "#E2E8F0");
      line.setAttribute("stroke-width", "1");
      svg.appendChild(line);
    }

    // Create bars for each day's data
    data.forEach((day, index) => {
      if (index >= 7 && period === "weekly") return; // Only show 7 days for weekly view
      
      // Calculate height based on steps, ensure steps is a number
      const steps = day.steps || 0;
      const height = (steps / yScale) * 120;
      const y = 140 - height;
      
      // Position based on day
      const x = xLabels[index % xLabels.length].x - (barWidth / 2);
      
      // Determine if the bar is for a future day (empty)
      const today = new Date();
      let isFutureDay = false;
      
      // Safely parse date if it exists
      if (day.date) {
        try {
          const dateStr = typeof day.date === 'string' ? day.date : day.date.toString();
          const dayDate = parseISO(dateStr);
          isFutureDay = dayDate > today;
        } catch (error) {
          console.error('Error parsing date:', error);
        }
      }
      
      // Create the bar
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", String(barWidth));
      rect.setAttribute("height", String(height));
      rect.setAttribute("fill", isFutureDay ? "#E2E8F0" : "#3182CE");
      rect.setAttribute("rx", "4");
      
      // Add some opacity to future days
      if (isFutureDay) {
        rect.setAttribute("opacity", "0.5");
      }
      
      svg.appendChild(rect);
    });

  }, [data, period]);

  return (
    <svg ref={svgRef} className="w-full h-full" viewBox="0 0 350 150" preserveAspectRatio="xMidYMid meet">
      {/* Chart will be rendered here dynamically */}
    </svg>
  );
}
