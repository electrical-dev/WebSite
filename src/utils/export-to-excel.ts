import * as XLSX from "xlsx";
import { SupportedLanguage } from '../types/language';

interface Circuit {
  id: string;
  description: string;
  power: number;
  voltage: number;
  length: number;
  phase: string;
  wireSize?: string;
  voltageDrop?: {
    percentage: number;
    voltage: number;
  };
  powerLoss?: {
    watts: number;
    percentage: number;
  };
  protection?: number;
}

interface LoadBalance {
  phaseA: number;
  phaseB: number;
  phaseC: number;
  unbalance: number;
}

interface ExportData {
  circuits: Circuit[];
  loadBalance: LoadBalance;
  serviceWire: string;
  groundWire: string;
  circuitType: "monofasico" | "bifasico" | "trifasico";
  ambientTemp: number;
  language: "en" | "es";
}

interface LoadScheduleResult {
  circuits: {
    id: string;
    type: string;
    description: string;
    power: number;
    quantity: number;
    phase: string;
    current: number;
    wireSize: string;
    protection: string;
  }[];
  totalPower: number;
  totalCurrent: number;
  phaseBalance: {
    A: number;
    B: number;
    C: number;
  };
  voltageDrop: number;
  powerLoss: number;
}

export function exportToExcel(data: ExportData) {
  const content = {
    es: {
      title: "Cuadro de Cargas",
      circuitType: "Tipo de Circuito",
      ambientTemp: "Temperatura Ambiente",
      loadBalance: "Balance de Cargas",
      phaseA: "Fase A",
      phaseB: "Fase B",
      phaseC: "Fase C",
      unbalance: "Desequilibrio",
      circuits: "Circuitos",
      description: "Descripción",
      power: "Potencia (W)",
      voltage: "Tensión (V)",
      length: "Longitud (m)",
      phase: "Fase",
      wireSize: "Calibre",
      voltageDrop: "Caída de Tensión",
      powerLoss: "Pérdidas de Potencia",
      protection: "Protección (A)",
      serviceWire: "Cable de Acometida",
      groundWire: "Cable de Tierra",
      percentage: "Porcentaje",
      voltageValue: "Tensión",
      watts: "Vatios",
      amps: "Amperios",
    },
    en: {
      title: "Load Schedule",
      circuitType: "Circuit Type",
      ambientTemp: "Ambient Temperature",
      loadBalance: "Load Balance",
      phaseA: "Phase A",
      phaseB: "Phase B",
      phaseC: "Phase C",
      unbalance: "Unbalance",
      circuits: "Circuits",
      description: "Description",
      power: "Power (W)",
      voltage: "Voltage (V)",
      length: "Length (m)",
      phase: "Phase",
      wireSize: "Wire Size",
      voltageDrop: "Voltage Drop",
      powerLoss: "Power Loss",
      protection: "Protection (A)",
      serviceWire: "Service Wire",
      groundWire: "Ground Wire",
      percentage: "Percentage",
      voltageValue: "Voltage",
      watts: "Watts",
      amps: "Amps",
    },
  };

  const t = content[data.language];

  // Crear un nuevo libro de Excel
  const wb = XLSX.utils.book_new();

  // Hoja de información general
  const generalInfo = [
    [t.title],
    [],
    [t.circuitType, data.circuitType],
    [t.ambientTemp, `${data.ambientTemp}°C`],
    [],
    [t.loadBalance],
    [t.phaseA, `${data.loadBalance.phaseA.toFixed(2)} ${t.amps}`],
    [t.phaseB, `${data.loadBalance.phaseB.toFixed(2)} ${t.amps}`],
    [t.phaseC, `${data.loadBalance.phaseC.toFixed(2)} ${t.amps}`],
    [t.unbalance, `${data.loadBalance.unbalance.toFixed(2)}%`],
    [],
    [t.serviceWire, `${data.serviceWire} AWG`],
    [t.groundWire, `${data.groundWire} AWG`],
  ];

  const wsGeneral = XLSX.utils.aoa_to_sheet(generalInfo);
  XLSX.utils.book_append_sheet(wb, wsGeneral, "General");

  // Hoja de circuitos
  const circuitData = [
    [
      t.description,
      t.power,
      t.voltage,
      t.length,
      t.phase,
      t.wireSize,
      `${t.voltageDrop} (%)`,
      `${t.powerLoss} (${t.watts})`,
      t.protection,
    ],
    ...data.circuits.map((circuit) => [
      circuit.description,
      circuit.power,
      circuit.voltage,
      circuit.length,
      circuit.phase,
      circuit.wireSize,
      circuit.voltageDrop?.percentage.toFixed(2),
      circuit.powerLoss?.watts.toFixed(2),
      circuit.protection,
    ]),
  ];

  const wsCircuits = XLSX.utils.aoa_to_sheet(circuitData);

  // Estilos: Encabezados en negrita y color de fondo gris claro
  const headerRange = XLSX.utils.decode_range(wsCircuits['!ref'] as string);
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cell = wsCircuits[XLSX.utils.encode_cell({ r: 0, c: C })];
    if (cell) {
      cell.s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { patternType: 'solid', fgColor: { rgb: '2980B9' } },
        alignment: { horizontal: 'center' }
      } as any;
    }
  }

  // Auto ancho de columnas segun longitud máxima
  const colWidths: number[] = [];
  for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = wsCircuits[cellAddress];
      if (cell && cell.v != null) {
        const len = String(cell.v).length;
        colWidths[C] = Math.max(colWidths[C] || 10, len + 2);
      }
    }
  }
  wsCircuits['!cols'] = colWidths.map(w => ({ wch: w }));

  XLSX.utils.book_append_sheet(wb, wsCircuits, t.circuits);

  // Generar el archivo Excel
  XLSX.writeFile(wb, `${t.title}.xlsx`);
}

