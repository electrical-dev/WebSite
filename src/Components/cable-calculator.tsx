import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type SupportedLanguage = "en" | "es";

export function CableCalculator({ language }: { language: SupportedLanguage }) {
  const content = {
    es: {
      title: "Cálculo de Material para Cableado",
      circuitHeader: "Información de Circuitos",
      circuit: "Circuito",
      configuration: "Configuración",
      length: "Longitud (m)",
      description: "Descripción",
      wasteFactor: "Factor de Desperdicio (%)",
      addCircuit: "Añadir Circuito",
      calculate: "Calcular Material",
      configHelp: "Ejemplo: 3F#12+1N#12+1T#14",
      summary: "Resumen de Material",
      cableSize: "Calibre de Cable",
      totalLength: "Longitud Total (m)",
      inputTable: "Tabla de Circuitos",
      totalWithWaste: "Total con Desperdicio",
      totalWaste: "Desperdicio Total",
      grandTotal: "Total General"
    },
    en: {
      title: "Cable Material Calculation",
      circuitHeader: "Circuit Information",
      circuit: "Circuit",
      configuration: "Configuration",
      length: "Length (m)",
      description: "Description",
      wasteFactor: "Waste Factor (%)",
      addCircuit: "Add Circuit",
      calculate: "Calculate Material",
      configHelp: "Example: 3F#12+1N#12+1T#14",
      summary: "Material Summary",
      cableSize: "Cable Size",
      totalLength: "Total Length (m)",
      inputTable: "Circuit Table",
      totalWithWaste: "Total with Waste",
      totalWaste: "Total Waste",
      grandTotal: "Grand Total"
    }
  };

  // State for circuits
  const [circuits, setCircuits] = useState([
    {
      configuration: "3F#12+1N#12+1T#14",
      length: 30,
      description: "Circuito 1",
      wasteFactor: 15
    }
  ]);

  // State for calculation results
  const [calculationResults, setCalculationResults] = useState<{
    circuitDetails: Array<{
      config: string;
      length: number;
      description: string;
      wasteFactor: number;
      totalLength: number;
    }>;
    cableSummary: Array<{
      size: string;
      length: number;
      wasteLength: number;
      totalLength: number;
    }>;
  } | null>(null);

  // Function to update circuit configuration
  const updateCircuitConfig = (index: number, value: string) => {
    const updatedCircuits = [...circuits];
    updatedCircuits[index].configuration = value;
    setCircuits(updatedCircuits);
  };

  // Function to update circuit length
  const updateCircuitLength = (index: number, value: string) => {
    const updatedCircuits = [...circuits];
    updatedCircuits[index].length = parseFloat(value) || 0;
    setCircuits(updatedCircuits);
  };

  // Function to update circuit description
  const updateCircuitDescription = (index: number, value: string) => {
    const updatedCircuits = [...circuits];
    updatedCircuits[index].description = value;
    setCircuits(updatedCircuits);
  };

  // Function to update waste factor
  const updateWasteFactor = (index: number, value: string) => {
    const updatedCircuits = [...circuits];
    updatedCircuits[index].wasteFactor = parseFloat(value) || 0;
    setCircuits(updatedCircuits);
  };

  // Function to add a new circuit
  const addCircuit = () => {
    setCircuits([
      ...circuits,
      {
        configuration: "",
        length: 0,
        description: "",
        wasteFactor: 15
      }
    ]);
  };

  // Function to remove a circuit
  const removeCircuit = (index: number) => {
    if (circuits.length > 1) {
      const updatedCircuits = [...circuits];
      updatedCircuits.splice(index, 1);
      setCircuits(updatedCircuits);
    }
  };

  // Parse circuit configuration and calculate total cable requirements
  const calculateCableRequirements = () => {
    // Object to store cable totals by size
    const cableTotals: Record<string, { length: number; wasteLength: number }> = {};

    // Process each circuit
    const circuitDetails = circuits.map(circuit => {
      const { configuration, length, description, wasteFactor } = circuit;

      // Total length including waste factor
      const totalLength = length * (1 + wasteFactor / 100);

      // Parse the configuration
      const configParts = configuration.split('+');

      configParts.forEach(part => {
        // Example: "3F#12" -> quantity: 3, type: "F", size: "12"
        const match = part.match(/(\d+)([A-Za-z]+)#(\S+)/);

        if (match) {
          const [, quantity, type, size] = match;
          const cableLength = parseInt(quantity) * length;

          if (!cableTotals[size]) {
            cableTotals[size] = { length: 0, wasteLength: 0 };
          }

          cableTotals[size].length += cableLength;
          cableTotals[size].wasteLength += cableLength * (wasteFactor / 100);
        }
      });

      return {
        config: configuration,
        length,
        description,
        wasteFactor,
        totalLength
      };
    });

    // Convert to array format for display
    const cableSummary = Object.entries(cableTotals)
      .map(([size, { length, wasteLength }]) => ({
        size,
        length,
        wasteLength,
        totalLength: length + wasteLength
      }))
      .sort((a, b) => {
        // Try to convert to numbers first for sorting
        const numA = parseInt(a.size);
        const numB = parseInt(b.size);

        // Sort numerically if both are numbers
        if (!isNaN(numA) && !isNaN(numB)) {
          return numB - numA; // Larger sizes first
        }

        // Otherwise sort as strings
        return a.size.localeCompare(b.size);
      });

    setCalculationResults({
      circuitDetails,
      cableSummary
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content[language].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">
              {content[language].circuitHeader}
            </h3>

            {circuits.map((circuit, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
                <div className="col-span-4">
                  <Label>
                    {content[language].configuration}
                  </Label>
                  <Input
                    placeholder={content[language].configHelp}
                    value={circuit.configuration}
                    onChange={(e) => updateCircuitConfig(index, e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>
                    {content[language].length}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={circuit.length}
                    onChange={(e) => updateCircuitLength(index, e.target.value)}
                  />
                </div>

                <div className="col-span-3">
                  <Label>
                    {content[language].description}
                  </Label>
                  <Input
                    placeholder={language === "es" ? "Descripción opcional" : "Optional description"}
                    value={circuit.description}
                    onChange={(e) => updateCircuitDescription(index, e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>
                    {content[language].wasteFactor}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={circuit.wasteFactor}
                    onChange={(e) => updateWasteFactor(index, e.target.value)}
                  />
                </div>

                <div className="col-span-1 flex items-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCircuit(index)}
                    disabled={circuits.length === 1}
                    className="w-full"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={addCircuit}
                className="flex-1"
              >
                {content[language].addCircuit}
              </Button>

              <Button
                onClick={calculateCableRequirements}
                className="flex-1"
              >
                {content[language].calculate}
              </Button>
            </div>
          </div>

          {calculationResults && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {content[language].inputTable}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].circuit}
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].configuration}
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].description}
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].length}
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].wasteFactor}
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].totalWithWaste}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {calculationResults.circuitDetails.map((detail, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{idx + 1}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{detail.config}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{detail.description}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{detail.length} m</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{detail.wasteFactor}%</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{detail.totalLength.toFixed(2)} m</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {content[language].summary}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].cableSize}
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].totalLength}
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].totalWaste}
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {content[language].grandTotal}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {calculationResults.cableSummary.map((cable, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">#{cable.size}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{cable.length.toFixed(2)} m</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{cable.wasteLength.toFixed(2)} m</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-bold">{cable.totalLength.toFixed(2)} m</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 