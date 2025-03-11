interface CircularProgressProps {
  value: number;
  size: number;
  strokeWidth: number;
  color: string;
}

export default function CircularProgress({
  value,
  size,
  strokeWidth,
  color
}: CircularProgressProps) {
  // Ensure value is between 0 and 100
  const percentage = Math.min(100, Math.max(0, value));
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="w-16 h-16 mx-auto relative">
      <svg className="progress-ring" width={size} height={size}>
        <circle 
          className="text-gray-200" 
          strokeWidth={strokeWidth} 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx={size / 2} 
          cy={size / 2}
        />
        <circle 
          className={color} 
          strokeWidth={strokeWidth} 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx={size / 2} 
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transformOrigin: '50% 50%',
            transform: 'rotate(-90deg)',
            transition: 'stroke-dashoffset 0.5s ease-in-out'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
    </div>
  );
}
