import { useLocation, useRoute } from "wouter";

export default function TabBar() {
  const [, setLocation] = useLocation();
  const [isHome] = useRoute("/");
  const [isWorkouts] = useRoute("/workouts");
  const [isProgress] = useRoute("/progress");
  const [isNutrition] = useRoute("/nutrition");
  const [isProfile] = useRoute("/profile");

  const handleTabClick = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="tab-bar fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center px-6 h-21 z-10">
      <button 
        className={`flex flex-col items-center pt-2 ${isHome ? 'text-primary' : 'text-gray-400'}`}
        onClick={() => handleTabClick("/")}
      >
        <i className="fas fa-home text-xl"></i>
        <span className="text-xs mt-1">Home</span>
      </button>
      <button 
        className={`flex flex-col items-center pt-2 ${isWorkouts ? 'text-primary' : 'text-gray-400'}`}
        onClick={() => handleTabClick("/workouts")}
      >
        <i className="fas fa-dumbbell text-xl"></i>
        <span className="text-xs mt-1">Workouts</span>
      </button>
      <button 
        className={`flex flex-col items-center pt-2 ${isProgress ? 'text-primary' : 'text-gray-400'}`}
        onClick={() => handleTabClick("/progress")}
      >
        <i className="fas fa-chart-line text-xl"></i>
        <span className="text-xs mt-1">Progress</span>
      </button>
      <button 
        className={`flex flex-col items-center pt-2 ${isNutrition ? 'text-primary' : 'text-gray-400'}`}
        onClick={() => handleTabClick("/nutrition")}
      >
        <i className="fas fa-apple-alt text-xl"></i>
        <span className="text-xs mt-1">Nutrition</span>
      </button>
      <button 
        className={`flex flex-col items-center pt-2 ${isProfile ? 'text-primary' : 'text-gray-400'}`}
        onClick={() => handleTabClick("/profile")}
      >
        <i className="fas fa-user text-xl"></i>
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );
}
