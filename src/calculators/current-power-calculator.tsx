import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { Label } from "../Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";

type SupportedLanguage = "en" | "es";

export function CurrentPowerCalculator({ language }: { language: SupportedLanguage }) {
  const content = {
    es: {
      title: "Calculadora de Corriente y Potencia",
      voltage: "Tensión (V) *",
      current: "Corriente (A)",
      nominalCurrent: "Corriente Nominal (A)",
      designCurrent: "Corriente de Diseño (A)",
      power: "Potencia *",
      powerUnit: "Unidad de Potencia",
      kw: "Kilowatts (kW)",
      hp: "Caballos de Fuerza (HP)",
      powerValue: "Valor de Potencia",
      powerFactor: "Factor de Potencia",
      system: "Sistema",
      singlePhase: "Monofásico",
      threePhase: "Trifásico",
      calculatePower: "Calcular Potencia",
      calculateCurrent: "Calcular Corriente",
      designNote: "La corriente de diseño es 1.25 veces la corriente nominal",
      requiredField: "Campo obligatorio",
      invalidVoltage: "La tensión debe ser mayor a 0",
      invalidCurrent: "La corriente debe ser mayor a 0",
      invalidPower: "La potencia debe ser mayor a 0",
      invalidPowerFactor: "El factor de potencia debe estar entre 0.1 y 1.0",
      voltageHelp: "Ej: 120, 220, 380, 480",
      powerFactorHelp: "Rango válido: 0.1 - 1.0",
      powerHelp: "Para motores típicamente 0.75-15 kW o 1-20 HP",
      missingFieldsForPower: "Para calcular potencia necesitas: tensión, corriente y factor de potencia",
      missingFieldsForCurrent: "Para calcular corriente necesitas: tensión, potencia y factor de potencia"
    },
    en: {
      title: "Current and Power Calculator",
      voltage: "Voltage (V) *",
      current: "Current (A)",
      nominalCurrent: "Nominal Current (A)",
      designCurrent: "Design Current (A)",
      power: "Power *",
      powerUnit: "Power Unit",
      kw: "Kilowatts (kW)",
      hp: "Horsepower (HP)",
      powerValue: "Power Value",
      powerFactor: "Power Factor",
      system: "System",
      singlePhase: "Single Phase",
      threePhase: "Three Phase",
      calculatePower: "Calculate Power",
      calculateCurrent: "Calculate Current",
      designNote: "Design current is 1.25 times the nominal current",
      requiredField: "Required field",
      invalidVoltage: "Voltage must be greater than 0",
      invalidCurrent: "Current must be greater than 0",
      invalidPower: "Power must be greater than 0",
      invalidPowerFactor: "Power factor must be between 0.1 and 1.0",
      voltageHelp: "Ex: 120, 220, 380, 480",
      powerFactorHelp: "Valid range: 0.1 - 1.0",
      powerHelp: "For motors typically 0.75-15 kW or 1-20 HP",
      missingFieldsForPower: "To calculate power you need: voltage, current and power factor",
      missingFieldsForCurrent: "To calculate current you need: voltage, power and power factor"
    }
  };

  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [designCurrent, setDesignCurrent] = useState("");
  const [power, setPower] = useState("");
  const [powerUnit, setPowerUnit] = useState("kw");
  const [powerFactor, setPowerFactor] = useState("0.9");
  const [phase, setPhase] = useState("3");

  // Validation states
  const [errors, setErrors] = useState<{
    voltage?: string;
    current?: string;
    power?: string;
    powerFactor?: string;
    calculation?: string;
  }>({});

  // Conversion factor from HP to kW
  const HP_TO_KW = 0.746;

  // Validation functions
  const validateForPowerCalculation = (): boolean => {
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

    // Validate power factor (has default value, so only validate range if present)
    const powerFactorValue = parseFloat(powerFactor);
    if (isNaN(powerFactorValue) || powerFactorValue < 0.1 || powerFactorValue > 1.0) {
      newErrors.powerFactor = content[language].invalidPowerFactor;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForCurrentCalculation = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate voltage
    const voltageValue = parseFloat(voltage);
    if (!voltage) {
      newErrors.voltage = content[language].requiredField;
    } else if (isNaN(voltageValue) || voltageValue <= 0) {
      newErrors.voltage = content[language].invalidVoltage;
    }

    // Validate power
    const powerValue = parseFloat(power);
    if (!power) {
      newErrors.power = content[language].requiredField;
    } else if (isNaN(powerValue) || powerValue <= 0) {
      newErrors.power = content[language].invalidPower;
    }

    // Validate power factor (has default value, so only validate range if present)
    const powerFactorValue = parseFloat(powerFactor);
    if (isNaN(powerFactorValue) || powerFactorValue < 0.1 || powerFactorValue > 1.0) {
      newErrors.powerFactor = content[language].invalidPowerFactor;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePower = () => {
    if (!validateForPowerCalculation()) {
      return;
    }

    // Check if required fields for power calculation are present
    if (!voltage || !current) {
      setErrors({ calculation: content[language].missingFieldsForPower });
      return;
    }

    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const pf = parseFloat(powerFactor);

    // Calculate power in kW
    const powerInKw = phase === "3"
      ? Math.sqrt(3) * v * i * pf / 1000
      : v * i * pf / 1000;

    // Convert to HP if necessary
    if (powerUnit === "hp") {
      const powerInHp = powerInKw / HP_TO_KW;
      setPower(powerInHp.toFixed(2));
    } else {
      setPower(powerInKw.toFixed(2));
    }

    // Clear any previous errors
    setErrors({});
  };

  const calculateCurrent = () => {
    if (!validateForCurrentCalculation()) {
      return;
    }

    // Check if required fields for current calculation are present
    if (!voltage || !power) {
      setErrors({ calculation: content[language].missingFieldsForCurrent });
      return;
    }

    const v = parseFloat(voltage);
    let p = parseFloat(power);
    const pf = parseFloat(powerFactor);

    // Convert HP to kW if necessary
    if (powerUnit === "hp") {
      p = p * HP_TO_KW;
    }

    // Convert kW to W
    p = p * 1000;

    // Calculate nominal current
    const nominalCurrent = phase === "3"
      ? p / (Math.sqrt(3) * v * pf)
      : p / (v * pf);

    // Set nominal current
    setCurrent(nominalCurrent.toFixed(2));

    // Calculate design current (1.25 × nominal)
    setDesignCurrent((nominalCurrent * 1.25).toFixed(2));

    // Clear any previous errors
    setErrors({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {content[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error message for calculation */}
        {errors.calculation && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {errors.calculation}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              <Label htmlFor="current">
                <div className="flex items-center">
                  {content[language].nominalCurrent}
                  <div className="min-h-[1.25rem] mt-1">
                    {errors.current && (
                      <p className="text-red-500 text-xs">{errors.current}</p>
                    )}
                  </div>
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
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setDesignCurrent((value * 1.25).toFixed(2));
                  } else {
                    setDesignCurrent("");
                  }
                  if (errors.current) {
                    setErrors(prev => ({ ...prev, current: undefined }));
                  }
                }}
                placeholder="10"
                className={errors.current ? "border-red-500" : ""}
              />

              <div className="min-h-[1.25rem]"></div>
            </div>

            <div>
              <Label htmlFor="design-current">
                {content[language].designCurrent}
              </Label>
              <Input
                id="design-current"
                type="number"
                value={designCurrent}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">
                {content[language].designNote}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="power-unit">
                  {content[language].powerUnit}
                </Label>
                <Select value={powerUnit} onValueChange={setPowerUnit}>
                  <SelectTrigger id="power-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kw">{content[language].kw}</SelectItem>
                    <SelectItem value="hp">{content[language].hp}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center">
                  <Label htmlFor="power">
                    {content[language].powerValue}
                  </Label>
                  <div className="min-h-[1.25rem] mt-1">
                    {errors.power && (
                      <p className="text-red-500 text-xs">{errors.power}</p>
                    )}
                  </div>
                </div>
                <Input
                  id="power"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={power}
                  onChange={(e) => {
                    setPower(e.target.value);
                    if (errors.power) {
                      setErrors(prev => ({ ...prev, power: undefined }));
                    }
                  }}
                  placeholder={powerUnit === "kw" ? "2.2" : "3.0"}
                  className={errors.power ? "border-red-500" : ""}
                />
                <div className="min-h-[1.25rem]"></div>
              </div>
            </div>


            <div>
              <div className="flex items-center">
                <Label htmlFor="power-factor">
                  {content[language].powerFactor}
                </Label>
                <div className="min-h-[1.25rem] mt-1">
                  {errors.powerFactor && (
                    <p className="text-red-500 text-xs">{errors.powerFactor}</p>
                  )}
                </div>
              </div>
              <Input
                id="power-factor"
                type="number"
                min="0.1"
                max="1.0"
                step="0.01"
                value={powerFactor}
                onChange={(e) => {
                  setPowerFactor(e.target.value);
                  if (errors.powerFactor) {
                    setErrors(prev => ({ ...prev, powerFactor: undefined }));
                  }
                }}
                placeholder="0.9"
                className={errors.powerFactor ? "border-red-500" : ""}
              />

              <p className="text-gray-500 text-xs mt-1">{content[language].powerFactorHelp}</p>
            </div>

            <div>
              <Label htmlFor="phase">
                {content[language].system}
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
              <div className="min-h-[1.25rem] mt-1"></div>
              <div className="min-h-[1rem]"></div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex sm:space-x-4 sm:flex-row flex-col sm:gap-4 gap-2">
          <Button onClick={calculatePower} className="flex-1">
            {content[language].calculatePower}
          </Button>
          <Button onClick={calculateCurrent} className="flex-1">
            {content[language].calculateCurrent}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 