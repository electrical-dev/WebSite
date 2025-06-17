import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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

export function exportToPDF(data: ExportData) {
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
      watts: "Vatios",
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
      watts: "Watts",
    },
  };

  const t = content[data.language];
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Título
  doc.setFontSize(18);
  doc.text(t.title, 20, 20);

  // Información general
  doc.setFontSize(12);
  doc.text(`${t.circuitType}: ${data.circuitType}`, 20, 40);
  doc.text(`${t.ambientTemp}: ${data.ambientTemp}°C`, 20, 50);

  // Balance de cargas
  doc.text(t.loadBalance, 20, 70);
  doc.text(`${t.phaseA}: ${data.loadBalance.phaseA.toFixed(2)} A`, 20, 80);
  doc.text(`${t.phaseB}: ${data.loadBalance.phaseB.toFixed(2)} A`, 20, 90);
  doc.text(`${t.phaseC}: ${data.loadBalance.phaseC.toFixed(2)} A`, 20, 100);
  doc.text(`${t.unbalance}: ${data.loadBalance.unbalance.toFixed(2)}%`, 20, 110);

  // Cables
  doc.text(`${t.serviceWire}: ${data.serviceWire} AWG`, 20, 130);
  doc.text(`${t.groundWire}: ${data.groundWire} AWG`, 20, 140);

  // Tabla de circuitos
  const circuitData = data.circuits.map((circuit) => [
    circuit.description,
    circuit.power.toString(),
    circuit.voltage.toString(),
    circuit.length.toString(),
    circuit.phase,
    circuit.wireSize || "",
    circuit.voltageDrop?.percentage.toFixed(2) || "",
    circuit.powerLoss?.watts.toFixed(2) || "",
    circuit.protection?.toString() || "",
  ]);

  autoTable(doc, {
    startY: 160,
    head: [
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
    ],
    body: circuitData,
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Guardar el PDF
  doc.save(`${t.title}.pdf`);
}

export function exportLoadScheduleToPDF(data: any, language: SupportedLanguage, extras?: { panelType: "monofasico" | "bifasico" | "trifasico"; panelCapacity: number; serviceCurrent: number; serviceWire: string | null; groundWire: string | null; serviceConduit: string | null; serviceVoltageDrop: number; }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const title = language === "es" ? "Cuadro de Cargas" : "Load Schedule";
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, 20, { align: "center" });

  // ====== Bloque RESUMEN Tablero + Acometida ======
  let nextY = 30;

  const mainSummary: any[] = [
    [language === "es" ? "Potencia Total" : "Total Power", `${data.totalPower.toFixed(0)} W`],
    [language === "es" ? "Corriente Total" : "Total Current", `${data.totalCurrent.toFixed(2)} A`]
  ];

  if (extras) {
    const formatService = (wire: string | null, ground: string | null, type: string) => {
      if (!wire || !ground) return "";
      if (type === "monofasico") return `1F#${wire}+1N#${wire}+1T#${ground}`;
      if (type === "bifasico") return `2F#${wire}+1N#${wire}+1T#${ground}`;
      return `3F#${wire}+1N#${wire}+1T#${ground}`;
    };

    mainSummary.push(
      [language === "es" ? "Capacidad Tablero" : "Panel Capacity", `${extras.panelCapacity} A`],
      [language === "es" ? "Corriente Servicio" : "Service Current", `${extras.serviceCurrent.toFixed(2)} A`],
      [language === "es" ? "Cable Servicio" : "Service Wire", extras.serviceWire ?? ""],
      [language === "es" ? "Ducto Servicio" : "Service Conduit", extras.serviceConduit ?? ""],
      [language === "es" ? "Tierra" : "Ground", extras.groundWire ?? ""],
      [language === "es" ? "Caída V Servicio" : "Service V Drop", `${extras.serviceVoltageDrop.toFixed(2)} %`],
      [language === "es" ? "Acometida Completa" : "Complete Wiring", formatService(extras.serviceWire, extras.groundWire, extras.panelType)]
    );
  }

  autoTable(doc, {
    startY: nextY,
    body: mainSummary,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }
  });

  nextY = (doc as any).lastAutoTable.finalY + 10;

  // ====== Tabla de circuitos (todas las columnas de la UI) ======

  // Tabla de circuitos (todas las columnas de la UI)
  const circuitHeaders = [
    "#",
    language === "es" ? "Descripción" : "Description",
    language === "es" ? "Tipo" : "Type",
    language === "es" ? "Tensión (V)" : "Voltage (V)",
    language === "es" ? "Potencia (W)" : "Power (W)",
    language === "es" ? "Corriente (A)" : "Current (A)",
    "I×1.25 (A)",
    language === "es" ? "Longitud (m)" : "Length (m)",
    language === "es" ? "Fase" : "Phase",
    language === "es" ? "Cableado" : "Wiring",
    language === "es" ? "Ducto" : "Conduit",
    language === "es" ? "Protección" : "Protection",
    language === "es" ? "Caída V (%)" : "V Drop (%)",
    language === "es" ? "Pérdidas (W)" : "Loss (W)"
  ];

  const circuitData = data.circuits.map((c, idx: number) => [
    idx + 1,
    c.description,
    c.type === "trifasico" ? "3F" : c.type === "bifasico" ? "2F" : "1F",
    c.voltage,
    c.power.toFixed(0),
    c.current.toFixed(2),
    (c as any).currentWithFactor?.toFixed?.(2) ?? "",
    (c as any).length ?? "",
    c.phase,
    (c as any).wireConfiguration ?? "",
    (c as any).conduitSize ?? "",
    c.protection,
    (c as any).voltageDrop?.toFixed?.(2) ?? "",
    (c as any).powerLoss?.toFixed?.(1) ?? ""
  ]);

  autoTable(doc, {
    startY: nextY,
    head: [circuitHeaders],
    body: circuitData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }
  });

  // Resumen
  const summaryY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(16);
  doc.text(language === "es" ? "Resumen" : "Summary", pageWidth / 2, summaryY, { align: "center" });

  // Datos del resumen
  const summaryData = [
    [
      language === "es" ? "Caída de Tensión" : "Voltage Drop",
      `${data.voltageDrop.toFixed(2)} V`
    ],
    [
      language === "es" ? "Pérdidas de Potencia" : "Power Loss",
      `${data.powerLoss.toFixed(2)} W`
    ]
  ];

  autoTable(doc, {
    startY: summaryY + 10,
    body: summaryData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  });

  // Balance de fases solo si aplica
  if (!(data.phaseBalance.B === 0 && data.phaseBalance.C === 0)) {
    const phaseBalanceY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.text(language === "es" ? "Balance de Fases" : "Phase Balance", pageWidth / 2, phaseBalanceY, { align: "center" });

    const phaseBalanceData: any[] = [];
    phaseBalanceData.push(["A", `${data.phaseBalance.A.toFixed(2)} A`]);
    if (data.phaseBalance.B > 0) phaseBalanceData.push(["B", `${data.phaseBalance.B.toFixed(2)} A`]);
    if (data.phaseBalance.C > 0) phaseBalanceData.push(["C", `${data.phaseBalance.C.toFixed(2)} A`]);

    autoTable(doc, {
      startY: phaseBalanceY + 10,
      body: phaseBalanceData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
  }

  // Guardar el PDF
  doc.save(language === "es" ? "Cuadro_de_Cargas.pdf" : "Load_Schedule.pdf");
} 