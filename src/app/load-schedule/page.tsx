import { LoadSchedule } from "../../calculators/load-schedule";

export default function LoadSchedulePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Cuadro de Cargas</h1>
      <LoadSchedule language="es" />
    </div>
  );
} 