export function exportLoadScheduleToExcel(data: LoadScheduleResult, language: SupportedLanguage, extras?: { panelType: "monofasico" | "bifasico" | "trifasico"; panelCapacity: number; serviceCurrent: number; serviceWire: string | null; groundWire: string | null; serviceConduit: string | null; serviceVoltageDrop: number; }): void {
  // Crear un nuevo libro de Excel
  const wb = XLSX.utils.book_new();

  // Preparar datos para la hoja de circuitos (todas las columnas que se muestran en la UI)
  const circuitData = [
    {
      [language === "es" ? "#" : "#"]: "",
      [language === "es" ? "Descripción" : "Description"]: "",
      [language === "es" ? "Tipo" : "Type"]: "",
      [language === "es" ? "Tensión (V)" : "Voltage (V)"]: "",
      [language === "es" ? "Potencia (W)" : "Power (W)"]: "",
      [language === "es" ? "Corriente (A)" : "Current (A)"]: "",
      [language === "es" ? "I×1.25 (A)" : "I×1.25 (A)"]: "",
      [language === "es" ? "Longitud (m)" : "Length (m)"]: "",
      [language === "es" ? "Fase" : "Phase"]: "",
      [language === "es" ? "Cableado" : "Wiring"]: "",
      [language === "es" ? "Ducto" : "Conduit"]: "",
      [language === "es" ? "Protección" : "Protection"]: "",
      [language === "es" ? "Caída V (%)" : "V Drop (%)"]: "",
      [language === "es" ? "Pérdidas (W)" : "Loss (W)"]: "",
    },
    ...data.circuits.map((circuit, idx) => ({
      [language === "es" ? "#" : "#"]: idx + 1,
      [language === "es" ? "Descripción" : "Description"]: circuit.description,
      [language === "es" ? "Tipo" : "Type"]: circuit.type === "trifasico" ? "3F" : circuit.type === "bifasico" ? "2F" : "1F",
      [language === "es" ? "Tensión (V)" : "Voltage (V)"]: circuit.voltage,
      [language === "es" ? "Potencia (W)" : "Power (W)"]: circuit.power,
      [language === "es" ? "Corriente (A)" : "Current (A)"]: circuit.current.toFixed(2),
      [language === "es" ? "I×1.25 (A)" : "I×1.25 (A)"]: circuit.currentWithFactor.toFixed(2),
      [language === "es" ? "Longitud (m)" : "Length (m)"]: (data.circuits.find(c=>c.id===circuit.id)?.length)||0,
      [language === "es" ? "Fase" : "Phase"]: circuit.phase,
      [language === "es" ? "Cableado" : "Wiring"]: circuit.wireConfiguration,
      [language === "es" ? "Ducto" : "Conduit"]: circuit.conduitSize,
      [language === "es" ? "Protección" : "Protection"]: circuit.protection,
      [language === "es" ? "Caída V (%)" : "V Drop (%)"]: circuit.voltageDrop.toFixed(2),
      [language === "es" ? "Pérdidas (W)" : "Loss (W)"]: circuit.powerLoss.toFixed(1)
    }))
  ];

  const wsCircuits = XLSX.utils.json_to_sheet(circuitData, { skipHeader: true });
  XLSX.utils.book_append_sheet(wb, wsCircuits, language === "es" ? "Circuitos" : "Circuits");

  // Hoja de resumen extendido
  const summary: any[] = [
    {
      Item: language === "es" ? "Potencia Total" : "Total Power",
      Valor: `${data.totalPower.toFixed(0)} W`
    },
    {
      Item: language === "es" ? "Corriente Total" : "Total Current",
      Valor: `${data.totalCurrent.toFixed(1)} A`
    }
  ];

  if (extras) {
    summary.push(
      { Item: language === "es" ? "Capacidad Tablero" : "Panel Capacity", Valor: `${extras.panelCapacity} A` },
      { Item: language === "es" ? "Corriente Servicio" : "Service Current", Valor: `${extras.serviceCurrent.toFixed(1)} A` },
      { Item: language === "es" ? "Cable Servicio" : "Service Wire", Valor: `${extras.serviceWire}` },
      { Item: language === "es" ? "Ducto Servicio" : "Service Conduit", Valor: `${extras.serviceConduit}` },
      { Item: language === "es" ? "Tierra" : "Ground", Valor: `${extras.groundWire}` },
      { Item: language === "es" ? "Caída V Servicio" : "Service V Drop", Valor: `${extras.serviceVoltageDrop.toFixed(2)} %` }
    );

    // Fase balance sólo si aplica
    if (extras.panelType !== "monofasico") {
      summary.push({ Item: language === "es" ? "Fase A" : "Phase A", Valor: `${data.phaseBalance.A.toFixed(2)} A` });
      summary.push({ Item: language === "es" ? "Fase B" : "Phase B", Valor: `${data.phaseBalance.B.toFixed(2)} A` });
      if (extras.panelType === "trifasico") {
        summary.push({ Item: language === "es" ? "Fase C" : "Phase C", Valor: `${data.phaseBalance.C.toFixed(2)} A` });
      }
    }
  }

  const wsSummary = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, wsSummary, language === "es" ? "Resumen" : "Summary");

  XLSX.writeFile(wb, language === "es" ? "Cuadro_de_Cargas.xlsx" : "Load_Schedule.xlsx");
} 