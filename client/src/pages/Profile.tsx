import { useUser } from "@/lib/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";

interface ProfileSettingProps {
  icon: string;
  iconBg?: string;
  title: string;
  children?: React.ReactNode;
  onClick?: () => void;
  hasBorder?: boolean;
}

const ProfileSetting = ({ 
  icon, 
  iconBg = "bg-gray-100", 
  title, 
  children, 
  onClick,
  hasBorder = true
}: ProfileSettingProps) => (
  <div 
    className={cn(
      "flex items-center justify-between p-4", 
      hasBorder && "border-b border-gray-100"
    )}
    onClick={onClick}
  >
    <div className="flex items-center">
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
        <i className={`${icon} text-gray-500`}></i>
      </div>
      <p className="font-medium">{title}</p>
    </div>
    {children || (
      <button className="text-gray-400">
        <i className="fas fa-chevron-right"></i>
      </button>
    )}
  </div>
);

export default function Profile() {
  const { data: user, isLoading } = useUser();
  const { logout } = useAuth();
  const [_, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const weightInLbs = user?.weight ? Math.round(user.weight * 2.20462) : 0;

  const getHeightDisplay = (heightCm: number | null | undefined) => {
    if (!heightCm) return '---';
    const inches = heightCm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  const calculateBMI = (weight: number | null | undefined, height: number | null | undefined) => {
    if (!weight || !height) return 0;
    return Math.round((weight / ((height / 100) * (height / 100))) * 10) / 10;
  };

  const bmi = calculateBMI(user?.weight, user?.height);

  return (
    <div id="profile-screen" className="bg-white pb-24">
      <div className="px-5 pt-6 pb-4 bg-white">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          {isLoading ? (
            <>
              <div className="flex items-center mb-4">
                <Skeleton className="w-20 h-20 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <i className="fas fa-user text-gray-400 text-3xl"></i>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-gray-500">Marketing Specialist</p>
                  <div className="flex items-center mt-1">
                    <i className="fas fa-map-marker-alt text-gray-400 mr-1"></i>
                    <span className="text-sm text-gray-500">New York City</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2">
                  <p className="text-2xl font-semibold">{weightInLbs}</p>
                  <p className="text-xs text-gray-500">lbs</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-2xl font-semibold">{getHeightDisplay(user?.height)}</p>
                  <p className="text-xs text-gray-500">height</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-2xl font-semibold">{bmi}</p>
                  <p className="text-xs text-gray-500">BMI</p>
                </div>
              </div>

              <Button className="w-full">
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="px-5 py-2">
        <h2 className="text-lg font-medium mb-3">My Goals</h2>
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mr-3">
                    <i className="fas fa-weight text-success"></i>
                  </div>
                  <div>
                    <h3 className="font-medium">Weight Goal</h3>
                    <p className="text-sm text-gray-500">
                      {user?.goalWeight ? Math.round(user.goalWeight * 2.20462) : 140} lbs
                    </p>
                  </div>
                </div>
                <button className="text-gray-400">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
                    <i className="fas fa-shoe-prints text-secondary"></i>
                  </div>
                  <div>
                    <h3 className="font-medium">Daily Steps</h3>
                    <p className="text-sm text-gray-500">{user?.dailyStepsGoal?.toLocaleString() || 8000} steps</p>
                  </div>
                </div>
                <button className="text-gray-400">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <i className="fas fa-dumbbell text-primary"></i>
                  </div>
                  <div>
                    <h3 className="font-medium">Workout Frequency</h3>
                    <p className="text-sm text-gray-500">{user?.workoutFrequency || 4} times per week</p>
                  </div>
                </div>
                <button className="text-gray-400">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-5 py-2">
        <h2 className="text-lg font-medium mb-3">Settings</h2>
        <div className="bg-white rounded-2xl shadow-sm mb-4">
          <ProfileSetting 
            icon="fas fa-bell" 
            title="Notifications"
          >
            <Switch defaultChecked />
          </ProfileSetting>

          <ProfileSetting 
            icon="fas fa-moon" 
            title="Dark Mode"
          >
            <Switch />
          </ProfileSetting>

          <ProfileSetting 
            icon="fas fa-lock" 
            title="Privacy"
          />

          <ProfileSetting 
            icon="fas fa-question" 
            title="Help & Support"
          />

          <ProfileSetting 
            icon="fas fa-info-circle" 
            title="About"
            hasBorder={false}
          />
        </div>

        <Button 
          variant="outline" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-5 rounded-xl text-sm font-medium w-full mb-6"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}

