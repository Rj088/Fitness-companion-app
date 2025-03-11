interface MacroSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

export default function MacroSummary({
  calories,
  protein,
  carbs,
  fat,
  calorieGoal,
  proteinGoal,
  carbsGoal,
  fatGoal
}: MacroSummaryProps) {
  // Calculate percentage for progress bars
  const carbsPercentage = Math.min(100, Math.round((carbs / carbsGoal) * 100));
  const proteinPercentage = Math.min(100, Math.round((protein / proteinGoal) * 100));
  const fatPercentage = Math.min(100, Math.round((fat / fatGoal) * 100));

  return (
    <div className="flex space-x-3 mb-4">
      <div className="w-24 h-24 bg-light rounded-xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">{calories}</p>
          <p className="text-xs text-gray-500">cal eaten</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="h-6">
          <div className="text-xs font-medium mb-1 flex justify-between">
            <span>Carbs</span>
            <span>{carbs}g / {carbsGoal}g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${carbsPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="h-6">
          <div className="text-xs font-medium mb-1 flex justify-between">
            <span>Protein</span>
            <span>{protein}g / {proteinGoal}g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary rounded-full" 
              style={{ width: `${proteinPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="h-6">
          <div className="text-xs font-medium mb-1 flex justify-between">
            <span>Fat</span>
            <span>{fat}g / {fatGoal}g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success rounded-full" 
              style={{ width: `${fatPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
