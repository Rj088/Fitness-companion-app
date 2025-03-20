
import { useState } from "react";
import { User, Workout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkoutCard } from "@/components/workout/WorkoutPlan";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateWorkoutRecommendation, parseWorkoutResponse } from "@/lib/xai";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

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
  const [goals, setGoals] = useState("build muscle");
  const [injuries, setInjuries] = useState("none");
  const [equipment, setEquipment] = useState("dumbbells");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);
  
  // Import useAuth hook to get authenticated user
  const { user: authUser } = useAuth();
  const actualUser = user || authUser;
  
  const generateWorkout = async () => {
    if (!actualUser) {
      toast({
        title: "User profile required",
        description: "Please complete your profile to get personalized recommendations",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      console.log("Generating workout with user:", actualUser);
      console.log("User preferences:", { goals, injuries, equipment });
      
      // Call the workout generation API
      const response = await generateWorkoutRecommendation(actualUser, {
        goals,
        injuries,
        equipment
      });
      
      console.log("AI response:", response);
      
      // Parse the response into a workout object
      const workout = parseWorkoutResponse(response);
      console.log("Parsed workout:", workout);
      
      setGeneratedWorkout(workout);
      
      toast({
        title: "Workout Generated",
        description: "Your personalized workout plan is ready"
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
  
  const displayWorkout = generatedWorkout || (aiWorkouts && aiWorkouts.length > 0 ? aiWorkouts[0] : null);
  
  return (
    <Card className="bg-white rounded-2xl shadow-sm p-0 mb-6 overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <i className="fas fa-robot text-white"></i>
            </div>
            <CardTitle className="text-xl font-semibold">AI Workout Recommendation</CardTitle>
          </div>
          {!showGenerateForm && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={() => setShowGenerateForm(true)}
            >
              <i className="fas fa-plus mr-2"></i>
              New Workout
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {showGenerateForm ? (
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="goals" className="text-sm font-medium mb-1 block">What are your fitness goals?</Label>
              <Textarea 
                id="goals"
                placeholder="e.g., lose weight, build muscle, improve endurance"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="resize-none"
              />
            </div>
            
            <div>
              <Label htmlFor="injuries" className="text-sm font-medium mb-1 block">Any injuries or limitations?</Label>
              <Textarea 
                id="injuries"
                placeholder="e.g., knee pain, shoulder injury, or 'none'"
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                className="resize-none"
              />
            </div>
            
            <div>
              <Label htmlFor="equipment" className="text-sm font-medium mb-1 block">Available equipment</Label>
              <Textarea 
                id="equipment"
                placeholder="e.g., dumbbells, resistance bands, or 'minimal equipment'"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="default"
                onClick={generateWorkout}
                disabled={isGenerating}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-magic-sparkles mr-2"></i>
                    Generate Workout Plan
                  </>
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
          <div className="p-4">
            <Skeleton className="h-14 w-full mb-4 rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : displayWorkout ? (
          <div>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-700">
                <i className="fas fa-lightbulb mr-2"></i>
                Based on your {user?.fitnessLevel || 'current'} fitness level and goals, we recommend:
              </p>
            </div>
            <WorkoutCard workout={displayWorkout} />
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-dumbbell text-blue-500 text-xl"></i>
            </div>
            <p className="text-gray-600 mb-4">No AI recommendations available yet</p>
            <Button 
              onClick={() => setShowGenerateForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <i className="fas fa-wand-magic-sparkles mr-2"></i>
              Generate Your First Workout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
