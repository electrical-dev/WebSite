import { useState } from "react";
import { Card } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Components/ui/table";
import { Badge } from "../Components/ui/badge";
import { Progress } from "../Components/ui/progress";
import { Separator } from "../Components/ui/separator";
import { SupportedLanguage } from "../types/language";
import { calculateLoadSchedule, getRecommendedWireSize, calculateServiceWireImproved, calculateServiceConduit, calculateGroundWire, calculateServiceCurrent, calculateServiceVoltageDrop, generateWireConfiguration } from "../utils/electrical-calculations";
import { exportLoadScheduleToExcel } from "../utils/export-to-excel";
import { exportLoadScheduleToPDF } from "../utils/export-to-pdf";

interface Circuit {
  id: string;
  type: string;
  description: string;
  power: number;
  quantity: number;
  // Eliminamos el campo phase porque ahora se asigna automáticamente
  voltage: number;
  powerFactor: number;
  temperature: number;
  length: number; // Longitud del circuito en metros
}

interface LoadScheduleProps {
  language: SupportedLanguage;
}

export function LoadSchedule({ language }: LoadScheduleProps) {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  // Eliminamos panelSize porque se calculará automáticamente
  const [panelType, setPanelType] = useState<"monofasico" | "bifasico" | "trifasico">("trifasico");
  const [voltage, setVoltage] = useState<number>(220);
  const [temperature, setTemperature] = useState<number>(30);
  const [projectName, setProjectName] = useState<string>("");
  const [panelLocation, setPanelLocation] = useState<string>("");
  const [serviceLength, setServiceLength] = useState<number>(50); // Longitud de la acometida principal en metros

  const addCircuit = () => {
    const newCircuit: Circuit = {
      id: Date.now().toString(),
      type: "monofasico", // Siempre comenzamos con monofásico ya que está disponible en todos los tableros
      description: "",
      power: 0,
      quantity: 1,
      voltage: getCircuitVoltage("monofasico"),
      powerFactor: 0.85,
      temperature: temperature,
      length: 20 // Longitud por defecto de 20 metros
    };
    setCircuits([...circuits, newCircuit]);
  };

  const removeCircuit = (id: string) => {
    setCircuits(circuits.filter(circuit => circuit.id !== id));
  };

  const updateCircuit = (id: string, field: keyof Circuit, value: any) => {
    setCircuits(circuits.map(circuit => {
      if (circuit.id === id) {
        const updatedCircuit = { ...circuit, [field]: value };

        // Si cambió el tipo de circuito, actualizar el voltaje automáticamente
        if (field === "type") {
          updatedCircuit.voltage = getCircuitVoltage(value);
        }

        return updatedCircuit;
      }
      return circuit;
    }));
  };

  const handleExportExcel = () => {
    const results = calculateLoadScheduleWithAutoPhases(circuits, calculatedPanelSize, voltage, temperature, panelType);
    exportLoadScheduleToExcel(results, language, {
      panelType,
      panelCapacity: calculatedPanelSize,
      serviceCurrent,
      serviceWire: serviceWireSize,
      groundWire: groundWireSize,
      serviceConduit: serviceConduitSize,
      serviceVoltageDrop: serviceVoltageDropData.percentage
    });
  };

  const handleExportPDF = () => {
    const results = calculateLoadScheduleWithAutoPhases(circuits, calculatedPanelSize, voltage, temperature, panelType);
    exportLoadScheduleToPDF(results, language, {
      panelType,
      panelCapacity: calculatedPanelSize,
      serviceCurrent,
      serviceWire: serviceWireSize,
      groundWire: groundWireSize,
      serviceConduit: serviceConduitSize,
      serviceVoltageDrop: serviceVoltageDropData.percentage
    });
  };

  // Obtener voltaje según el tipo de circuito y tablero
  const getCircuitVoltage = (circuitType: string) => {
    switch (circuitType) {
      case "monofasico":
        return 127; // Voltaje fase-neutro
      case "bifasico":
        return 220; // Voltaje fase-fase
      case "trifasico":
        return 220; // Voltaje fase-fase
      default:
        return 127;
    }
  };

  // Función para asignar fases automáticamente según el patrón de tablero
  const assignAutomaticPhases = (circuits: Circuit[], panelType: "monofasico" | "bifasico" | "trifasico") => {
    const phasesAvailable = panelType === "monofasico" ? ["A"] :
      panelType === "bifasico" ? ["A", "B"] :
        ["A", "B", "C"];

    let circuitPosition = 0; // Posición del circuito en el tablero

    return circuits.map(circuit => {
      let assignedPhase: string;

      if (circuit.type === "monofasico") {
        // Circuitos monofásicos se asignan secuencialmente
        assignedPhase = phasesAvailable[circuitPosition % phasesAvailable.length];
        circuitPosition += 1;
      } else if (circuit.type === "bifasico") {
        // Circuitos bifásicos toman dos posiciones consecutivas
        const phaseIndex = circuitPosition % phasesAvailable.length;
        assignedPhase = phasesAvailable[phaseIndex];
        circuitPosition += 2; // Ocupa dos espacios
      } else { // trifasico
        // Circuitos trifásicos toman tres posiciones consecutivas
        assignedPhase = "ABC"; // Indicamos que usa las tres fases
        circuitPosition += 3; // Ocupa tres espacios
      }

      return { ...circuit, phase: assignedPhase };
    });
  };

  // Calcular resultados con fases automáticas
  const calculateLoadScheduleWithAutoPhases = (circuits: Circuit[], panelSize: number, voltage: number, temperature: number, panelType: "monofasico" | "bifasico" | "trifasico") => {
    // Asignar fases automáticamente
    const circuitsWithPhases = assignAutomaticPhases(circuits, panelType);

    // Usar la función existente pero con las fases asignadas automáticamente
    const baseResults = calculateLoadSchedule(circuitsWithPhases, panelSize, voltage, temperature);

    return baseResults;
  };

  // Calcular potencia total y corriente del tablero automáticamente
  const totalPower = circuits.reduce((sum, circuit) => sum + (circuit.power * circuit.quantity), 0);
  const serviceCurrent = totalPower > 0 ? calculateServiceCurrent(totalPower, panelType) : 0;

  // Calcular el tamaño del tablero automáticamente con factor de seguridad
  const calculatedPanelSize = Math.ceil(serviceCurrent * 1.25 / 5) * 5; // Redondear al siguiente múltiplo de 5

  // Calcular resultados para mostrar en pantalla
  const results = circuits.length > 0 ? calculateLoadScheduleWithAutoPhases(circuits, calculatedPanelSize, voltage, temperature, panelType) : null;

  // Calcular acometida principal con criterio mejorado (1% caída de tensión)
  const serviceWireSize = totalPower > 0 ? calculateServiceWireImproved(totalPower, panelType, serviceLength, temperature) : null;
  const serviceConduitSize = serviceWireSize ? calculateServiceConduit(serviceWireSize, panelType) : null;
  const groundWireSize = serviceWireSize ? calculateGroundWire(serviceWireSize) : null;

  // Calcular caída de tensión de la acometida
  const serviceVoltageDropData = serviceWireSize && serviceCurrent > 0 ?
    calculateServiceVoltageDrop(serviceCurrent, serviceLength, serviceWireSize, panelType) :
    { percentage: 0, voltage: 0 };

  // Función para formatear la acometida completa
  const formatServiceWiring = (serviceWire: string, groundWire: string, panelType: "monofasico" | "bifasico" | "trifasico") => {
    if (!serviceWire || !groundWire) return "";

    if (panelType === "monofasico") {
      return `1F#${serviceWire}+1N#${serviceWire}+1T#${groundWire}`;
    } else if (panelType === "bifasico") {
      return `2F#${serviceWire}+1N#${serviceWire}+1T#${groundWire}`;
    } else {
      return `3F#${serviceWire}+1N#${serviceWire}+1T#${groundWire}`;
    }
  };

  // Obtener tipos de circuitos permitidos según el tipo de tablero
  const getAllowedCircuitTypes = () => {
    switch (panelType) {
      case "monofasico":
        return [
          { value: "monofasico", label: language === "es" ? "Monofásico (1F)" : "Single Phase (1P)" }
        ];
      case "bifasico":
        return [
          { value: "monofasico", label: language === "es" ? "Monofásico (1F)" : "Single Phase (1P)" },
          { value: "bifasico", label: language === "es" ? "Bifásico (2F)" : "Two Phase (2P)" }
        ];
      case "trifasico":
        return [
          { value: "monofasico", label: language === "es" ? "Monofásico (1F)" : "Single Phase (1P)" },
          { value: "bifasico", label: language === "es" ? "Bifásico (2F)" : "Two Phase (2P)" },
          { value: "trifasico", label: language === "es" ? "Trifásico (3F)" : "Three Phase (3P)" }
        ];
    }
  };

  const getVoltageForPanelType = () => {
    switch (panelType) {
      case "monofasico":
        return 127;
      case "bifasico":
        return 220;
      case "trifasico":
        return 220;
    }
  };

  const handlePanelTypeChange = (newType: "monofasico" | "bifasico" | "trifasico") => {
    setPanelType(newType);
    setVoltage(getVoltageForPanelType());

    // Filtrar circuitos que ya no son compatibles con el nuevo tipo de tablero
    const allowedTypes = getAllowedCircuitTypes().map(t => t.value);

    setCircuits(circuits.map(circuit => {
      let updatedCircuit = { ...circuit };

      // Si el tipo de circuito ya no es compatible, cambiarlo a monofásico
      if (!allowedTypes.includes(circuit.type)) {
        updatedCircuit.type = "monofasico";
        updatedCircuit.voltage = getCircuitVoltage("monofasico");
      }

      // Actualizar voltaje según el tipo de tablero
      updatedCircuit.voltage = getCircuitVoltage(updatedCircuit.type);

      return updatedCircuit;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Información del Proyecto */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">
          {language === "es" ? "Información del Proyecto" : "Project Information"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="projectName">
              {language === "es" ? "Nombre del Proyecto" : "Project Name"}
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
              placeholder={language === "es" ? "Ingrese el nombre del proyecto" : "Enter project name"}
            />
          </div>
          <div>
            <Label htmlFor="panelLocation">
              {language === "es" ? "Ubicación del Tablero" : "Panel Location"}
            </Label>
            <Input
              id="panelLocation"
              value={panelLocation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPanelLocation(e.target.value)}
              placeholder={language === "es" ? "Ej: Planta Baja, Cuarto Eléctrico" : "Ex: Ground Floor, Electrical Room"}
            />
          </div>
        </div>
      </Card>

      {/* Configuración del Tablero - Más compacto */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">
          {language === "es" ? "Configuración del Tablero" : "Panel Configuration"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <Label htmlFor="panelType">
              {language === "es" ? "Tipo" : "Type"}
            </Label>
            <Select
              value={panelType}
              onValueChange={(value: "monofasico" | "bifasico" | "trifasico") => handlePanelTypeChange(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monofasico">
                  {language === "es" ? "1F + N" : "1P + N"}
                </SelectItem>
                <SelectItem value="bifasico">
                  {language === "es" ? "2F + N" : "2P + N"}
                </SelectItem>
                <SelectItem value="trifasico">
                  {language === "es" ? "3F + N" : "3P + N"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="calculatedPanelSize">
              {language === "es" ? "Capacidad (A)" : "Capacity (A)"}
            </Label>
            <Input
              id="calculatedPanelSize"
              type="number"
              value={calculatedPanelSize}
              disabled
              className="bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="voltage">
              {language === "es" ? "Voltaje (V)" : "Voltage (V)"}
            </Label>
            <Input
              id="voltage"
              type="number"
              value={voltage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVoltage(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="temperature">
              {language === "es" ? "Temp. (°C)" : "Temp. (°C)"}
            </Label>
            <Input
              id="temperature"
              type="number"
              value={temperature}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemperature(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="serviceLength">
              {language === "es" ? "Long. Acom. (m)" : "Service L. (m)"}
            </Label>
            <Input
              id="serviceLength"
              type="number"
              value={serviceLength}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setServiceLength(Number(e.target.value))}
              placeholder="50"
            />
          </div>
        </div>
      </Card>

      {/* Acometida Principal - Más compacto */}
      {totalPower > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">
            {language === "es" ? "🔌 Acometida Principal" : "🔌 Main Service"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{totalPower.toFixed(0)} W</div>
              <div className="text-xs text-blue-800">
                {language === "es" ? "Carga Total" : "Total Load"}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{serviceCurrent.toFixed(1)} A</div>
              <div className="text-xs text-purple-800">
                {language === "es" ? "Corriente" : "Current"}
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {serviceWireSize} AWG
              </div>
              <div className="text-xs text-green-800">
                {language === "es" ? "Cable" : "Wire"}
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">
                {serviceConduitSize}
              </div>
              <div className="text-xs text-orange-800">
                {language === "es" ? "Ducto" : "Conduit"}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-600">
                {groundWireSize} AWG
              </div>
              <div className="text-xs text-gray-800">
                {language === "es" ? "Tierra" : "Ground"}
              </div>
            </div>
            <div className={`text-center p-3 rounded-lg ${serviceVoltageDropData.percentage > 1 ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className={`text-lg font-bold ${serviceVoltageDropData.percentage > 1 ? 'text-red-600' : 'text-green-600'}`}>
                {serviceVoltageDropData.percentage.toFixed(2)}%
              </div>
              <div className={`text-xs ${serviceVoltageDropData.percentage > 1 ? 'text-red-800' : 'text-green-800'}`}>
                {language === "es" ? "Caída V" : "V Drop"}
                {serviceVoltageDropData.percentage > 1 && " ⚠️"}
              </div>
            </div>
          </div>

          {/* Acometida completa - más compacto */}
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <div className="text-sm font-semibold text-green-700 mb-1">
                {language === "es" ? "Acometida Completa:" : "Complete Service:"}
              </div>
              <div className="text-lg font-mono font-bold text-green-800">
                {formatServiceWiring(serviceWireSize || "", groundWireSize || "", panelType)}
                <span className="ml-2 text-sm">({serviceConduitSize})</span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>{language === "es" ? "Criterios:" : "Criteria:"}</strong>
              {language === "es"
                ? " Factor 1.25 corriente, caída tensión ≤1% acometida, <2% circuitos. Total máximo: 3% (1%+2%)."
                : " 1.25 current factor, voltage drop ≤1% service, <2% circuits. Max total: 3% (1%+2%)."}
            </p>
          </div>
        </Card>
      )}

      {/* Tabla de Circuitos - Protagonista principal */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            {language === "es" ? "📋 Circuitos del Tablero" : "📋 Panel Circuits"}
          </h3>
          <Button onClick={addCircuit}>
            {language === "es" ? "➕ Agregar" : "➕ Add"}
          </Button>
        </div>

        {/* Información compacta */}
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <p className="text-xs text-blue-800">
                <strong>{language === "es" ? "Tipos permitidos:" : "Allowed types:"}</strong>
                <span className="ml-1">
                  {getAllowedCircuitTypes().map(type => type.value === "monofasico" ? "1F" : type.value === "bifasico" ? "2F" : "3F").join(", ")}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-800">
                <strong>{language === "es" ? "Fases automáticas:" : "Auto phases:"}</strong>
                <span className="ml-1">
                  {language === "es" ? "Secuencial por orden" : "Sequential by order"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-800">
                <strong>{language === "es" ? "Caída V máx:" : "Max V drop:"}</strong>
                <span className="ml-1">
                  {language === "es" ? "<2% circuitos" : "<2% circuits"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-12">#</TableHead>
                <TableHead className="w-20">{language === "es" ? "Tipo" : "Type"}</TableHead>
                <TableHead className="min-w-[200px]">{language === "es" ? "Descripción" : "Description"}</TableHead>
                <TableHead className="text-center w-24">{language === "es" ? "Pot. Unit." : "Unit Pwr"}</TableHead>
                <TableHead className="text-center w-16">{language === "es" ? "Cant." : "Qty"}</TableHead>
                <TableHead className="text-center w-24">{language === "es" ? "Pot. Total" : "Total Pwr"}</TableHead>
                <TableHead className="text-center w-20">{language === "es" ? "Long." : "Length"}</TableHead>
                <TableHead className="text-center w-16">F.P.</TableHead>
                <TableHead className="text-center w-16">V</TableHead>
                <TableHead className="text-center w-20">{language === "es" ? "Fase" : "Phase"}</TableHead>
                <TableHead className="text-center w-16">{language === "es" ? "Acciones" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {circuits.map((circuit, index) => {
                // Simular la asignación automática de fases para mostrar en la tabla
                const phasesAvailable = panelType === "monofasico" ? ["A"] :
                  panelType === "bifasico" ? ["A", "B"] :
                    ["A", "B", "C"];

                let circuitPosition = 0;
                // Calcular la posición de este circuito considerando los anteriores
                for (let i = 0; i < index; i++) {
                  const prevCircuit = circuits[i];
                  if (prevCircuit.type === "monofasico") {
                    circuitPosition += 1;
                  } else if (prevCircuit.type === "bifasico") {
                    circuitPosition += 2;
                  } else {
                    circuitPosition += 3;
                  }
                }

                let previewPhase: string;
                if (circuit.type === "monofasico") {
                  previewPhase = phasesAvailable[circuitPosition % phasesAvailable.length];
                } else if (circuit.type === "bifasico") {
                  const phaseIndex = circuitPosition % phasesAvailable.length;
                  const nextPhaseIndex = (phaseIndex + 1) % phasesAvailable.length;
                  previewPhase = `${phasesAvailable[phaseIndex]}-${phasesAvailable[nextPhaseIndex]}`;
                } else {
                  previewPhase = "A-B-C";
                }

                return (
                  <TableRow key={circuit.id}>
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Select
                        value={circuit.type}
                        onValueChange={(value: string) => updateCircuit(circuit.id, "type", value)}
                      >
                        <SelectTrigger className="w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAllowedCircuitTypes().map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.value === "monofasico" ? "1F" : type.value === "bifasico" ? "2F" : "3F"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={circuit.description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCircuit(circuit.id, "description", e.target.value)}
                        placeholder={language === "es" ? "Descripción del circuito" : "Circuit description"}
                        className="min-w-[180px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={circuit.power}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCircuit(circuit.id, "power", Number(e.target.value))}
                        className="w-20"
                        placeholder="100"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={circuit.quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCircuit(circuit.id, "quantity", Number(e.target.value))}
                        className="w-12"
                        min="1"
                        placeholder="1"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {(circuit.power * circuit.quantity).toFixed(0)}W
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={circuit.length}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCircuit(circuit.id, "length", Number(e.target.value))}
                        className="w-16"
                        placeholder="20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="1.0"
                        value={circuit.powerFactor}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCircuit(circuit.id, "powerFactor", Number(e.target.value))}
                        className="w-12"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {circuit.voltage}V
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="text-xs">
                        {previewPhase}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCircuit(circuit.id)}
                      >
                        🗑️
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {circuits.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            {language === "es"
              ? "No hay circuitos agregados. Haga clic en 'Agregar' para comenzar."
              : "No circuits added. Click 'Add' to start."}
          </div>
        )}
      </Card>

      {/* Resultados en Pantalla */}
      {results && (
        <>
          {/* Resumen General - Más compacto */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">
              {language === "es" ? "📊 Resumen del Tablero" : "📊 Panel Summary"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{results.circuits.length}</div>
                <div className="text-xs text-blue-800">
                  {language === "es" ? "Circuitos" : "Circuits"}
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{results.totalPower.toFixed(0)} W</div>
                <div className="text-xs text-green-800">
                  {language === "es" ? "Potencia" : "Power"}
                </div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{results.totalCurrent.toFixed(1)} A</div>
                <div className="text-xs text-orange-800">
                  {language === "es" ? "Corriente" : "Current"}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{((results.totalCurrent / calculatedPanelSize) * 100).toFixed(1)}%</div>
                <div className="text-xs text-purple-800">
                  {language === "es" ? "Carga" : "Load"}
                </div>
              </div>
            </div>
          </Card>

          {/* Balance de Fases - Más compacto */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">
              {language === "es" ? "⚡ Balance de Fases" : "⚡ Phase Balance"}
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    {panelType === "monofasico" ? "L1" : "Fase A (L1)"}
                  </span>
                  <span className="text-sm font-bold">{results.phaseBalance.A.toFixed(2)} A</span>
                </div>
                <Progress value={(results.phaseBalance.A / Math.max(results.phaseBalance.A, results.phaseBalance.B, results.phaseBalance.C)) * 100} className="h-2" />
              </div>

              {panelType !== "monofasico" && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Fase B (L2)</span>
                    <span className="text-sm font-bold">{results.phaseBalance.B.toFixed(2)} A</span>
                  </div>
                  <Progress value={(results.phaseBalance.B / Math.max(results.phaseBalance.A, results.phaseBalance.B, results.phaseBalance.C)) * 100} className="h-2" />
                </div>
              )}

              {panelType === "trifasico" && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Fase C (L3)</span>
                    <span className="text-sm font-bold">{results.phaseBalance.C.toFixed(2)} A</span>
                  </div>
                  <Progress value={(results.phaseBalance.C / Math.max(results.phaseBalance.A, results.phaseBalance.B, results.phaseBalance.C)) * 100} className="h-2" />
                </div>
              )}
            </div>
          </Card>

          {/* Detalles de Circuitos - Esta es la tabla más importante */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === "es" ? "🔌 Cálculos Detallados de Circuitos" : "🔌 Detailed Circuit Calculations"}
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">#</TableHead>
                    <TableHead>{language === "es" ? "Descripción" : "Description"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Tipo" : "Type"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Tensión" : "Voltage"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Potencia" : "Power"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Corriente" : "Current"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "I×1.25" : "I×1.25"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Longitud" : "Length"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Fase" : "Phase"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Acometida Completa" : "Complete Wiring"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Ducto" : "Conduit"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Protección" : "Protection"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Caída V" : "V Drop"}</TableHead>
                    <TableHead className="text-center">{language === "es" ? "Pérdidas" : "Losses"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.circuits.map((circuit, index) => {
                    // Formatear protección completa
                    const formatCompleteProtection = (protection: string, type: string) => {
                      const amperage = protection.replace(/[^\d]/g, "");
                      if (type === "trifasico") {
                        return `3x${amperage}A`;
                      } else if (type === "bifasico") {
                        return `2x${amperage}A`;
                      } else {
                        return `1x${amperage}A`;
                      }
                    };

                    return (
                      <TableRow key={circuit.id}>
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{circuit.description}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={circuit.type === "trifasico" ? "default" : circuit.type === "bifasico" ? "secondary" : "outline"}>
                            {circuit.type === "trifasico" ? "3F" : circuit.type === "bifasico" ? "2F" : "1F"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {circuit.voltage}V
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono">{circuit.power.toFixed(0)} W</TableCell>
                        <TableCell className="text-center font-mono">{circuit.current.toFixed(2)} A</TableCell>
                        <TableCell className="text-center font-mono text-blue-600">{circuit.currentWithFactor.toFixed(2)} A</TableCell>
                        <TableCell className="text-center">{circuits.find(c => c.id === circuit.id)?.length || 0} m</TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            let display: string;
                            if (circuit.type === "bifasico") {
                              const next = circuit.phase === "A" ? "B" : circuit.phase === "B" ? "C" : "A";
                              display = `${circuit.phase}-${next}`;
                            } else if (circuit.type === "trifasico") {
                              display = "A-B-C";
                            } else {
                              display = circuit.phase;
                            }
                            return <Badge variant="outline">{display}</Badge>;
                          })()}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs">{circuit.wireConfiguration}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">{circuit.conduitSize}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive" className="text-xs">{formatCompleteProtection(circuit.protection, circuit.type)}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={circuit.voltageDrop > 2 ? "destructive" : circuit.voltageDrop > 1.8 ? "secondary" : "default"} className="text-xs">
                            {circuit.voltageDrop.toFixed(2)}%
                            {circuit.voltageDrop > 2 && " ⚠️"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs">{circuit.powerLoss.toFixed(1)} W</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}

      {/* Exportar */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleExportExcel}
          disabled={circuits.length === 0}
          variant="outline"
        >
          📊 {language === "es" ? "Excel" : "Excel"}
        </Button>
        <Button
          onClick={handleExportPDF}
          disabled={circuits.length === 0}
        >
          📄 {language === "es" ? "PDF" : "PDF"}
        </Button>
      </div>
    </div>
  );
} 