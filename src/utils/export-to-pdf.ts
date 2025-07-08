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

export function exportLoadScheduleToPDF(
  data: any,
  language: SupportedLanguage,
  extras?: {
    panelType: "monofasico" | "bifasico" | "trifasico";
    panelCapacity: number;
    serviceCurrent: number;
    serviceWire: string | null;
    groundWire: string | null;
    serviceConduit: string | null;
    serviceVoltageDrop: number;
    projectName?: string;
    panelLocation?: string;
    panelName?: string;
  }
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (2 * margin);

  // Paleta de colores
  const colors = {
    orange: [249, 115, 22] as [number, number, number], // #F97316
    gray: [107, 114, 128] as [number, number, number], // #6B7280
    black: [0, 0, 0] as [number, number, number],
    // Para balance de fases
    blue: [59, 130, 246] as [number, number, number],
    warning: [251, 146, 60] as [number, number, number],
    danger: [239, 68, 68] as [number, number, number],
  };

  // Título principal
  const title = language === "es" ? "Cuadro de Cargas" : "Load Schedule";
  const projectName = extras?.projectName || "";
  const panelLocation = extras?.panelLocation || "";
  const panelName = extras?.panelName || "";
  doc.setFontSize(18);
  doc.setFont("helvetica", 'bold');
  doc.setTextColor(...colors.orange);
  doc.text(title, margin, 20, { align: "left" });
  
  // Agregar "Por David Avila" en la esquina superior derecha
  doc.setFontSize(10);
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(...colors.gray);
  doc.text("Por David Avila", pageWidth - margin, 15, { align: "right" });
  
  let currentY = 20;
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(...colors.black);

  // Información del proyecto debajo del título
  if (projectName || panelLocation || panelName) {
    doc.setFontSize(8);
    doc.setTextColor(...colors.gray);
    if (projectName) {
      doc.text((language === "es" ? "Proyecto: " : "Project: ") + projectName, margin, currentY + 6);
      currentY += 4;
    }
    if (panelLocation) {
      doc.text((language === "es" ? "Área: " : "Area: ") + panelLocation, margin, currentY + 6);
      currentY += 4;
    }
    if (panelName) {
      doc.text((language === "es" ? "Tablero: " : "Panel: ") + panelName, margin, currentY + 6);
      currentY += 4;
    }
    doc.setTextColor(...colors.black);
  }
  currentY += 10; // Espacio después de info proyecto

  // ====== SECCIÓN 1: RESUMEN DEL TABLERO ======
  doc.setFontSize(10);
  doc.setFont("helvetica", 'bold');
  doc.setTextColor(...colors.black);
  doc.text(language === "es" ? "Resumen del Tablero" : "Panel Summary", margin, currentY);
  currentY += 6;
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(...colors.black);

  // Caída de tensión total (mayor)
  const maxVoltageDrop = data.circuits && data.circuits.length > 0
    ? Math.max(...data.circuits.map((c: any) => c.voltageDrop || 0)) + (extras?.serviceVoltageDrop || 0)
    : 0;

  const summaryItems = [
    { label: language === "es" ? "Circuitos" : "Circuits", value: (data.circuits.length || 0).toString(), color: colors.gray },
    { label: language === "es" ? "Potencia" : "Power", value: `${data.totalPower?.toFixed?.(0) || "0"} W`, color: colors.orange },
    { label: language === "es" ? "Corriente" : "Current", value: `${data.totalCurrent?.toFixed?.(1) || "0.0"} A`, color: colors.orange },
    { label: language === "es" ? "Mayor Caída de Tensión" : "Max Voltage Drop", value: `${maxVoltageDrop.toFixed(2)} %`, color: colors.orange }
  ];
  const itemWidth = contentWidth / summaryItems.length;
  const summaryBlockHeight = 14;
  summaryItems.forEach((item, index) => {
    const x = margin + (index * itemWidth) + 10;
    const y = currentY + 3;
    doc.setFontSize(10);
    doc.setFont("helvetica", 'bold');
    doc.setTextColor(...item.color);
    doc.text(item.value || "", x + itemWidth/2, y, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont("helvetica", 'normal');
    doc.setTextColor(...colors.gray);
    doc.text(item.label || "", x + itemWidth/2, y + 4, { align: 'center' });
  });
  currentY += summaryBlockHeight + 4;

  // ====== SECCIÓN 2: INFORMACIÓN DE ACOMETIDA ======
  doc.setFontSize(10);
  doc.setFont("helvetica", 'bold');
  doc.setTextColor(...colors.black);
  doc.text(language === "es" ? "Información de Acometida" : "Service Information", margin, currentY);
  currentY += 6;
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(...colors.black);
  if (extras) {
    const serviceItems = [
      { label: language === "es" ? "Capacidad Tablero" : "Panel Capacity", value: `${extras.panelCapacity ?? ""} A` },
      { label: language === "es" ? "Corriente Servicio" : "Service Current", value: `${extras.serviceCurrent?.toFixed?.(2) || "0.00"} A` },
      { label: language === "es" ? "Cable Servicio" : "Service Wire", value: extras.serviceWire ?? "" },
      { label: language === "es" ? "Ducto Servicio" : "Service Conduit", value: extras.serviceConduit ?? "" },
      { label: language === "es" ? "Tierra" : "Ground", value: extras.groundWire ?? "" },
      { label: language === "es" ? "Caída V Servicio" : "Service V Drop", value: `${extras.serviceVoltageDrop?.toFixed?.(2) || "0.00"} %` },
    ];
    const formatService = (wire: string | null, ground: string | null, type: string) => {
      if (!wire || !ground) return "";
      if (type === "monofasico") return `1F#${wire}+1N#${wire}+1T#${ground}`;
      if (type === "bifasico") return `2F#${wire}+1N#${wire}+1T#${ground}`;
      return `3F#${wire}+1N#${wire}+1T#${ground}`;
    };
    const acometida = formatService(extras.serviceWire || "", extras.groundWire || "", extras.panelType || "");
    if (acometida) {
      serviceItems.push({
        label: language === "es" ? "Acometida Principal" : "Main Service Line",
        value: acometida,
      });
    }
    const serviceItemWidth = contentWidth / serviceItems.length;
    const acometidaBlockHeight = 14;
    serviceItems.forEach((item, index) => {
      const x = margin + (index * serviceItemWidth) + 5;
      const y = currentY + 3;
      doc.setFontSize(8);
      doc.setTextColor(...colors.gray);
      doc.text(item.label || "", x + serviceItemWidth/2, y, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont("helvetica", 'bold');
      doc.setTextColor(...colors.orange);
      doc.text(item.value || "", x + serviceItemWidth/2, y + 4, { align: 'center' });
      doc.setFont("helvetica", 'normal');
      doc.setTextColor(...colors.black);
    });
    currentY += acometidaBlockHeight + 4;
  }

  // ====== SECCIÓN 3: BALANCE DE FASES ======
  doc.setFontSize(10);
  doc.setFont("helvetica", 'bold');
  doc.setTextColor(...colors.black);
  doc.text(language === "es" ? "Balance de Fases" : "Phase Balance", margin, currentY);
  currentY += 6;
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(...colors.black);
  if (!(data.phaseBalance.B === 0 && data.phaseBalance.C === 0)) {
    const maxCurrent = Math.max(data.phaseBalance.A || 0, data.phaseBalance.B || 0, data.phaseBalance.C || 0);
    const phases = [
      { name: language === "es" ? "Fase A (L1)" : "Phase A (L1)", current: data.phaseBalance.A || 0, color: colors.blue },
      { name: language === "es" ? "Fase B (L2)" : "Phase B (L2)", current: data.phaseBalance.B || 0, color: colors.warning },
      { name: language === "es" ? "Fase C (L3)" : "Phase C (L3)", current: data.phaseBalance.C || 0, color: colors.danger }
    ];
    const phaseBlockHeight = 8 * phases.filter(p => p.current > 0).length;
    phases.forEach((phase, index) => {
      if (phase.current > 0) {
        const y = currentY + (index * 8);
        doc.setFontSize(9);
        doc.setTextColor(...colors.gray);
        doc.text(phase.name || "", margin + 10, y);
        doc.setFont("helvetica", 'bold');
        doc.setTextColor(...phase.color);
        doc.text(`${phase.current.toFixed(2)} A`, margin + 60, y);
        // Barra de progreso
        const progressWidth = 50;
        const progressHeight = 4;
        const progressX = margin + 80;
        const progressY = y - 3;
        doc.setFillColor(240, 240, 240);
        doc.rect(progressX, progressY, progressWidth, progressHeight, 'F');
        doc.setFillColor(...phase.color);
        doc.rect(progressX, progressY, progressWidth * (maxCurrent ? (phase.current / maxCurrent) : 0), progressHeight, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(progressX, progressY, progressWidth, progressHeight, 'S');
      }
    });
    doc.setFont("helvetica", 'normal');
    doc.setTextColor(...colors.black);
    currentY += phaseBlockHeight + 6;
  }

  // ====== SECCIÓN 4: TABLA DE CIRCUITOS ======
  doc.setFontSize(10);
  doc.setFont("helvetica", 'bold');
  doc.setTextColor(...colors.black);
  doc.text(language === "es" ? "Cálculos Detallados de Circuitos" : "Detailed Circuit Calculations", margin, currentY);
  currentY += 6;
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(...colors.black);
  const circuitHeaders = [
    "#",
    language === "es" ? "Descripción" : "Description",
    language === "es" ? "Tipo" : "Type",
    language === "es" ? "Tensión" : "Voltage",
    language === "es" ? "Potencia" : "Power",
    language === "es" ? "Corriente" : "Current",
    "I×1.25",
    language === "es" ? "Longitud (m)" : "Length (m)",
    language === "es" ? "Fase" : "Phase",
    language === "es" ? "Cableado" : "Wiring",
    language === "es" ? "Ducto" : "Conduit",
    language === "es" ? "Protección" : "Protection",
    language === "es" ? "Caída V" : "V Drop",
    language === "es" ? "Pérdidas" : "Losses"
  ];
  const formatProtection = (protection: string, type: string) => {
    const amperage = protection.replace(/[^\d]/g, "");
    if (type === "trifasico") return `3x${amperage}A`;
    if (type === "bifasico") return `2x${amperage}A`;
    return `1x${amperage}A`;
  };
  const circuitData = data.circuits.map((c: any, idx: number) => [
    (idx + 1).toString(),
    c.description || "",
    c.type === "trifasico" ? "3F" : c.type === "bifasico" ? "2F" : "1F",
    `${c.voltage || ""}V`,
    `${c.power?.toFixed?.(0) || "0"}W`,
    `${c.current?.toFixed?.(2) || "0.00"}A`,
    `${c.currentWithFactor?.toFixed?.(2) || ""}A`,
    c.length !== undefined && c.length !== null && c.length !== '' ? `${c.length}` : '',
    c.phase || "",
    c.wireConfiguration || "",
    c.conduitSize || "",
    formatProtection(c.protection || '', c.type || ''),
    `${c.voltageDrop?.toFixed?.(2) || ""}%`,
    `${c.powerLoss?.toFixed?.(1) || ""}W`
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [circuitHeaders],
    body: circuitData,
    theme: 'grid',
    styles: { 
      fontSize: 7,
      cellPadding: 1.5,
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: colors.orange,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: margin + 5, right: margin + 5 }
  });
  // Actualiza currentY después de la tabla
  if ((doc as any).lastAutoTable && (doc as any).lastAutoTable.finalY) {
    currentY = (doc as any).lastAutoTable.finalY + 5;
  }

  // Guardar el PDF
  doc.save(language === "es" ? "Cuadro_de_Cargas.pdf" : "Load_Schedule.pdf");
} 