import { useState } from "react";
import { User, Workout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkoutCard } from "@/components/workout/WorkoutPlan";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateWorkoutRecommendation, parseWorkoutResponse } from "@/lib/xai";
import { useToast } from "@/hooks/use-toast";

interface AIWorkoutRecommendationProps {
  user?: User | null;
  aiWorkouts?: Workout[];
  isLoading?: boolean;
}

export default function AIWorkoutRecommendation({ 
  user, 
  aiWorkouts = [], 
  isLoading = false 
}: AIWorkoutRecommendationProps) {
  const { toast } = useToast();
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [goals, setGoals] = useState("");
  const [injuries, setInjuries] = useState("");
  const [equipment, setEquipment] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);

  // Call the xAI integration to generate a new workout
  const handleGenerateWorkoutPlan = async () => {
    if (!user) {
      toast({
        title: "User profile required",
        description: "Please complete your profile to get personalized recommendations",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Call the xAI integration to generate a workout plan
      const workoutText = await generateWorkoutRecommendation(user, {
        goals,
        injuries,
        equipment
      });
      
      // Parse the generated text into a structured workout
      const workout = parseWorkoutResponse(workoutText);
      
      // Store the generated workout 
      setGeneratedWorkout(workout);
      toast({
        title: "Workout Generated",
        description: "Your personalized workout plan is ready",
      });
    } catch (error) {
      console.error("Error generating workout:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate a workout plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setShowGenerateForm(false);
    }
  };
  
  // Determine which workout to display
  const displayWorkout = generatedWorkout || (aiWorkouts && aiWorkouts.length > 0 ? aiWorkouts[0] : null);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <i className="fas fa-robot text-blue-500"></i>
          </div>
          <h3 className="font-medium">AI Workout Recommendation</h3>
        </div>
        {!showGenerateForm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => setShowGenerateForm(true)}
          >
            <i className="fas fa-sync-alt mr-1"></i> Generate New
          </Button>
        )}
      </div>

      {showGenerateForm ? (
        <div className="p-3 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-sm mb-2">Customize your AI workout</h4>
          <div className="space-y-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Your fitness goals</label>
              <Input
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g., Build muscle, lose weight, improve endurance"
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Any injuries or limitations?</label>
              <Input
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                placeholder="e.g., Shoulder pain, knee issues"
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Available equipment</label>
              <Textarea
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g., Dumbbells, resistance bands, bench"
                className="text-sm"
                rows={2}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerateWorkoutPlan}
              className="flex-1"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Generating...
                </>
              ) : (
                "Generate Workout Plan"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowGenerateForm(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : displayWorkout ? (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Based on your {user?.fitnessLevel || 'current'} fitness level and goals, we recommend:
          </p>
          <WorkoutCard workout={displayWorkout} />
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-3">No AI recommendations available yet</p>
          <Button onClick={() => setShowGenerateForm(true)}>
            Generate Your First Workout
          </Button>
        </div>
      )}
    </div>
  );
}