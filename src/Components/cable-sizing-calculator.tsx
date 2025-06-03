import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type SupportedLanguage = "en" | "es";

export function CableSizingCalculator({ language }: { language: SupportedLanguage }) {
  const content = {
    es: {
      title: "Dimensionamiento de Cable",
      designCurrent: "Corriente de Diseño (A)",
      conductorMaterial: "Material del Conductor",
      copper: "Cobre",
      aluminum: "Aluminio",
      temperatureRating: "Temperatura Nominal (°C)",
      temperatureCorrection: "Corrección por Temperatura",
      ambientTemperature: "Temperatura Ambiente (°C)",
      installationType: "Tipo de Instalación",
      inConduit: "En Tubería",
      inTray: "En Bandeja",
      directBuried: "Enterrado Directo",
      conductorCount: "Cantidad de Conductores",
      groupingFactor: "Factor de Agrupamiento",
      adjustedCurrent: "Corriente Ajustada (A)",
      calculateCableSize: "Calcular Tamaño de Cable",
      result: "Resultado:",
      recommendedCableSize: "Tamaño de cable recomendado:",
      ampacityDerating: "Capacidad de corriente después de factores:"
    },
    en: {
      title: "Cable Sizing",
      designCurrent: "Design Current (A)",
      conductorMaterial: "Conductor Material",
      copper: "Copper",
      aluminum: "Aluminum",
      temperatureRating: "Temperature Rating (°C)",
      temperatureCorrection: "Temperature Correction",
      ambientTemperature: "Ambient Temperature (°C)",
      installationType: "Installation Type",
      inConduit: "In Conduit",
      inTray: "In Tray",
      directBuried: "Direct Buried",
      conductorCount: "Conductor Count",
      groupingFactor: "Grouping Factor",
      adjustedCurrent: "Adjusted Current (A)",
      calculateCableSize: "Calculate Cable Size",
      result: "Result:",
      recommendedCableSize: "Recommended cable size:",
      ampacityDerating: "Ampacity after derating factors:"
    }
  };

  const [current, setCurrent] = useState("");
  const [temperature, setTemperature] = useState("75");
  const [ambientTemp, setAmbientTemp] = useState("30");
  const [installationType, setInstallationType] = useState("conduit");
  const [cableSize, setCableSize] = useState("");
  const [conductorMaterial, setConductorMaterial] = useState("copper");
  const [conductorCount, setConductorCount] = useState("3");
  const [adjustedCurrent, setAdjustedCurrent] = useState("");
  const [deratedAmpacity, setDeratedAmpacity] = useState<number | null>(null);

  // Temperature correction factors
  const temperatureCorrectionFactors: Record<string, Record<string, number>> = {
    "60": {
      "10": 1.29, "15": 1.22, "20": 1.15, "25": 1.08,
      "30": 1.00, "35": 0.91, "40": 0.82, "45": 0.71, "50": 0.58
    },
    "75": {
      "10": 1.20, "15": 1.15, "20": 1.11, "25": 1.05,
      "30": 1.00, "35": 0.94, "40": 0.88, "45": 0.82, "50": 0.75, "55": 0.67
    },
    "90": {
      "10": 1.15, "15": 1.12, "20": 1.08, "25": 1.04,
      "30": 1.00, "35": 0.96, "40": 0.91, "45": 0.87, "50": 0.82, "55": 0.76, "60": 0.71
    }
  };

  // Conductor count adjustment factors per NEC Table 310.15(B)(3)(a)
  const conductorCountFactors: Record<string, number> = {
    "1": 1.0, "2": 1.0, "3": 1.0,
    "4": 0.8, "5": 0.8, "6": 0.8,
    "7": 0.7, "8": 0.7, "9": 0.7,
    "10": 0.5, "11": 0.5, "12": 0.5, "13": 0.5, "14": 0.5, "15": 0.5,
    "16": 0.5, "17": 0.5, "18": 0.5, "19": 0.5, "20": 0.5,
    "21": 0.45, "22": 0.45, "23": 0.45, "24": 0.45, "25": 0.45,
    "26": 0.45, "27": 0.45, "28": 0.45, "29": 0.45, "30": 0.45,
    "31": 0.4, "32": 0.4, "33": 0.4, "34": 0.4, "35": 0.4,
    "36": 0.4, "37": 0.4, "38": 0.4, "39": 0.4, "40": 0.4,
    "41+": 0.35
  };

  // Ampacity table for copper and aluminum at different temperature ratings
  const ampacityTable: Record<string, Record<string, Record<string, number>>> = {
    "copper": {
      "60": {
        "14": 15, "12": 20, "10": 30, "8": 40, "6": 55, "4": 70, "3": 85, "2": 95,
        "1": 110, "1/0": 125, "2/0": 145, "3/0": 165, "4/0": 195, "250": 215,
        "300": 240, "350": 260, "400": 280, "500": 320, "600": 355, "700": 385,
        "750": 400, "800": 410, "900": 435, "1000": 455
      },
      "75": {
        "14": 20, "12": 25, "10": 35, "8": 50, "6": 65, "4": 85, "3": 100, "2": 115,
        "1": 130, "1/0": 150, "2/0": 175, "3/0": 200, "4/0": 230, "250": 255,
        "300": 285, "350": 310, "400": 335, "500": 380, "600": 420, "700": 460,
        "750": 475, "800": 490, "900": 520, "1000": 545
      },
      "90": {
        "14": 25, "12": 30, "10": 40, "8": 55, "6": 75, "4": 95, "3": 115, "2": 130,
        "1": 145, "1/0": 170, "2/0": 195, "3/0": 225, "4/0": 260, "250": 290,
        "300": 320, "350": 350, "400": 380, "500": 430, "600": 475, "700": 520,
        "750": 535, "800": 555, "900": 585, "1000": 615
      }
    },
    "aluminum": {
      "60": {
        "12": 15, "10": 25, "8": 30, "6": 40, "4": 55, "3": 65, "2": 75,
        "1": 85, "1/0": 100, "2/0": 115, "3/0": 130, "4/0": 155, "250": 170,
        "300": 190, "350": 210, "400": 225, "500": 260, "600": 285, "700": 310,
        "750": 320, "800": 330, "900": 355, "1000": 375
      },
      "75": {
        "12": 20, "10": 30, "8": 40, "6": 50, "4": 65, "3": 75, "2": 90,
        "1": 100, "1/0": 120, "2/0": 135, "3/0": 155, "4/0": 180, "250": 205,
        "300": 230, "350": 250, "400": 270, "500": 310, "600": 340, "700": 375,
        "750": 385, "800": 395, "900": 425, "1000": 445
      },
      "90": {
        "12": 25, "10": 35, "8": 45, "6": 55, "4": 75, "3": 85, "2": 100,
        "1": 115, "1/0": 135, "2/0": 150, "3/0": 175, "4/0": 205, "250": 230,
        "300": 255, "350": 280, "400": 305, "500": 350, "600": 385, "700": 420,
        "750": 435, "800": 450, "900": 480, "1000": 500
      }
    }
  };

  // Calculate the adjusted current based on correction factors
  const calculateAdjustedCurrent = () => {
    if (!current) return;

    const designCurrent = parseFloat(current);

    // Get temperature correction factor
    let tempFactor = 1.0;
    const tempTable = temperatureCorrectionFactors[temperature];
    if (tempTable) {
      // Find closest ambient temperature in the table
      const temps = Object.keys(tempTable).map(Number).sort((a, b) => a - b);
      const ambientTempValue = parseFloat(ambientTemp);

      // Find closest temperature in the table
      let closestTemp = temps[0];
      for (const temp of temps) {
        if (Math.abs(temp - ambientTempValue) < Math.abs(closestTemp - ambientTempValue)) {
          closestTemp = temp;
        }
      }
      tempFactor = tempTable[closestTemp.toString()];
    }

    // Get conductor count adjustment factor
    let countFactor = 1.0;

    // Only apply conductor count adjustment for conduit installations with more than 3 conductors
    if (installationType === "conduit" && parseInt(conductorCount) > 3) {
      const count = parseInt(conductorCount);

      if (count <= 40) {
        countFactor = conductorCountFactors[conductorCount];
      } else {
        countFactor = conductorCountFactors["41+"];
      }
    }

    // For tray installations, use 0.95 for all cases with more than 3 conductors
    if (installationType === "tray" && parseInt(conductorCount) > 3) {
      countFactor = 0.95;
    }

    // Calculate the adjusted current
    const adjusted = designCurrent / (tempFactor * countFactor);
    setAdjustedCurrent(adjusted.toFixed(2));

    return adjusted;
  };

  const calculateCableSize = () => {
    if (!current) return;

    // Calculate adjusted current with correction factors
    const adjustedCurrentValue = calculateAdjustedCurrent() || parseFloat(current);

    // Get the appropriate ampacity table based on conductor material and temperature rating
    const ampacityValues = ampacityTable[conductorMaterial][temperature];

    if (!ampacityValues) {
      setCableSize("Invalid temperature rating");
      return;
    }

    // Find the smallest cable size that can handle the adjusted current
    const cableSizes = Object.keys(ampacityValues);
    let selectedSize = cableSizes[0];
    let selectedAmpacity = 0;

    for (const size of cableSizes) {
      const ampacity = ampacityValues[size];
      if (ampacity >= adjustedCurrentValue) {
        selectedSize = size;
        selectedAmpacity = ampacity;
        break;
      }
    }

    // Calculate the derated ampacity for the selected cable
    const tempFactor = temperatureCorrectionFactors[temperature][ambientTemp] || 1.0;
    let countFactor = 1.0;

    if (installationType === "conduit" && parseInt(conductorCount) > 3) {
      if (parseInt(conductorCount) <= 40) {
        countFactor = conductorCountFactors[conductorCount];
      } else {
        countFactor = conductorCountFactors["41+"];
      }
    } else if (installationType === "tray" && parseInt(conductorCount) > 3) {
      countFactor = 0.95;
    }

    const deratedValue = selectedAmpacity * tempFactor * countFactor;
    setDeratedAmpacity(parseFloat(deratedValue.toFixed(2)));

    setCableSize(selectedSize);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {content[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="design-current">
                {content[language].designCurrent}
              </Label>
              <Input
                id="design-current"
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="25"
              />
            </div>

            <div>
              <Label htmlFor="conductor-material">
                {content[language].conductorMaterial}
              </Label>
              <Select value={conductorMaterial} onValueChange={setConductorMaterial}>
                <SelectTrigger id="conductor-material">
                  <SelectValue placeholder={language === "es" ? "Seleccionar material" : "Select material"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copper">{content[language].copper}</SelectItem>
                  <SelectItem value="aluminum">{content[language].aluminum}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="temperature-rating">
                {content[language].temperatureRating}
              </Label>
              <Select value={temperature} onValueChange={setTemperature}>
                <SelectTrigger id="temperature-rating">
                  <SelectValue placeholder={language === "es" ? "Seleccionar temperatura" : "Select temperature"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60°C</SelectItem>
                  <SelectItem value="75">75°C</SelectItem>
                  <SelectItem value="90">90°C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ambient-temperature">
                {content[language].ambientTemperature}
              </Label>
              <Select value={ambientTemp} onValueChange={setAmbientTemp}>
                <SelectTrigger id="ambient-temperature">
                  <SelectValue placeholder={language === "es" ? "Seleccionar temperatura ambiente" : "Select ambient temperature"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10°C</SelectItem>
                  <SelectItem value="15">15°C</SelectItem>
                  <SelectItem value="20">20°C</SelectItem>
                  <SelectItem value="25">25°C</SelectItem>
                  <SelectItem value="30">30°C</SelectItem>
                  <SelectItem value="35">35°C</SelectItem>
                  <SelectItem value="40">40°C</SelectItem>
                  <SelectItem value="45">45°C</SelectItem>
                  <SelectItem value="50">50°C</SelectItem>
                  {temperature === "75" && <SelectItem value="55">55°C</SelectItem>}
                  {temperature === "90" && (
                    <>
                      <SelectItem value="55">55°C</SelectItem>
                      <SelectItem value="60">60°C</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="installation-type">
                {content[language].installationType}
              </Label>
              <Select value={installationType} onValueChange={setInstallationType}>
                <SelectTrigger id="installation-type">
                  <SelectValue placeholder={language === "es" ? "Seleccionar instalación" : "Select installation"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conduit">{content[language].inConduit}</SelectItem>
                  <SelectItem value="tray">{content[language].inTray}</SelectItem>
                  <SelectItem value="buried">{content[language].directBuried}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="conductor-count">
                {content[language].conductorCount}
              </Label>
              <Input
                id="conductor-count"
                type="number"
                min="1"
                value={conductorCount}
                onChange={(e) => setConductorCount(e.target.value)}
                placeholder="3"
              />
            </div>

            <div>
              <Label htmlFor="grouping-factor">
                {content[language].groupingFactor}
              </Label>
              <Input
                id="grouping-factor"
                type="text"
                value={installationType === "conduit" && parseInt(conductorCount) > 3
                  ? (parseInt(conductorCount) <= 40
                    ? conductorCountFactors[conductorCount]
                    : conductorCountFactors["41+"]).toString()
                  : installationType === "tray" && parseInt(conductorCount) > 3
                    ? "0.95"
                    : "1.00"
                }
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div>
              <Label htmlFor="adjusted-current">
                {content[language].adjustedCurrent}
              </Label>
              <Input
                id="adjusted-current"
                type="text"
                value={adjustedCurrent}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>


          </div>

        </div>
        <div className="pt-4 w-full">
          <Button onClick={calculateCableSize} className="w-full">
            {content[language].calculateCableSize}
          </Button>
        </div>
        {cableSize && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="font-semibold mb-2">
              {content[language].result}
            </h3>
            <p className="mb-2">
              {language === "es"
                ? `Tamaño de cable recomendado: ${cableSize} AWG`
                : `Recommended cable size: ${cableSize} AWG`}
            </p>
            {deratedAmpacity && (
              <p>
                {language === "es"
                  ? `Capacidad de corriente después de factores: ${deratedAmpacity} A`
                  : `Ampacity after derating factors: ${deratedAmpacity} A`}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 