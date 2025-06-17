import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  calculateLoadBalance,
  calculateCircuitVoltageDrop,
  calculateCircuitPowerLoss,
  getRecommendedWireSize,
  getRecommendedProtection,
  calculateServiceWire,
  calculateGroundWire,
} from "../utils/electrical-calculations";

interface Circuit {
  id: string;
  description: string;
  power: number;
  voltage: number;
  length: number;
  phase: string;
}

interface LoadScheduleResultsProps {
  circuits: Circuit[];
  circuitType: "monofasico" | "bifasico" | "trifasico";
  ambientTemp: number;
  language: "en" | "es";
}

export function LoadScheduleResults({
  circuits,
  circuitType,
  ambientTemp,
  language,
}: LoadScheduleResultsProps) {
  const content = {
    es: {
      loadBalance: "Balance de Cargas",
      phaseA: "Fase A",
      phaseB: "Fase B",
      phaseC: "Fase C",
      unbalance: "Desequilibrio",
      voltageDrop: "Caída de Tensión",
      powerLoss: "Pérdidas de Potencia",
      recommendedProtection: "Protección Recomendada",
      serviceWire: "Cable de Acometida",
      groundWire: "Cable de Tierra",
      current: "Corriente",
      percentage: "Porcentaje",
      voltage: "Tensión",
      watts: "Vatios",
      amps: "Amperios",
    },
    en: {
      loadBalance: "Load Balance",
      phaseA: "Phase A",
      phaseB: "Phase B",
      phaseC: "Phase C",
      unbalance: "Unbalance",
      voltageDrop: "Voltage Drop",
      powerLoss: "Power Loss",
      recommendedProtection: "Recommended Protection",
      serviceWire: "Service Wire",
      groundWire: "Ground Wire",
      current: "Current",
      percentage: "Percentage",
      voltage: "Voltage",
      watts: "Watts",
      amps: "Amps",
    },
  };

  const loadBalance = calculateLoadBalance(circuits);
  const totalPower = circuits.reduce((total, circuit) => total + circuit.power, 0);
  const totalCurrent = totalPower / (circuitType === "trifasico" ? 220 * Math.sqrt(3) : 220);

  // Calcular caída de tensión y pérdidas para cada circuito
  const circuitResults = circuits.map((circuit) => {
    const current = circuit.power / circuit.voltage;
    const wireSize = getRecommendedWireSize(current, circuitType, Number(ambientTemp));
    const voltageDrop = calculateCircuitVoltageDrop(circuit, wireSize, circuitType);
    const powerLoss = calculateCircuitPowerLoss(circuit, wireSize, circuitType);

    return {
      ...circuit,
      wireSize,
      voltageDrop,
      powerLoss,
      protection: getRecommendedProtection(current, circuitType),
    };
  });

  const serviceWireSize = calculateServiceWire(totalPower, circuitType, Number(ambientTemp));
  const groundWireSize = calculateGroundWire(serviceWireSize);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{content[language].loadBalance}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>{content[language].phaseA}</span>
                <span>{loadBalance.phaseA.toFixed(2)} {content[language].amps}</span>
              </div>
              <Progress value={(loadBalance.phaseA / Math.max(loadBalance.phaseA, loadBalance.phaseB, loadBalance.phaseC)) * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>{content[language].phaseB}</span>
                <span>{loadBalance.phaseB.toFixed(2)} {content[language].amps}</span>
              </div>
              <Progress value={(loadBalance.phaseB / Math.max(loadBalance.phaseA, loadBalance.phaseB, loadBalance.phaseC)) * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>{content[language].phaseC}</span>
                <span>{loadBalance.phaseC.toFixed(2)} {content[language].amps}</span>
              </div>
              <Progress value={(loadBalance.phaseC / Math.max(loadBalance.phaseA, loadBalance.phaseB, loadBalance.phaseC)) * 100} />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <span>{content[language].unbalance}</span>
                <span>{loadBalance.unbalance.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{content[language].recommendedProtection}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {circuitResults.map((circuit) => (
                <div key={circuit.id} className="flex justify-between">
                  <span>{circuit.description}</span>
                  <span>{circuit.protection} A</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{content[language].serviceWire}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>{content[language].serviceWire}</span>
                <span>{serviceWireSize} AWG</span>
              </div>
              <div className="flex justify-between">
                <span>{content[language].groundWire}</span>
                <span>{groundWireSize} AWG</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{content[language].voltageDrop}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {circuitResults.map((circuit) => (
              <div key={circuit.id}>
                <div className="flex justify-between mb-2">
                  <span>{circuit.description}</span>
                  <span>{circuit.voltageDrop.percentage.toFixed(2)}%</span>
                </div>
                <Progress value={circuit.voltageDrop.percentage} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{content[language].powerLoss}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {circuitResults.map((circuit) => (
              <div key={circuit.id}>
                <div className="flex justify-between mb-2">
                  <span>{circuit.description}</span>
                  <span>{circuit.powerLoss.watts.toFixed(2)} {content[language].watts}</span>
                </div>
                <Progress value={circuit.powerLoss.percentage} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 