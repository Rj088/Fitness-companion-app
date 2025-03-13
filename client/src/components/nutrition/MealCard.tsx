
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Food {
  id: number;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
}

interface MealCardProps {
  title: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  time: string;
  calories: number;
  foods: Food[];
  onAddFood?: () => void;
}

export const FoodItem = ({ 
  name, 
  servingSize, 
  calories, 
  icon, 
  iconColor 
}: { 
  name: string; 
  servingSize: string; 
  calories: number; 
  icon: string; 
  iconColor: string; 
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-100 rounded-full mr-3 flex items-center justify-center overflow-hidden">
          <i className={`${icon} ${iconColor} text-xs`}></i>
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">{servingSize}</p>
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-sm mr-3">{calories} cal</p>
        <Button 
          variant="ghost" 
          className="w-8 h-8 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
          size="sm"
        >
          <i className="fas fa-times text-xs"></i>
        </Button>
      </div>
    </div>
  );
};

export const MealCard = ({ 
  title, 
  icon, 
  iconColor, 
  iconBg, 
  time, 
  calories, 
  foods,
  onAddFood 
}: MealCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  
  const handleAddFood = () => {
    if (onAddFood) {
      onAddFood();
    } else {
      toast({
        title: "Add Food",
        description: "Food search feature will be available soon!",
      });
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm mb-4">
        <div className="flex items-center p-4 border-b border-gray-100">
          <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
            <i className={`${icon} ${iconColor}`}></i>
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{calories} cal</p>
            <p className="text-xs text-gray-500">{foods.length} items</p>
          </div>
        </div>
        
        <div className="p-4">
          {foods.map((food, index) => (
            <FoodItem
              key={index}
              name={food.name}
              servingSize={food.servingSize}
              calories={food.calories}
              icon="fas fa-apple-alt"
              iconColor="text-red-500"
            />
          ))}
          
          <div className="flex mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 mr-2"
              onClick={() => setShowDetails(true)}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleAddFood}
            >
              <i className="fas fa-plus mr-1"></i>
              Add Food
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
                <i className={`${icon} ${iconColor} text-sm`}></i>
              </div>
              {title} - {time}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-lg font-medium">{calories}</p>
                <p className="text-xs text-gray-500">Calories</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-lg font-medium">{Math.round(calories * 0.2)}</p>
                <p className="text-xs text-gray-500">Protein</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-lg font-medium">{Math.round(calories * 0.5)}</p>
                <p className="text-xs text-gray-500">Carbs</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-lg font-medium">{Math.round(calories * 0.3)}</p>
                <p className="text-xs text-gray-500">Fat</p>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium border-b flex justify-between items-center">
                <span>Food Items</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1"
                  onClick={handleAddFood}
                >
                  <i className="fas fa-plus text-xs mr-1"></i>
                  Add
                </Button>
              </div>
              
              <div className="divide-y p-2">
                {foods.map((food, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                        <i className="fas fa-apple-alt text-red-500 text-xs"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{food.name}</p>
                        <p className="text-xs text-gray-500">{food.servingSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-2">
                        <p className="text-sm">{food.calories} cal</p>
                        <p className="text-xs text-gray-500">P: {Math.round(food.calories * 0.2)}g</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-8 h-8 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                        size="sm"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
