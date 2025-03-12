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
  
  // Fix for text-primary, text-secondary, etc. classes
  const getStrokeColor = () => {
    if (color === 'text-primary') return 'hsl(142.1, 76.2%, 36.3%)'; // green
    if (color === 'text-secondary') return 'hsl(243.4, 75.4%, 58.6%)'; // blue
    if (color === 'text-success') return 'hsl(20.5, 90.2%, 48.2%)'; // orange
    return color; // Use directly if it's an hsl/rgb/hex value
  };
  
  return (
    <div className="w-16 h-16 mx-auto relative">
      <svg className="progress-ring" width={size} height={size}>
        <circle 
          strokeWidth={strokeWidth} 
          stroke="#e5e7eb" // light gray
          fill="transparent" 
          r={radius} 
          cx={size / 2} 
          cy={size / 2}
        />
        <circle 
          strokeWidth={strokeWidth} 
          stroke={getStrokeColor()}
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
