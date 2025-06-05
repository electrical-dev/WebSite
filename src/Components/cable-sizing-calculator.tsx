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
      designCurrent: "Corriente de Diseño (A) *",
      conductorMaterial: "Material del Conductor",
      copper: "Cobre",
      aluminum: "Aluminio",
      temperatureRating: "Temperatura Nominal (°C)",
      temperatureCorrection: "Corrección por Temperatura",
      temperatureCorrectionFactor: "Factor de Corrección por Temperatura",
      ambientTemperature: "Temperatura Ambiente (°C)",
      installationType: "Tipo de Instalación",
      airGrouped: "Agrupados en aire/superficie/empotrados",
      singleLayerWall: "Capa única sobre pared/bandejas sin perforar",
      singleLayerCeiling: "Capa única bajo techo de madera",
      perforatedTray: "Capa única sobre bandejas perforadas",
      ladderTray: "Capa única sobre bandejas de escalera/bridas",
      inConduit: "En Tubería (NEC)",
      directBuried: "Enterrado Directo",
      circuitCount: "Cantidad de Circuitos/Cables *",
      groupingFactor: "Factor de Agrupamiento",
      additionalFactor: "Factor Adicional (Manual)",
      adjustedCurrent: "Corriente Ajustada (A)",
      calculateCableSize: "Calcular Tamaño de Cable",
      result: "Resultado:",
      recommendedCableSize: "Tamaño de cable recomendado:",
      ampacityDerating: "Capacidad de corriente después de factores:",
      appliedStandards: "Normas y Factores Aplicados:",
      temperatureFactor: "Factor de corrección por temperatura:",
      groupingFactorApplied: "Factor de agrupamiento aplicado:",
      additionalFactorApplied: "Factor adicional aplicado:",
      requiredField: "Campo obligatorio",
      invalidCurrent: "La corriente debe ser mayor a 0",
      invalidCircuitCount: "La cantidad de circuitos debe ser mayor a 0",
      invalidAdditionalFactor: "El factor adicional debe estar entre 0.1 y 1.0",
      additionalFactorHelp: "Rango válido: 0.1 - 1.0"
    },
    en: {
      title: "Cable Sizing",
      designCurrent: "Design Current (A) *",
      conductorMaterial: "Conductor Material",
      copper: "Copper",
      aluminum: "Aluminum",
      temperatureRating: "Temperature Rating (°C)",
      temperatureCorrection: "Temperature Correction",
      temperatureCorrectionFactor: "Temperature Correction Factor",
      ambientTemperature: "Ambient Temperature (°C)",
      installationType: "Installation Type",
      airGrouped: "Grouped in air/surface/embedded",
      singleLayerWall: "Single layer on wall/non-perforated trays",
      singleLayerCeiling: "Single layer under wooden ceiling",
      perforatedTray: "Single layer on perforated trays",
      ladderTray: "Single layer on ladder trays/cable ties",
      inConduit: "In Conduit (NEC)",
      directBuried: "Direct Buried",
      circuitCount: "Number of Circuits/Cables *",
      groupingFactor: "Grouping Factor",
      additionalFactor: "Additional Factor (Manual)",
      adjustedCurrent: "Adjusted Current (A)",
      calculateCableSize: "Calculate Cable Size",
      result: "Result:",
      recommendedCableSize: "Recommended cable size:",
      ampacityDerating: "Ampacity after derating factors:",
      appliedStandards: "Applied Standards and Factors:",
      temperatureFactor: "Temperature correction factor:",
      groupingFactorApplied: "Grouping factor applied:",
      additionalFactorApplied: "Additional factor applied:",
      requiredField: "Required field",
      invalidCurrent: "Current must be greater than 0",
      invalidCircuitCount: "Circuit count must be greater than 0",
      invalidAdditionalFactor: "Additional factor must be between 0.1 and 1.0",
      additionalFactorHelp: "Valid range: 0.1 - 1.0"
    }
  };

  const [current, setCurrent] = useState("");
  const [temperature, setTemperature] = useState("75");
  const [ambientTemp, setAmbientTemp] = useState("30");
  const [installationType, setInstallationType] = useState("conduit");
  const [cableSize, setCableSize] = useState("");
  const [conductorMaterial, setConductorMaterial] = useState("copper");
  const [circuitCount, setCircuitCount] = useState("3");
  const [additionalFactor, setAdditionalFactor] = useState("1.00");
  const [adjustedCurrent, setAdjustedCurrent] = useState("");
  const [deratedAmpacity, setDeratedAmpacity] = useState<number | null>(null);
  const [appliedFactors, setAppliedFactors] = useState<{
    temperature: number;
    grouping: number;
    additional: number;
    standard: string;
  } | null>(null);

  // Validation states
  const [errors, setErrors] = useState<{
    current?: string;
    circuitCount?: string;
    additionalFactor?: string;
  }>({});

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

  // IEC 60364-5-52 Table B.52.17 - Grouping factors for different installation methods
  const iecGroupingFactors: Record<string, Record<string, number>> = {
    // Agrupados en el aire, sobre una superficie, empotrados o en el interior de una envolvente
    "airGrouped": {
      "1": 1.00, "2": 0.80, "3": 0.70, "4": 0.65, "5": 0.60, "6": 0.57, "7": 0.54, 
      "8": 0.52, "9": 0.50, "12": 0.45, "16": 0.41, "20": 0.38
    },
    // Capa única sobre pared, suelo o sistemas de bandejas de cables sin perforar
    "singleLayerWall": {
      "1": 1.00, "2": 0.85, "3": 0.79, "4": 0.75, "5": 0.73, "6": 0.72, "7": 0.72, 
      "8": 0.71, "9": 0.70
    },
    // Capa única fijada directamente bajo techo de madera
    "singleLayerCeiling": {
      "1": 0.95, "2": 0.81, "3": 0.72, "4": 0.68, "5": 0.66, "6": 0.64, "7": 0.63, 
      "8": 0.62, "9": 0.61
    },
    // Capa única sobre sistemas de bandejas perforadas horizontales o verticales
    "perforatedTray": {
      "1": 1.00, "2": 0.88, "3": 0.82, "4": 0.77, "5": 0.75, "6": 0.73, "7": 0.73, 
      "8": 0.72, "9": 0.72
    },
    // Capa única sobre sistemas de bandejas de escalera, o bridas de amarre, etc.
    "ladderTray": {
      "1": 1.00, "2": 0.87, "3": 0.82, "4": 0.80, "5": 0.80, "6": 0.79, "7": 0.79, 
      "8": 0.78, "9": 0.78
    }
  };

  // NEC Conductor count adjustment factors (for conduit installations)
  const necConductorCountFactors: Record<string, number> = {
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

  // Validation functions
  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate current
    const currentValue = parseFloat(current);
    if (!current) {
      newErrors.current = content[language].requiredField;
    } else if (isNaN(currentValue) || currentValue <= 0) {
      newErrors.current = content[language].invalidCurrent;
    }

    // Validate circuit count
    const circuitCountValue = parseInt(circuitCount);
    if (!circuitCount) {
      newErrors.circuitCount = content[language].requiredField;
    } else if (isNaN(circuitCountValue) || circuitCountValue <= 0) {
      newErrors.circuitCount = content[language].invalidCircuitCount;
    }

    // Validate additional factor
    const additionalFactorValue = parseFloat(additionalFactor);
    if (additionalFactor && (!isNaN(additionalFactorValue))) {
      if (additionalFactorValue < 0.1 || additionalFactorValue > 1.0) {
        newErrors.additionalFactor = content[language].invalidAdditionalFactor;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get grouping factor based on installation type and circuit count
  const getGroupingFactor = (): { factor: number; standard: string } => {
    const count = parseInt(circuitCount);

    if (installationType === "conduit") {
      // Use NEC factors for conduit installations
      if (count <= 3) {
        return { factor: 1.0, standard: "NEC Table 310.15(B)(3)(a)" };
      } else if (count <= 40) {
        return { factor: necConductorCountFactors[circuitCount], standard: "NEC Table 310.15(B)(3)(a)" };
      } else {
        return { factor: necConductorCountFactors["41+"], standard: "NEC Table 310.15(B)(3)(a)" };
      }
    } else if (installationType === "buried") {
      // No grouping factor for direct buried
      return { factor: 1.0, standard: "No agrupamiento aplicable" };
    } else {
      // Use IEC factors for other installation types
      const factors = iecGroupingFactors[installationType];
      if (!factors) return { factor: 1.0, standard: "IEC 60364-5-52 Tabla B.52.17" };

      // Find the appropriate factor
      let selectedFactor = 1.0;
      const availableCounts = Object.keys(factors).map(Number).sort((a, b) => a - b);

      // For counts higher than available, use the last available factor
      if (count <= Math.max(...availableCounts)) {
        // Find exact match or closest lower value
        for (let i = availableCounts.length - 1; i >= 0; i--) {
          if (count >= availableCounts[i]) {
            selectedFactor = factors[availableCounts[i].toString()];
            break;
          }
        }
      } else {
        // Use the factor for the highest available count
        selectedFactor = factors[Math.max(...availableCounts).toString()];
      }

      return { factor: selectedFactor, standard: "IEC 60364-5-52 Tabla B.52.17" };
    }
  };

  // Function to get temperature correction factor
  const getTemperatureCorrectionFactor = (): number => {
    const tempTable = temperatureCorrectionFactors[temperature];
    if (!tempTable) return 1.0;

    const temps = Object.keys(tempTable).map(Number).sort((a, b) => a - b);
    const ambientTempValue = parseFloat(ambientTemp);
    let closestTemp = temps[0];

    for (const temp of temps) {
      if (Math.abs(temp - ambientTempValue) < Math.abs(closestTemp - ambientTempValue)) {
        closestTemp = temp;
      }
    }

    return tempTable[closestTemp.toString()] || 1.0;
  };

  // Calculate the adjusted current based on correction factors
  const calculateAdjustedCurrent = () => {
    if (!current) return;

    const designCurrent = parseFloat(current);

    // Get temperature correction factor
    let tempFactor = 1.0;
    const tempTable = temperatureCorrectionFactors[temperature];
    if (tempTable) {
      const temps = Object.keys(tempTable).map(Number).sort((a, b) => a - b);
      const ambientTempValue = parseFloat(ambientTemp);
      let closestTemp = temps[0];
      for (const temp of temps) {
        if (Math.abs(temp - ambientTempValue) < Math.abs(closestTemp - ambientTempValue)) {
          closestTemp = temp;
        }
      }
      tempFactor = tempTable[closestTemp.toString()];
    }

    // Get grouping factor
    const { factor: groupingFactor, standard } = getGroupingFactor();

    // Get additional factor
    const additionalFactorValue = parseFloat(additionalFactor) || 1.0;

    // Store applied factors for display
    setAppliedFactors({
      temperature: tempFactor,
      grouping: groupingFactor,
      additional: additionalFactorValue,
      standard: standard
    });

    // Calculate the adjusted current
    const adjusted = designCurrent / (tempFactor * groupingFactor * additionalFactorValue);
    setAdjustedCurrent(adjusted.toFixed(2));

    return adjusted;
  };

  const calculateCableSize = () => {
    // Validate inputs first
    if (!validateInputs()) {
      return;
    }

    // Calculate adjusted current with correction factors
    const adjustedCurrentValue = calculateAdjustedCurrent() || parseFloat(current);

    // Get the appropriate ampacity table based on conductor material and temperature rating
    const ampacityValues = ampacityTable[conductorMaterial][temperature];

    if (!ampacityValues) {
      setCableSize("Invalid temperature rating");
      return;
    }

    // Define the correct order of cable sizes from smallest to largest
    const cableSizeOrder = [
      "14", "12", "10", "8", "6", "4", "3", "2", "1",
      "1/0", "2/0", "3/0", "4/0", 
      "250", "300", "350", "400", "500", "600", "700", "750", "800", "900", "1000"
    ];

    // Find the smallest cable size that can handle the adjusted current
    let selectedSize = cableSizeOrder[0];
    let selectedAmpacity = 0;

    for (const size of cableSizeOrder) {
      const ampacity = ampacityValues[size];
      if (ampacity && ampacity >= adjustedCurrentValue) {
        selectedSize = size;
        selectedAmpacity = ampacity;
        break;
      }
    }

    // Calculate the derated ampacity for the selected cable
    const factors = appliedFactors || {
      temperature: 1.0,
      grouping: 1.0,
      additional: 1.0,
      standard: ""
    };

    const deratedValue = selectedAmpacity * factors.temperature * factors.grouping * factors.additional;
    setDeratedAmpacity(parseFloat(deratedValue.toFixed(2)));

    setCableSize(selectedSize);
  };

  // Function to format cable size with correct units
  const formatCableSize = (size: string): string => {
    // Check if the size is a number (250 and above are KCMIL)
    const numericSize = parseInt(size);
    if (!isNaN(numericSize) && numericSize >= 250) {
      return `${size} KCMIL`;
    } else {
      return `${size} AWG`;
    }
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
          <div className="space-y-1">
            <div>
              <Label htmlFor="design-current" className="flex items-center">
                {content[language].designCurrent}
                <span className="text-red-500 ml-1">*</span>
                <div className="min-h-[1.25rem] mt-1">
                  {errors.current && (
                    <p className="text-red-500 text-xs">{errors.current}</p>
                  )}
                </div>
              </Label>
              <Input
                id="design-current"
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
                placeholder="25"
                className={errors.current ? "border-red-500" : ""}
              />
              <div className="min-h-[1.25rem]"></div>
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
              <div className="min-h-[1.25rem]"></div>
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
              <div className="min-h-[1.25rem]"></div>
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
              <div className="min-h-[1.25rem]"></div>
            </div>

            <div>
              <Label htmlFor="temperature-correction-factor">
                {content[language].temperatureCorrectionFactor}
              </Label>
              <Input
                id="temperature-correction-factor"
                type="text"
                value={getTemperatureCorrectionFactor().toFixed(2)}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
              <div className="min-h-[1.25rem]"></div>
            </div>
          </div>

          <div className="space-y-1">
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
                  <SelectItem value="airGrouped">{content[language].airGrouped}</SelectItem>
                  <SelectItem value="singleLayerWall">{content[language].singleLayerWall}</SelectItem>
                  <SelectItem value="singleLayerCeiling">{content[language].singleLayerCeiling}</SelectItem>
                  <SelectItem value="perforatedTray">{content[language].perforatedTray}</SelectItem>
                  <SelectItem value="ladderTray">{content[language].ladderTray}</SelectItem>
                  <SelectItem value="buried">{content[language].directBuried}</SelectItem>
                </SelectContent>
              </Select>
              <div className="min-h-[1.25rem]"></div>
            </div>

            <div>
              <Label htmlFor="circuit-count" className="flex items-center">
                {content[language].circuitCount}
                <span className="text-red-500 ml-1">*</span>
                <div className="min-h-[1.25rem] mt-1">
                  {errors.circuitCount && (
                    <p className="text-red-500 text-xs">{errors.circuitCount}</p>
                  )}
                </div>
              </Label>
              <Input
                id="circuit-count"
                type="number"
                min="1"
                value={circuitCount}
                onChange={(e) => {
                  setCircuitCount(e.target.value);
                  if (errors.circuitCount) {
                    setErrors(prev => ({ ...prev, circuitCount: undefined }));
                  }
                }}
                placeholder="3"
                className={errors.circuitCount ? "border-red-500" : ""}
              />
              <div className="min-h-[1.25rem]"></div>
            </div>

            <div>
              <Label htmlFor="grouping-factor">
                {content[language].groupingFactor}
              </Label>
              <Input
                id="grouping-factor"
                type="text"
                value={getGroupingFactor().factor.toString()}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
              <div className="min-h-[1.25rem]"></div>
            </div>

            <div>
              <Label htmlFor="additional-factor" className="flex items-center">
                {content[language].additionalFactor}
                <div className="min-h-[1.25rem] mt-1">
                  {errors.additionalFactor && (
                    <p className="text-red-500 text-xs">{errors.additionalFactor}</p>
                  )}
                </div>
              </Label>
              <Input
                id="additional-factor"
                type="number"
                step="0.01"
                min="0.1"
                max="1.0"
                value={additionalFactor}
                onChange={(e) => {
                  setAdditionalFactor(e.target.value);
                  if (errors.additionalFactor) {
                    setErrors(prev => ({ ...prev, additionalFactor: undefined }));
                  }
                }}
                placeholder="1.00"
                className={errors.additionalFactor ? "border-red-500" : ""}
              />
              <p className="text-gray-500 text-xs mt-1">{content[language].additionalFactorHelp}</p>
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
              <div className="min-h-[1.25rem]"></div>
            </div>
          </div>
        </div>

        <div className="pt-4 w-full">
          <Button onClick={calculateCableSize} className="w-full">
            {content[language].calculateCableSize}
          </Button>
        </div>

        {cableSize && appliedFactors && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="font-semibold mb-2">
              {content[language].result}
            </h3>
            <p className="mb-2">
              {language === "es"
                ? `Tamaño de cable recomendado: ${formatCableSize(cableSize)}`
                : `Recommended cable size: ${formatCableSize(cableSize)}`}
            </p>
            {deratedAmpacity && (
              <p className="mb-4">
                {language === "es"
                  ? `Capacidad de corriente después de factores: ${deratedAmpacity} A`
                  : `Ampacity after derating factors: ${deratedAmpacity} A`}
              </p>
            )}

            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium mb-2">{content[language].appliedStandards}</h4>
              <div className="text-sm space-y-1">
                <p>• {content[language].temperatureFactor} {appliedFactors.temperature}</p>
                <p>• {content[language].groupingFactorApplied} {appliedFactors.grouping} ({appliedFactors.standard})</p>
                <p>• {content[language].additionalFactorApplied} {appliedFactors.additional}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 