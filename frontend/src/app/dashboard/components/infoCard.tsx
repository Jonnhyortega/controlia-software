interface InfoCardProps {
    title: string;
    value: number | string | null;
    color?: string; // opcional, por defecto "text-gray-800"
  }
  
  function InfoCard({ title, value, color = "text-red-800" }: InfoCardProps) {
    return (
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className={`text-lg font-semibold ${color}`}>{value?.toLocaleString("es-AR") ?? "$" + 0}</p>
      </div>
    );
  }

  export default InfoCard;