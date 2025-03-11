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
  return (
    <div className="flex items-center py-2" onClick={onClick}>
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
        <i className={`${icon} ${iconColor}`}></i>
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <button className="text-gray-400">
        <i className="fas fa-angle-right"></i>
      </button>
    </div>
  );
}
