import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type SupportedLanguage = "en" | "es";

export function CurrentPowerCalculator({ language }: { language: SupportedLanguage }) {
  const content = {
    es: {
      title: "Calculadora de Corriente y Potencia",
      voltage: "Tensión (V)",
      current: "Corriente (A)",
      nominalCurrent: "Corriente Nominal (A)",
      designCurrent: "Corriente de Diseño (A)",
      power: "Potencia",
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
      designNote: "La corriente de diseño es 1.25 veces la corriente nominal"
    },
    en: {
      title: "Current and Power Calculator",
      voltage: "Voltage (V)",
      current: "Current (A)",
      nominalCurrent: "Nominal Current (A)",
      designCurrent: "Design Current (A)",
      power: "Power",
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
      designNote: "Design current is 1.25 times the nominal current"
    }
  };

  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [designCurrent, setDesignCurrent] = useState("");
  const [power, setPower] = useState("");
  const [powerUnit, setPowerUnit] = useState("kw");
  const [powerFactor, setPowerFactor] = useState("0.9");
  const [phase, setPhase] = useState("3");

  // Conversion factor from HP to kW
  const HP_TO_KW = 0.746;

  const calculatePower = () => {
    if (voltage && current && powerFactor) {
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
    }
  };

  const calculateCurrent = () => {
    if (voltage && power && powerFactor) {
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
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {content[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="voltage">
                {content[language].voltage}
              </Label>
              <Input
                id="voltage"
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                placeholder="220"
              />
            </div>

            <div>
              <Label htmlFor="current">
                {content[language].nominalCurrent}
              </Label>
              <Input
                id="current"
                type="number"
                value={current}
                onChange={(e) => {
                  setCurrent(e.target.value);
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setDesignCurrent((value * 1.25).toFixed(2));
                  } else {
                    setDesignCurrent("");
                  }
                }}
                placeholder="10"
              />
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

          <div className="space-y-4">
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
                <Label htmlFor="power">
                  {content[language].powerValue}
                </Label>
                <Input
                  id="power"
                  type="number"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  placeholder={powerUnit === "kw" ? "2.2" : "3.0"}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="power-factor">
                {content[language].powerFactor}
              </Label>
              <Input
                id="power-factor"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={powerFactor}
                onChange={(e) => setPowerFactor(e.target.value)}
                placeholder="0.9"
              />
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