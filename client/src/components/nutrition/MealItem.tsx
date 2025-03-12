import { Coffee, UtensilsCrossed, Apple, Drumstick, ChevronRight } from 'lucide-react';

interface MealItemProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export default function MealItem({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  onClick
}: MealItemProps) {
  // Map icon strings to Lucide components
  const getIcon = () => {
    switch(icon) {
      case "fas fa-coffee":
        return <Coffee className={iconColor} size={18} />;
      case "fas fa-utensils":
        return <UtensilsCrossed className={iconColor} size={18} />;
      case "fas fa-apple-alt":
        return <Apple className={iconColor} size={18} />;
      case "fas fa-drumstick-bite":
        return <Drumstick className={iconColor} size={18} />;
      default:
        return <Coffee className={iconColor} size={18} />;
    }
  };

  return (
    <div className="flex items-center py-2" onClick={onClick}>
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <button className="text-gray-400">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
