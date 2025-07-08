import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";

type SupportedLanguage = "en" | "es";

export function ConduitSizing({ language }: { language: SupportedLanguage }) {
  const content = {
    es: {
      title: "Dimensionamiento de Ductería",
      conduitType: "Tipo de Tubería",
      cablesHeader: "Cables a instalar",
      cableSize: "Calibre",
      quantity: "Cantidad",
      diameter: "Diámetro (mm)",
      addCable: "Añadir cable",
      calculateSize: "Calcular Tamaño de Tubería",
      result: "Resultado:",
      smallerSize: "Tamaño menor:",
      recommendedSize: "Tamaño recomendado:",
      largerSize: "Tamaño mayor:",
      occupationPercentage: "Porcentaje de ocupación:",
      tooSmall: "Muy pequeño",
      optimal: "Óptimo",
      oversized: "Sobredimensionado",
      summaryTitle: "Resumen de Cálculo",
      cablesUsed: "Cables Utilizados:",
      recommendedConduitDiameter: "Diámetro de Tubería Recomendado:",
      totalCableArea: "Área Total de Cables:",
      conduitArea: "Área de Tubería:",
    },
    en: {
      title: "Conduit Sizing",
      conduitType: "Conduit Type",
      cablesHeader: "Cables to Install",
      cableSize: "Size",
      quantity: "Quantity",
      diameter: "Diameter (mm)",
      addCable: "Add Cable",
      calculateSize: "Calculate Conduit Size",
      result: "Result:",
      smallerSize: "Smaller size:",
      recommendedSize: "Recommended size:",
      largerSize: "Larger size:",
      occupationPercentage: "Occupation percentage:",
      tooSmall: "Too small",
      optimal: "Optimal",
      oversized: "Oversized",
      summaryTitle: "Calculation Summary",
      cablesUsed: "Cables Used:",
      recommendedConduitDiameter: "Recommended Conduit Diameter:",
      totalCableArea: "Total Cable Area:",
      conduitArea: "Conduit Area:",
    }
  };

  // Default cable diameter mappings (converted to mm)
  const defaultCableDiameters: Record<string, number> = {
    "14": 2.82,  // 0.111" in mm
    "12": 3.30,  // 0.130" in mm
    "10": 4.17,  // 0.164" in mm
    "8": 5.49,   // 0.216" in mm
    "6": 6.65,   // 0.262" in mm
    "4": 8.23,   // 0.324" in mm
    "2": 10.31,  // 0.406" in mm
    "1": 12.34,  // 0.486" in mm
    "1/0": 13.51, // 0.532" in mm
    "2/0": 14.83, // 0.584" in mm
    "4/0": 17.48, // 0.688" in mm
    "250": 19.61, // 0.772" in mm
    "300": 21.23, // 0.836" in mm
    "350": 22.91, // 0.902" in mm
    "400": 24.49, // 0.964" in mm
    "500": 27.18  // 1.070" in mm
  };

  // Conduit types with internal areas in mm²
  const conduitSizes: Record<string, Record<string, number>> = {
    imc: {
      "1/2": 16.10 * 16.10 * Math.PI / 4,   // Using ID = external - (2 * wall thickness)
      "3/4": 21.70 * 21.70 * Math.PI / 4,
      "1": 27.81 * 27.81 * Math.PI / 4,
      "1-1/4": 36.46 * 36.46 * Math.PI / 4,
      "1-1/2": 42.42 * 42.42 * Math.PI / 4,
      "2": 54.28 * 54.28 * Math.PI / 4,
      "2-1/2": 64.70 * 64.70 * Math.PI / 4,
      "3": 80.42 * 80.42 * Math.PI / 4,
      "3-1/2": 92.96 * 92.96 * Math.PI / 4,
      "4": 105.57 * 105.57 * Math.PI / 4
    },
    pvc: {
      "1/2": 15.80 * 15.80 * Math.PI / 4,   // Slightly different internal diameters for PVC
      "3/4": 20.93 * 20.93 * Math.PI / 4,
      "1": 26.64 * 26.64 * Math.PI / 4,
      "1-1/4": 35.05 * 35.05 * Math.PI / 4,
      "1-1/2": 40.89 * 40.89 * Math.PI / 4,
      "2": 52.50 * 52.50 * Math.PI / 4,
      "2-1/2": 62.71 * 62.71 * Math.PI / 4,
      "3": 77.92 * 77.92 * Math.PI / 4,
      "3-1/2": 90.12 * 90.12 * Math.PI / 4,
      "4": 102.26 * 102.26 * Math.PI / 4
    },
    emt: {
      "1/2": 15.99 * 15.99 * Math.PI / 4,   // EMT has thinner walls
      "3/4": 21.22 * 21.22 * Math.PI / 4,
      "1": 27.00 * 27.00 * Math.PI / 4,
      "1-1/4": 35.76 * 35.76 * Math.PI / 4,
      "1-1/2": 41.16 * 41.16 * Math.PI / 4,
      "2": 53.34 * 53.34 * Math.PI / 4,
      "2-1/2": 63.50 * 63.50 * Math.PI / 4,
      "3": 78.99 * 78.99 * Math.PI / 4,
      "3-1/2": 91.44 * 91.44 * Math.PI / 4,
      "4": 103.89 * 103.89 * Math.PI / 4
    }
  };

  // Interior diameters in mm for visualization
  const conduitInteriorDiameters: Record<string, Record<string, number>> = {
    imc: {
      "1/2": 16.10,
      "3/4": 21.70,
      "1": 27.81,
      "1-1/4": 36.46,
      "1-1/2": 42.42,
      "2": 54.28,
      "2-1/2": 64.70,
      "3": 80.42,
      "3-1/2": 92.96,
      "4": 105.57
    },
    pvc: {
      "1/2": 15.80,
      "3/4": 20.93,
      "1": 26.64,
      "1-1/4": 35.05,
      "1-1/2": 40.89,
      "2": 52.50,
      "2-1/2": 62.71,
      "3": 77.92,
      "3-1/2": 90.12,
      "4": 102.26
    },
    emt: {
      "1/2": 15.99,
      "3/4": 21.22,
      "1": 27.00,
      "1-1/4": 35.76,
      "1-1/2": 41.16,
      "2": 53.34,
      "2-1/2": 63.50,
      "3": 78.99,
      "3-1/2": 91.44,
      "4": 103.89
    }
  };

  const [conduitType, setConduitType] = useState("imc");
  const [cableTypes, setCableTypes] = useState([
    { size: "12", quantity: 3, diameter: defaultCableDiameters["12"] }
  ]);
  const [result, setResult] = useState("");
  const [visualization, setVisualization] = useState(false);
  const [sizingResults, setSizingResults] = useState<{
    smaller: { size: string; percentage: number } | null;
    recommended: { size: string; percentage: number; diameterMM: number; totalCableAreaMM2?: number; conduitAreaMM2?: number; } | null;
    larger: { size: string; percentage: number } | null;
  }>({
    smaller: null,
    recommended: null,
    larger: null
  });

  // Canvas reference for drawing
  const canvasRefs = {
    smaller: useRef<HTMLCanvasElement>(null),
    recommended: useRef<HTMLCanvasElement>(null),
    larger: useRef<HTMLCanvasElement>(null)
  };

  const updateCableQuantity = (index: number, value: string) => {
    const updatedCables = [...cableTypes];
    updatedCables[index].quantity = parseInt(value) || 0;
    setCableTypes(updatedCables);
  };

  const updateCableDiameter = (index: number, value: string) => {
    const updatedCables = [...cableTypes];
    updatedCables[index].diameter = parseFloat(value) || 0;
    setCableTypes(updatedCables);
  };

  const updateCableSize = (index: number, value: string) => {
    const updatedCables = [...cableTypes];
    updatedCables[index].size = value;
    updatedCables[index].diameter = defaultCableDiameters[value] || 3.30;
    setCableTypes(updatedCables);
  };

  const calculateConduitSize = () => {
    // Calculate total area needed based on cable diameters
    let totalArea = 0;
    const activeCables = cableTypes.filter(c => c.quantity > 0); // Consider only cables with quantity > 0
    for (const cable of activeCables) {
      // Calculate area from diameter: area = π * (d/2)²
      const radius = cable.diameter / 2;
      const area = Math.PI * radius * radius;
      totalArea += area * cable.quantity;
    }

    // Define conduit sizes in explicit order to ensure correct sequence
    const conduitSizeOrder = [
      "1/2", "3/4", "1", "1-1/4", "1-1/2", "2", "2-1/2", "3", "3-1/2", "4"
    ];

    // Find the appropriate conduit size (40% fill max)
    let recommendedSizeIndex = -1;

    for (let i = 0; i < conduitSizeOrder.length; i++) {
      const size = conduitSizeOrder[i];
      if (totalArea <= conduitSizes[conduitType][size] * 0.4) {
        recommendedSizeIndex = i;
        break;
      }
    }

    // Prepare results for recommended, smaller and larger sizes
    const results = {
      smaller: null as { size: string; percentage: number } | null,
      recommended: null as { size: string; percentage: number; diameterMM: number; totalCableAreaMM2?: number; conduitAreaMM2?: number; } | null,
      larger: null as { size: string; percentage: number } | null
    };

    if (recommendedSizeIndex >= 0) {
      // Recommended size
      const recommendedSize = conduitSizeOrder[recommendedSizeIndex];
      const recommendedPercentage = (totalArea / conduitSizes[conduitType][recommendedSize]) * 100;
      const recommendedDiameterMM = conduitInteriorDiameters[conduitType][recommendedSize];
      const recommendedConduitArea = conduitSizes[conduitType][recommendedSize];

      results.recommended = {
        size: recommendedSize,
        percentage: parseFloat(recommendedPercentage.toFixed(1)),
        diameterMM: recommendedDiameterMM,
        totalCableAreaMM2: totalArea,
        conduitAreaMM2: recommendedConduitArea
      };

      // Smaller size (if available)
      if (recommendedSizeIndex > 0) {
        const smallerSize = conduitSizeOrder[recommendedSizeIndex - 1];
        const smallerPercentage = (totalArea / conduitSizes[conduitType][smallerSize]) * 100;
        results.smaller = {
          size: smallerSize,
          percentage: parseFloat(smallerPercentage.toFixed(1))
        };
      }

      // Larger size (if available)
      if (recommendedSizeIndex < conduitSizeOrder.length - 1) {
        const largerSize = conduitSizeOrder[recommendedSizeIndex + 1];
        const largerPercentage = (totalArea / conduitSizes[conduitType][largerSize]) * 100;
        results.larger = {
          size: largerSize,
          percentage: parseFloat(largerPercentage.toFixed(1))
        };
      }

      // Store results for visualization
      setSizingResults(results);
      setVisualization(true);

      // Set main result
      setResult(
        language === "es"
          ? `Tubería ${conduitType.toUpperCase()} de ${recommendedSize}" recomendada (${recommendedPercentage.toFixed(1)}% ocupación)`
          : `${conduitType.toUpperCase()} conduit of ${recommendedSize}" recommended (${recommendedPercentage.toFixed(1)}% occupation)`
      );
    } else {
      setResult(
        language === "es"
          ? "La combinación de cables requiere una tubería mayor a 4\""
          : "The cable combination requires a conduit larger than 4\""
      );
      setVisualization(false);
    }
  };

  // Draw conduit visualization after results are available
  useEffect(() => {
    if (!visualization) return;

    // Draw function
    const drawConduit = (
      canvas: HTMLCanvasElement | null,
      conduitSize: string,
      fillPercentage: number
    ) => {
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const margin = 20;

      // Get conduit interior diameter in mm
      const conduitDiameter = conduitInteriorDiameters[conduitType][conduitSize] || 20;

      // Apply zoom factor
      const zoomFactor = 1.0;

      // Scale to fit canvas with the zoom factor
      const scale = (Math.min(canvas.width, canvas.height) - margin * 2) / conduitDiameter * zoomFactor;

      // Calculate scaled radius for this conduit
      const scaledRadius = (conduitDiameter / 2) * scale;

      // Draw conduit (outer circle)
      ctx.beginPath();
      ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Fill based on percentage
      const fillColor = fillPercentage > 40 ? '#ff6666' : '#66ff66';
      ctx.beginPath();
      ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Size label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${conduitSize}"`, centerX, centerY - scaledRadius - 8);

      // Percentage label
      /*  ctx.font = 'bold 18px Arial';
       ctx.fillText(`${fillPercentage}%`, centerX, centerY); */

      // Count total cables
      const totalCables = cableTypes.filter(c => c.quantity > 0).reduce((sum, c) => sum + c.quantity, 0);
      if (totalCables === 0) return;

      // Create an array of all cables to be drawn
      let allCables: number[] = [];
      cableTypes.filter(c => c.quantity > 0).forEach(cable => {
        for (let i = 0; i < cable.quantity; i++) {
          allCables.push(cable.diameter);
        }
      });

      // Limit to show max 20 cables (for performance/clarity)
      if (allCables.length > 20) {
        allCables = allCables.slice(0, 20);
      }

      // Arrays to track placed cables
      const placedCables: Array<{ x: number, y: number, radius: number }> = [];

      // Function to check if a new cable position overlaps with existing cables
      const checkOverlap = (x: number, y: number, radius: number) => {
        for (const cable of placedCables) {
          const distance = Math.sqrt(Math.pow(x - cable.x, 2) + Math.pow(y - cable.y, 2));
          if (distance < (radius + cable.radius + 2)) { // +2 for spacing
            return true; // overlap detected
          }
        }

        // Also check if cable is within conduit boundaries
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        if (distanceFromCenter + radius > scaledRadius) {
          return true; // outside conduit
        }

        return false; // no overlap
      };

      // Place cables using a modified spiral algorithm that prevents overlap
      allCables.forEach((cableDiameter, index) => {
        const cableRadius = (cableDiameter / 2) * scale * 0.7; // Slightly smaller for better spacing

        // Start from center and spiral outward
        let placed = false;
        let attempt = 0;
        let spiralAngle = 0;
        let spiralRadius = 0;

        while (!placed && attempt < 500) { // Limit attempts to prevent infinite loops
          // Calculate position using spiral equation
          spiralRadius = (attempt / 30) * scaledRadius * 0.7; // Gradually move outward
          spiralAngle = attempt * 0.5; // Adjust angle

          const x = centerX + spiralRadius * Math.cos(spiralAngle);
          const y = centerY + spiralRadius * Math.sin(spiralAngle);

          // Check if this position overlaps with existing cables
          if (!checkOverlap(x, y, cableRadius)) {
            // Place the cable here
            ctx.beginPath();
            ctx.arc(x, y, cableRadius, 0, Math.PI * 2);

            // Color based on cable size (use hue based on diameter)
            const hue = Math.min(cableDiameter * 10, 360);
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Add to placed cables list
            placedCables.push({ x, y, radius: cableRadius });
            placed = true;
          }

          attempt++;
        }
      });
    };

    // Draw each conduit visualization
    if (sizingResults.smaller) {
      drawConduit(
        canvasRefs.smaller.current,
        sizingResults.smaller.size,
        sizingResults.smaller.percentage
      );
    }

    if (sizingResults.recommended) {
      drawConduit(
        canvasRefs.recommended.current,
        sizingResults.recommended.size,
        sizingResults.recommended.percentage
      );
    }

    if (sizingResults.larger) {
      drawConduit(
        canvasRefs.larger.current,
        sizingResults.larger.size,
        sizingResults.larger.percentage
      );
    }
  }, [visualization, sizingResults, cableTypes, conduitType]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {content[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">
              {content[language].conduitType}
            </Label>
            <Select
              value={conduitType}
              onValueChange={setConduitType}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imc">IMC</SelectItem>
                <SelectItem value="pvc">PVC</SelectItem>
                <SelectItem value="emt">EMT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">
              {content[language].cablesHeader}
            </h3>

            {cableTypes.map((cable, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4 items-end">
                <div>
                  <Label>
                    {content[language].cableSize}
                  </Label>
                  <Select
                    value={cable.size}
                    onValueChange={(value) => updateCableSize(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14 AWG</SelectItem>
                      <SelectItem value="12">12 AWG</SelectItem>
                      <SelectItem value="10">10 AWG</SelectItem>
                      <SelectItem value="8">8 AWG</SelectItem>
                      <SelectItem value="6">6 AWG</SelectItem>
                      <SelectItem value="4">4 AWG</SelectItem>
                      <SelectItem value="2">2 AWG</SelectItem>
                      <SelectItem value="1">1 AWG</SelectItem>
                      <SelectItem value="1/0">1/0 AWG</SelectItem>
                      <SelectItem value="2/0">2/0 AWG</SelectItem>
                      <SelectItem value="4/0">4/0 AWG</SelectItem>
                      <SelectItem value="250">250 kcmil</SelectItem>
                      <SelectItem value="300">300 kcmil</SelectItem>
                      <SelectItem value="350">350 kcmil</SelectItem>
                      <SelectItem value="400">400 kcmil</SelectItem>
                      <SelectItem value="500">500 kcmil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>
                    {content[language].diameter}
                  </Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={cable.diameter}
                    onChange={(e) => updateCableDiameter(index, e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    {content[language].quantity}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={cable.quantity}
                    onChange={(e) => updateCableQuantity(index, e.target.value)}
                  />
                </div>

                {index === cableTypes.length - 1 && (
                  <div className="col-span-3">
                    <Button
                      variant="outline"
                      onClick={() => setCableTypes([...cableTypes, {
                        size: "12",
                        quantity: 0,
                        diameter: defaultCableDiameters["12"]
                      }])}
                      className="w-full"
                    >
                      {content[language].addCable}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button className="w-full" onClick={calculateConduitSize}>
            {content[language].calculateSize}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="font-semibold mb-2">
                {content[language].result}
              </h3>
              <p className="mb-4">{result}</p>

              {visualization && (
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sizingResults.smaller && (
                      <div className="text-center">
                        <p className="font-medium text-base mb-1">{content[language].smallerSize} {sizingResults.smaller.size}"</p>
                        <p className="text-sm mb-2">
                          {content[language].occupationPercentage}
                          <span className="text-red-500 font-bold ml-1">
                            {sizingResults.smaller.percentage}%
                          </span>
                          <span className="block text-red-500 text-xs">
                            ({content[language].tooSmall})
                          </span>
                        </p>
                        <div className="bg-white rounded-lg p-4 shadow border border-gray-300">
                          <canvas
                            ref={canvasRefs.smaller}
                            width={180}
                            height={180}
                            className="mx-auto"
                          ></canvas>
                        </div>
                      </div>
                    )}

                    {sizingResults.recommended && (
                      <div className="text-center">
                        <p className="font-medium text-base mb-1">{content[language].recommendedSize} {sizingResults.recommended.size}"</p>
                        <p className="text-sm mb-2">
                          {content[language].occupationPercentage}
                          <span className="text-green-500 font-bold ml-1">
                            {sizingResults.recommended.percentage}%
                          </span>
                          <span className="block text-green-500 text-xs">
                            ({content[language].optimal})
                          </span>
                        </p>
                        <div className="bg-white rounded-lg p-4 shadow border-2 border-green-500">
                          <canvas
                            ref={canvasRefs.recommended}
                            width={180}
                            height={180}
                            className="mx-auto"
                          ></canvas>
                        </div>
                      </div>
                    )}

                    {sizingResults.larger && (
                      <div className="text-center">
                        <p className="font-medium text-base mb-1">{content[language].largerSize} {sizingResults.larger.size}"</p>
                        <p className="text-sm mb-2">
                          {content[language].occupationPercentage}
                          <span className="text-blue-500 font-bold ml-1">
                            {sizingResults.larger.percentage}%
                          </span>
                          <span className="block text-blue-500 text-xs">
                            ({content[language].oversized})
                          </span>
                        </p>
                        <div className="bg-white rounded-lg p-4 shadow border border-gray-300">
                          <canvas
                            ref={canvasRefs.larger}
                            width={180}
                            height={180}
                            className="mx-auto"
                          ></canvas>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Calculation Summary Section */}
              {sizingResults.recommended && (
                <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
                  <h4 className="font-semibold mb-2 text-md">
                    {content[language].summaryTitle}
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>{content[language].cablesUsed}</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      {cableTypes.filter(cable => cable.quantity > 0).map((cable, idx) => (
                        <li key={`summary-cable-${idx}`}>
                          {cable.quantity} x {cable.size} AWG/kcmil ({cable.diameter.toFixed(2)} mm)
                        </li>
                      ))}
                    </ul>
                    {sizingResults.recommended.diameterMM && (
                      <p className="mt-2">
                        <strong>{content[language].recommendedConduitDiameter}</strong> {sizingResults.recommended.size}" ({sizingResults.recommended.diameterMM.toFixed(2)} mm)
                      </p>
                    )}
                    {sizingResults.recommended.totalCableAreaMM2 !== undefined && (
                      <p>
                        <strong>{content[language].totalCableArea}</strong> {sizingResults.recommended.totalCableAreaMM2.toFixed(2)} mm²
                      </p>
                    )}
                    {sizingResults.recommended.conduitAreaMM2 !== undefined && (
                      <p>
                        <strong>{content[language].conduitArea}</strong> {sizingResults.recommended.conduitAreaMM2.toFixed(2)} mm²
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
