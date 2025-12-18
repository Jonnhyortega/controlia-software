import { useCustomization } from "../../../context/CustomizationContext";

interface InfoCardProps {
    title: string;
    value: number | string | null;
    color?: string;
}

function InfoCard({ title, value, color = "text-red-800" }: InfoCardProps) {
  const { formatCurrency } = useCustomization();
  
  const displayValue = 
      typeof value === "number" 
        ? formatCurrency(value) 
        : value ?? formatCurrency(0);

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm overflow-hidden">
      <h4 className="text-sm text-gray-500 truncate" title={title}>{title}</h4>
      <p 
        className={`text-base md:text-lg font-semibold ${color} truncate`} 
        title={displayValue}
      >
        {displayValue}
      </p>
    </div>
  );
}

export default InfoCard;