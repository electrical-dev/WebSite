import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type SupportedLanguage = "en" | "es";

export function VoltageDrop({ language }: { language: SupportedLanguage }) {
  const content = {
    es: {
      title: "Calculadora de Caída de Tensión",
      voltage: "Tensión (V) *",
      current: "Corriente (A) *",
      length: "Longitud del Cable (m) *",
      material: "Material del Conductor",
      copper: "Cobre",
      aluminum: "Aluminio",
      size: "Calibre del Cable (AWG/kcmil)",
      phase: "Sistema",
      singlePhase: "Monofásico",
      threePhase: "Trifásico",
      result: "Resultado:",
      voltageDrop: "Caída de Tensión (V):",
      percentageDrop: "Caída de Tensión (%):",
      calculate: "Calcular Caída de Tensión",
      acceptable: "Caída aceptable (< 3%)",
      warning: "Caída elevada (3-5%)",
      critical: "Caída crítica (> 5%)",
      requiredField: "Campo obligatorio",
      invalidVoltage: "La tensión debe ser mayor a 0",
      invalidCurrent: "La corriente debe ser mayor a 0",
      invalidLength: "La longitud debe ser mayor a 0",
      voltageHelp: "Ej: 120, 220, 380, 480",
      currentHelp: "Corriente que circula por el cable",
      lengthHelp: "Distancia total del cable"
    },
    en: {
      title: "Voltage Drop Calculator",
      voltage: "Voltage (V) *",
      current: "Current (A) *",
      length: "Cable Length (m) *",
      material: "Conductor Material",
      copper: "Copper",
      aluminum: "Aluminum",
      size: "Cable Size (AWG/kcmil)",
      phase: "System",
      singlePhase: "Single Phase",
      threePhase: "Three Phase",
      result: "Result:",
      voltageDrop: "Voltage Drop (V):",
      percentageDrop: "Voltage Drop (%):",
      calculate: "Calculate Voltage Drop",
      acceptable: "Acceptable drop (< 3%)",
      warning: "High drop (3-5%)",
      critical: "Critical drop (> 5%)",
      requiredField: "Required field",
      invalidVoltage: "Voltage must be greater than 0",
      invalidCurrent: "Current must be greater than 0",
      invalidLength: "Length must be greater than 0",
      voltageHelp: "Ex: 120, 220, 380, 480",
      currentHelp: "Current flowing through the cable",
      lengthHelp: "Total cable distance"
    }
  };

  // State variables
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [length, setLength] = useState("");
  const [material, setMaterial] = useState("copper");
  const [size, setSize] = useState("12");
  const [phase, setPhase] = useState("3");
  const [voltageDrop, setVoltageDrop] = useState<number | null>(null);
  const [percentageDrop, setPercentageDrop] = useState<number | null>(null);

  // Validation states
  const [errors, setErrors] = useState<{
    voltage?: string;
    current?: string;
    length?: string;
  }>({});

  // Resistivity (ohm-circular mil per foot)
  const resistivity = {
    copper: 10.371,
    aluminum: 17.0
  };

  // AWG sizes and their circular mil areas
  const awgSizes: Record<string, number> = {
    "14": 4110,
    "12": 6530,
    "10": 10380,
    "8": 16510,
    "6": 26240,
    "4": 41740,
    "3": 52620,
    "2": 66360,
    "1": 83690,
    "1/0": 105600,
    "2/0": 133100,
    "3/0": 167800,
    "4/0": 211600,
    "250": 250000,
    "300": 300000,
    "350": 350000,
    "400": 400000,
    "500": 500000,
    "600": 600000,
    "750": 750000,
    "1000": 1000000
  };

  // Validation function
  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate voltage
    const voltageValue = parseFloat(voltage);
    if (!voltage) {
      newErrors.voltage = content[language].requiredField;
    } else if (isNaN(voltageValue) || voltageValue <= 0) {
      newErrors.voltage = content[language].invalidVoltage;
    }

    // Validate current
    const currentValue = parseFloat(current);
    if (!current) {
      newErrors.current = content[language].requiredField;
    } else if (isNaN(currentValue) || currentValue <= 0) {
      newErrors.current = content[language].invalidCurrent;
    }

    // Validate length
    const lengthValue = parseFloat(length);
    if (!length) {
      newErrors.length = content[language].requiredField;
    } else if (isNaN(lengthValue) || lengthValue <= 0) {
      newErrors.length = content[language].invalidLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate the voltage drop
  const calculateVoltageDrop = () => {
    // Validate inputs first
    if (!validateInputs()) {
      return;
    }

    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const l = parseFloat(length);

    // Convert meters to feet (1m = 3.28084ft)
    const lengthInFeet = l * 3.28084;

    // Get circular mil area
    const circularMilArea = awgSizes[size];

    // Calculate resistance per conductor
    const resistance = (resistivity[material as keyof typeof resistivity] * lengthInFeet) / circularMilArea;

    // Calculate voltage drop based on phase
    let vDrop;
    if (phase === "1") {
      // Single phase: VD = 2 * I * R
      vDrop = 2 * i * resistance;
    } else {
      // Three phase: VD = √3 * I * R
      vDrop = Math.sqrt(3) * i * resistance;
    }

    // Calculate percentage drop
    const pDrop = (vDrop / v) * 100;

    setVoltageDrop(vDrop);
    setPercentageDrop(pDrop);
  };

  // Determine status color based on percentage drop
  const getStatusColor = () => {
    if (percentageDrop === null) return "text-gray-700 dark:text-gray-300";
    if (percentageDrop < 3) return "text-green-600 dark:text-green-400";
    if (percentageDrop < 5) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  // Determine status message
  const getStatusMessage = () => {
    if (percentageDrop === null) return "";
    if (percentageDrop < 3) return content[language].acceptable;
    if (percentageDrop < 5) return content[language].warning;
    return content[language].critical;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {content[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Left Column */}
          <div className="space-y-1">
            <div>
              <Label htmlFor="voltage" className="flex items-center">
                {content[language].voltage}
                <span className="text-red-500 ml-1">*</span>
                <div className="min-h-[1.25rem] mt-1">
                  {errors.voltage && (
                    <p className="text-red-500 text-xs">{errors.voltage}</p>
                  )}
                </div>
              </Label>
              <Input
                id="voltage"
                type="number"
                min="0.1"
                step="0.1"
                value={voltage}
                onChange={(e) => {
                  setVoltage(e.target.value);
                  if (errors.voltage) {
                    setErrors(prev => ({ ...prev, voltage: undefined }));
                  }
                }}
                placeholder="220"
                className={errors.voltage ? "border-red-500" : ""}
              />
              <p className="text-gray-500 text-xs mt-1">{content[language].voltageHelp}</p>
            </div>

            <div>
              <Label htmlFor="current" className="flex items-center">
                {content[language].current}
                <span className="text-red-500 ml-1">*</span>
                <div className="min-h-[1.25rem] mt-1">
                  {errors.current && (
                    <p className="text-red-500 text-xs">{errors.current}</p>
                  )}
                </div>
              </Label>
              <Input
                id="current"
                type="number"
                min="0.1"
                step="0.1"
                value={current}
                onChange={(e) => {
                  setCurrent(e.target.value);
                  if (errors.current) {
                    setErrors(prev => ({ ...prev, current: undefined }));
                  }
                }}
                placeholder="20"
                className={errors.current ? "border-red-500" : ""}
              />
              <p className="text-gray-500 text-xs mt-1">{content[language].currentHelp}</p>
            </div>

            <div>
              <Label htmlFor="length" className="flex items-center">
                {content[language].length}
                <span className="text-red-500 ml-1">*</span>
                <div className="min-h-[1.25rem] mt-1">
                  {errors.length && (
                    <p className="text-red-500 text-xs">{errors.length}</p>
                  )}
                </div>
              </Label>
              <Input
                id="length"
                type="number"
                min="0.1"
                step="0.1"
                value={length}
                onChange={(e) => {
                  setLength(e.target.value);
                  if (errors.length) {
                    setErrors(prev => ({ ...prev, length: undefined }));
                  }
                }}
                placeholder="50"
                className={errors.length ? "border-red-500" : ""}
              />
              <p className="text-gray-500 text-xs mt-1">{content[language].lengthHelp}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            <div>
              <Label htmlFor="material">
                {content[language].material}
              </Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger id="material">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copper">{content[language].copper}</SelectItem>
                  <SelectItem value="aluminum">{content[language].aluminum}</SelectItem>
                </SelectContent>
              </Select>
              <div className="min-h-[1.25rem]"></div>
            </div>

            <div>
              <Label htmlFor="size">
                {content[language].size}
              </Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger id="size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">14 AWG</SelectItem>
                  <SelectItem value="12">12 AWG</SelectItem>
                  <SelectItem value="10">10 AWG</SelectItem>
                  <SelectItem value="8">8 AWG</SelectItem>
                  <SelectItem value="6">6 AWG</SelectItem>
                  <SelectItem value="4">4 AWG</SelectItem>
                  <SelectItem value="3">3 AWG</SelectItem>
                  <SelectItem value="2">2 AWG</SelectItem>
                  <SelectItem value="1">1 AWG</SelectItem>
                  <SelectItem value="1/0">1/0 AWG</SelectItem>
                  <SelectItem value="2/0">2/0 AWG</SelectItem>
                  <SelectItem value="3/0">3/0 AWG</SelectItem>
                  <SelectItem value="4/0">4/0 AWG</SelectItem>
                  <SelectItem value="250">250 kcmil</SelectItem>
                  <SelectItem value="300">300 kcmil</SelectItem>
                  <SelectItem value="350">350 kcmil</SelectItem>
                  <SelectItem value="400">400 kcmil</SelectItem>
                  <SelectItem value="500">500 kcmil</SelectItem>
                  <SelectItem value="600">600 kcmil</SelectItem>
                  <SelectItem value="750">750 kcmil</SelectItem>
                  <SelectItem value="1000">1000 kcmil</SelectItem>
                </SelectContent>
              </Select>
              <div className="min-h-[1.25rem]"></div>
            </div>

            <div>
              <Label htmlFor="phase">
                {content[language].phase}
              </Label>
              <Select value={phase} onValueChange={setPhase}>
                <SelectTrigger id="phase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{content[language].singlePhase}</SelectItem>
                  <SelectItem value="3">{content[language].threePhase}</SelectItem>
                </SelectContent>
              </Select>
              <div className="min-h-[1.25rem]"></div>
            </div>
          </div>
        </div>

        {/* Calculate Button - Full Width */}
        <div className="mt-6">
          <Button onClick={calculateVoltageDrop} className="w-full">
            {content[language].calculate}
          </Button>
        </div>

        {/* Results */}
        {voltageDrop !== null && percentageDrop !== null && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="font-semibold mb-2">
              {content[language].result}
            </h3>
            <p className="mb-1">
              {content[language].voltageDrop} {voltageDrop.toFixed(2)} V
            </p>
            <p className={`${getStatusColor()} font-medium`}>
              {content[language].percentageDrop} {percentageDrop.toFixed(2)}% - {getStatusMessage()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 