import { WeightLog } from "@/lib/types";
import { useEffect, useRef } from "react";

interface WeightChartProps {
  data: WeightLog[];
}

export default function WeightChart({ data }: WeightChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Convert kg to lbs for display
    const weightInLbs = data.map(log => ({
      ...log,
      weightLbs: Math.round(log.weight * 2.20462)
    }));

    // Find min and max weights for scaling
    const minWeight = Math.min(...weightInLbs.map(log => log.weightLbs)) - 5;
    const maxWeight = Math.max(...weightInLbs.map(log => log.weightLbs)) + 5;
    
    // Calculate Y value for weight
    const calculateY = (weight: number) => {
      const range = maxWeight - minWeight;
      if (range === 0) return 100; // Default if all weights are the same
      
      // Map weight to Y position (higher weight = lower Y position)
      const percentage = (weight - minWeight) / range;
      // y values from 140 (bottom) to 20 (top) - with padding
      return 140 - (percentage * 120);
    };

    // Generate line points
    const points = weightInLbs.map((log, index) => {
      // X position spreads points evenly across chart width
      const x = 40 + (index * ((280 - 40) / (weightInLbs.length - 1 || 1)));
      const y = calculateY(log.weightLbs);
      return { x, y, weight: log.weightLbs };
    });

    // Clear existing elements
    const svg = svgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Draw Y-axis labels
    const yLabels = [maxWeight, maxWeight - (maxWeight - minWeight) / 3, maxWeight - 2 * (maxWeight - minWeight) / 3, minWeight];
    yLabels.forEach((label, i) => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "5");
      text.setAttribute("y", String(20 + i * 40));
      text.setAttribute("class", "text-xs text-gray-500");
      text.textContent = String(Math.round(label));
      svg.appendChild(text);
    });

    // Draw X-axis labels
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dates = weightInLbs.map(log => new Date(log.date));
    
    // Show either all dates or a subset if there are many points
    const xLabels = dates.length <= 5 
      ? dates.map((date, i) => ({ 
          text: months[date.getMonth()], 
          x: points[i].x 
        }))
      : [
          { text: months[dates[0].getMonth()], x: points[0].x },
          { text: months[Math.floor(dates.length / 3)].getMonth(), x: points[Math.floor(dates.length / 3)].x },
          { text: months[Math.floor(2 * dates.length / 3)].getMonth(), x: points[Math.floor(2 * dates.length / 3)].x },
          { text: months[dates[dates.length - 1].getMonth()], x: points[points.length - 1].x },
        ];

    xLabels.forEach(label => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(label.x));
      text.setAttribute("y", "160");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("class", "text-xs text-gray-500");
      text.textContent = label.text;
      svg.appendChild(text);
    });

    // Draw grid lines
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

    // Create line path
    if (points.length > 1) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      const pointsAttr = points.map(p => `${p.x},${p.y}`).join(" ");
      line.setAttribute("points", pointsAttr);
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", "#3182CE");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
    }

    // Draw data points
    points.forEach(point => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(point.x));
      circle.setAttribute("cy", String(point.y));
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "#3182CE");
      svg.appendChild(circle);
    });

  }, [data]);

  return (
    <svg ref={svgRef} className="w-full h-full" viewBox="0 0 350 150" preserveAspectRatio="xMidYMid meet">
      {/* Chart will be rendered here dynamically */}
    </svg>
  );
}
