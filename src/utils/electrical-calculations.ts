interface Circuit {
  id: string;
  description: string;
  power: number;
  voltage: number;
  length: number;
  phase: string;
}

interface LoadBalance {
  phaseA: number;
  phaseB: number;
  phaseC: number;
  unbalance: number;
}

interface VoltageDrop {
  percentage: number;
  voltage: number;
}

interface PowerLoss {
  watts: number;
  percentage: number;
}

interface WireSize {
  size: string;
  ampacity: number;
  resistance: number;
}

interface LoadScheduleResult {
  circuits: {
    id: string;
    type: string;
    description: string;
    power: number;
    quantity: number;
    phase: string;
    voltage: number;
    current: number;
    currentWithFactor: number; // Corriente al 1.25 para mostrar en tabla
    wireSize: string;
    wireConfiguration: string; // Configuración completa del cableado (1F#12+1N#12+1T#12)
    conduitSize: string;
    protection: string;
    voltageDrop: number;
    powerLoss: number;
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

// Tabla de conductores según NOM-001-SEDE-2012
const WIRE_SIZES: WireSize[] = [
  { size: "14", ampacity: 15, resistance: 8.286 },
  { size: "12", ampacity: 20, resistance: 5.208 },
  { size: "10", ampacity: 30, resistance: 3.277 },
  { size: "8", ampacity: 40, resistance: 2.061 },
  { size: "6", ampacity: 55, resistance: 1.296 },
  { size: "4", ampacity: 70, resistance: 0.815 },
  { size: "3", ampacity: 85, resistance: 0.646 },
  { size: "2", ampacity: 95, resistance: 0.513 },
  { size: "1", ampacity: 110, resistance: 0.407 },
  { size: "1/0", ampacity: 125, resistance: 0.323 },
  { size: "2/0", ampacity: 145, resistance: 0.256 },
  { size: "3/0", ampacity: 165, resistance: 0.203 },
  { size: "4/0", ampacity: 195, resistance: 0.161 },
  { size: "250", ampacity: 215, resistance: 0.129 },
  { size: "300", ampacity: 240, resistance: 0.108 },
  { size: "350", ampacity: 260, resistance: 0.092 },
  { size: "400", ampacity: 280, resistance: 0.081 },
  { size: "500", ampacity: 320, resistance: 0.065 },
  { size: "600", ampacity: 350, resistance: 0.054 },
  { size: "700", ampacity: 385, resistance: 0.046 },
  { size: "750", ampacity: 400, resistance: 0.043 },
  { size: "800", ampacity: 410, resistance: 0.040 },
  { size: "900", ampacity: 435, resistance: 0.036 },
  { size: "1000", ampacity: 455, resistance: 0.032 },
  { size: "1100", ampacity: 495, resistance: 0.029 },
];

// Tabla de diámetros de cables (mm) para cálculo de ductos
const CABLE_DIAMETERS: { [key: string]: number } = {
  "14": 2.82,
  "12": 3.30,
  "10": 4.17,
  "8": 5.49,
  "6": 6.65,
  "4": 8.23,
  "3": 9.25,
  "2": 10.31,
  "1": 12.34,
  "1/0": 13.51,
  "2/0": 14.83,
  "3/0": 16.26,
  "4/0": 17.48,
  "250": 19.61,
  "300": 21.23,
  "350": 22.91,
  "400": 24.49,
  "500": 27.18,
  "600": 29.97,
  "700": 32.51,
  "750": 33.27,
  "800": 34.04,
  "900": 35.56,
  "1000": 37.08
};

// Tamaños de ductos disponibles (diámetro interior en mm)
const CONDUIT_SIZES = [
  { name: "1/2\"", diameterMM: 15.99 },
  { name: "3/4\"", diameterMM: 21.22 },
  { name: "1\"", diameterMM: 27.00 },
  { name: "1-1/4\"", diameterMM: 35.76 },
  { name: "1-1/2\"", diameterMM: 41.16 },
  { name: "2\"", diameterMM: 53.34 },
  { name: "2-1/2\"", diameterMM: 63.50 },
  { name: "3\"", diameterMM: 78.99 },
  { name: "3-1/2\"", diameterMM: 91.44 },
  { name: "4\"", diameterMM: 103.89 },
  { name: "5\"", diameterMM: 128.27 },
  { name: "6\"", diameterMM: 154.05 }
];

// === NUEVAS UTILIDADES PARA CALIBRES ===
// Normaliza el texto del calibre para que "12" y "12 AWG" sean equivalentes
function normalizeWireSize(size: string): string {
  return size.replace(/\s*AWG\s*$/i, "").trim();
}

// Obtiene la resistencia (ohms/km) a partir del calibre normalizado
function getWireResistance(size: string): number {
  const normalized = normalizeWireSize(size);
  const wire = WIRE_SIZES.find((w) => w.size === normalized);
  return wire ? wire.resistance : WIRE_SIZES[0].resistance;
}

export function calculateLoadBalance(circuits: Circuit[]): LoadBalance {
  const phaseA = circuits
    .filter((c) => c.phase === "A")
    .reduce((sum, c) => sum + c.power / c.voltage, 0);
  const phaseB = circuits
    .filter((c) => c.phase === "B")
    .reduce((sum, c) => sum + c.power / c.voltage, 0);
  const phaseC = circuits
    .filter((c) => c.phase === "C")
    .reduce((sum, c) => sum + c.power / c.voltage, 0);

  const average = (phaseA + phaseB + phaseC) / 3;
  const maxDeviation = Math.max(
    Math.abs(phaseA - average),
    Math.abs(phaseB - average),
    Math.abs(phaseC - average)
  );
  const unbalance = average > 0 ? (maxDeviation / average) * 100 : 0;

  return {
    phaseA,
    phaseB,
    phaseC,
    unbalance,
  };
}

export function calculateCircuitVoltageDrop(
  circuit: Circuit,
  wireSize: string,
  circuitType: "monofasico" | "bifasico" | "trifasico"
): VoltageDrop {
  const wire = WIRE_SIZES.find((w) => w.size === wireSize);
  if (!wire) throw new Error("Invalid wire size");

  const current = circuit.power / circuit.voltage;
  const resistance = wire.resistance / 1000; // Convert to ohms per meter
  const length = circuit.length * 2; // Round trip length

  let voltageDrop: number;
  if (circuitType === "trifasico") {
    voltageDrop = Math.sqrt(3) * current * resistance * length;
  } else {
    voltageDrop = 2 * current * resistance * length;
  }

  const percentage = (voltageDrop / circuit.voltage) * 100;

  return {
    percentage,
    voltage: voltageDrop,
  };
}

export function calculateCircuitPowerLoss(
  circuit: Circuit,
  wireSize: string,
  circuitType: "monofasico" | "bifasico" | "trifasico"
): PowerLoss {
  const wire = WIRE_SIZES.find((w) => w.size === wireSize);
  if (!wire) throw new Error("Invalid wire size");

  const current = circuit.power / circuit.voltage;
  const resistance = wire.resistance / 1000; // Convert to ohms per meter
  const length = circuit.length * 2; // Round trip length

  let powerLoss: number;
  if (circuitType === "trifasico") {
    powerLoss = 3 * Math.pow(current, 2) * resistance * length;
  } else {
    powerLoss = 2 * Math.pow(current, 2) * resistance * length;
  }

  const percentage = (powerLoss / circuit.power) * 100;

  return {
    watts: powerLoss,
    percentage,
  };
}

export function getRecommendedWireSize(
  current: number,
  circuitType: "monofasico" | "bifasico" | "trifasico",
  ambientTemp: number
): string {
  // Aplicar factores de corrección por temperatura
  const tempCorrection = ambientTemp > 30 ? 0.82 : 1;

  // Aplicar factor de corrección por tipo de circuito
  const circuitCorrection = circuitType === "trifasico" ? 0.8 : 1;

  const correctedCurrent = current / (tempCorrection * circuitCorrection);

  const wire = WIRE_SIZES.find((w) => w.ampacity >= correctedCurrent);
  return wire ? wire.size : "1000";
}

export function getRecommendedProtection(
  current: number,
  circuitType: "monofasico" | "bifasico" | "trifasico"
): number {
  // Aplicar factor de seguridad del 125%
  const safetyFactor = 1.25;
  const recommendedCurrent = current * safetyFactor;

  // Redondear al siguiente tamaño estándar de interruptor
  const standardSizes = [15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 125, 150, 175, 200];
  return standardSizes.find((size) => size >= recommendedCurrent) || 200;
}

export function calculateServiceWire(
  totalPower: number,
  panelType: "monofasico" | "bifasico" | "trifasico",
  ambientTemp: number
): string {
  let current: number;
  
  // Calcular corriente según el tipo de sistema
  switch (panelType) {
    case "monofasico":
      current = totalPower / (127 * 0.9); // Asumiendo factor de potencia promedio de 0.9
      break;
    case "bifasico":
      current = totalPower / (220 * 0.9); // Voltaje línea-línea
      break;
    case "trifasico":
      current = totalPower / (Math.sqrt(3) * 220 * 0.9); // Sistema trifásico
      break;
    default:
      current = totalPower / (127 * 0.9);
  }

  // Aplicar factor de seguridad del 125% (1.25)
  const adjustedCurrent = current * 1.25;

  // Aplicar corrección por temperatura
  const tempCorrection = ambientTemp > 30 ? 0.82 : 1;
  const finalCurrent = adjustedCurrent / tempCorrection;

  // Encontrar el calibre adecuado
  const wire = WIRE_SIZES.find((w) => w.ampacity >= finalCurrent);
  return wire ? `${wire.size}` : "1000";
}

// Nueva función para calcular la corriente de la acometida
export function calculateServiceCurrent(
  totalPower: number,
  panelType: "monofasico" | "bifasico" | "trifasico"
): number {
  let current: number;
  
  // Calcular corriente según el tipo de sistema
  switch (panelType) {
    case "monofasico":
      current = totalPower / (127 * 0.9); // Asumiendo factor de potencia promedio de 0.9
      break;
    case "bifasico":
      current = totalPower / (220 * 0.9); // Voltaje línea-línea
      break;
    case "trifasico":
      current = totalPower / (Math.sqrt(3) * 220 * 0.9); // Sistema trifásico
      break;
    default:
      current = totalPower / (127 * 0.9);
  }

  return current;
}

// Nueva función para calcular la caída de tensión de la acometida
export function calculateServiceVoltageDrop(
  current: number,
  serviceLength: number,
  serviceWireSize: string,
  panelType: "monofasico" | "bifasico" | "trifasico"
): { percentage: number; voltage: number } {
  const wire = WIRE_SIZES.find((w) => w.size === serviceWireSize);
  if (!wire) return { percentage: 0, voltage: 0 };

  const resistance = wire.resistance / 1000; // Convert to ohms per meter
  const roundTripLength = serviceLength * 2; // Ida y vuelta
  
  let voltageDrop: number;
  let systemVoltage: number;
  
  if (panelType === "trifasico") {
    systemVoltage = 220;
    voltageDrop = Math.sqrt(3) * current * resistance * roundTripLength;
  } else if (panelType === "bifasico") {
    systemVoltage = 220;
    voltageDrop = current * resistance * roundTripLength;
  } else {
    systemVoltage = 127;
    voltageDrop = current * resistance * roundTripLength;
  }

  const percentage = (voltageDrop / systemVoltage) * 100;

  return {
    percentage,
    voltage: voltageDrop
  };
}

export function calculateGroundWire(serviceWire: string): string {
  const wireIndex = WIRE_SIZES.findIndex((w) => w.size === serviceWire);
  if (wireIndex === -1) return "14";

  // Para conductores hasta 1100 kcmil, el conductor de tierra debe ser del mismo tamaño
  // Para conductores mayores, debe ser al menos 1/0
  if (wireIndex <= WIRE_SIZES.findIndex((w) => w.size === "1100")) {
    return serviceWire;
  }
  return "1/0";
}

export function calculateLoadSchedule(
  circuits: any[],
  panelSize: number,
  voltage: number,
  temperature: number
): LoadScheduleResult {
  const result: LoadScheduleResult = {
    circuits: [],
    totalPower: 0,
    totalCurrent: 0,
    phaseBalance: {
      A: 0,
      B: 0,
      C: 0
    },
    voltageDrop: 0,
    powerLoss: 0
  };

  // Calcular corriente y balance de fases para cada circuito
  circuits.forEach(circuit => {
    const power = circuit.power * circuit.quantity;
    let current: number;
    let circuitVoltage: number;

    // Calcular corriente según el tipo de circuito
    switch (circuit.type) {
      case "monofasico":
        circuitVoltage = 127; // Voltaje fase-neutro
        current = power / (circuitVoltage * circuit.powerFactor);
        break;
      case "bifasico":
        circuitVoltage = 220; // Voltaje fase-fase
        current = power / (circuitVoltage * circuit.powerFactor);
        break;
      case "trifasico":
        circuitVoltage = 220; // Voltaje línea-línea
        current = power / (Math.sqrt(3) * circuitVoltage * circuit.powerFactor);
        break;
      default:
        circuitVoltage = 127;
        current = power / (circuitVoltage * circuit.powerFactor);
    }

    // Determinar tamaño de conductor basado en <2% caída de tensión máxima
    const wireSize = calculateWireSizeByVoltageDrop(
      current,
      circuit.length || 20,
      2.0, // Estrictamente <2% para circuitos
      circuit.type,
      circuitVoltage,
      temperature
    );
    
    // Calcular ducto recomendado para el circuito
    const recommendedConduit = calculateRecommendedConduit(wireSize, 1, circuit.type);
    
    // Determinar protección basada en corriente
    const protection = determineProtection(current);

    // Calcular caída de tensión para este circuito específico
    const circuitVoltageDrop = calculateVoltageDropForWire(current, circuit.length || 20, wireSize, circuit.type);
    
    // Calcular pérdidas de potencia para este circuito específico
    const circuitPowerLoss = calculateCircuitPowerLossForWire(current, circuit.length || 20, wireSize, circuit.type);

    // Calcular corriente al 1.25 para mostrar en tabla
    const tempCorrection = temperature > 30 ? 0.82 : 1;
    const currentWithFactor = current * 1.25 / tempCorrection;
    
    // Calcular cable de tierra (usar el mismo calibre para simplificar)
    const groundWireSize = wireSize;
    
    // Generar configuración completa del cableado
    const wireConfiguration = generateWireConfiguration(wireSize, groundWireSize, circuit.type);

    result.circuits.push({
      id: circuit.id,
      type: circuit.type,
      description: circuit.description,
      power: power,
      quantity: circuit.quantity,
      phase: circuit.phase,
      voltage: circuitVoltage, // Incluir el voltaje del circuito
      current: current,
      currentWithFactor: currentWithFactor, // Corriente al 1.25 para mostrar en tabla
      wireSize: wireSize,
      wireConfiguration: wireConfiguration, // Configuración completa del cableado
      conduitSize: recommendedConduit, // Agregar tamaño de ducto
      protection: protection,
      voltageDrop: circuitVoltageDrop * 100, // Convertir a porcentaje
      powerLoss: circuitPowerLoss
    });

    // Actualizar balance de fases (para bifásicos, distribuir en las dos fases)
    if (circuit.type === "bifasico") {
      // Los circuitos bifásicos usan dos fases
      if (circuit.phase === "A") {
        result.phaseBalance.A += current / 2;
        result.phaseBalance.B += current / 2;
      } else if (circuit.phase === "B") {
        result.phaseBalance.B += current / 2;
        result.phaseBalance.C += current / 2;
      } else {
        result.phaseBalance.C += current / 2;
        result.phaseBalance.A += current / 2;
      }
    } else if (circuit.type === "trifasico") {
      // Los circuitos trifásicos distribuyen la carga equitativamente
      result.phaseBalance.A += current / 3;
      result.phaseBalance.B += current / 3;
      result.phaseBalance.C += current / 3;
    } else {
      // Circuitos monofásicos solo en una fase
      result.phaseBalance[circuit.phase as keyof typeof result.phaseBalance] += current;
    }

    result.totalPower += power;
    result.totalCurrent += current;
  });

  // Calcular caída de tensión y pérdidas de potencia para el cuadro general
  result.voltageDrop = calculateSystemVoltageDrop(result.totalCurrent, voltage);
  result.powerLoss = calculateSystemPowerLoss(result.totalCurrent, result.voltageDrop);

  return result;
}

function determineWireSize(current: number, temperature: number): string {
  // Tabla de tamaños de conductor basada en corriente y temperatura
  const wireSizes = [
    { size: "14 AWG", maxCurrent: 15 },
    { size: "12 AWG", maxCurrent: 20 },
    { size: "10 AWG", maxCurrent: 30 },
    { size: "8 AWG", maxCurrent: 40 },
    { size: "6 AWG", maxCurrent: 55 },
    { size: "4 AWG", maxCurrent: 70 },
    { size: "3 AWG", maxCurrent: 85 },
    { size: "2 AWG", maxCurrent: 95 },
    { size: "1 AWG", maxCurrent: 110 },
    { size: "1/0 AWG", maxCurrent: 125 },
    { size: "2/0 AWG", maxCurrent: 145 },
    { size: "3/0 AWG", maxCurrent: 165 },
    { size: "4/0 AWG", maxCurrent: 195 }
  ];

  // Ajustar corriente por temperatura
  const adjustedCurrent = current * (1 + (temperature - 30) * 0.002);

  // Encontrar el tamaño de conductor adecuado
  for (const wire of wireSizes) {
    if (adjustedCurrent <= wire.maxCurrent) {
      return wire.size;
    }
  }

  return "4/0 AWG"; // Tamaño máximo en la tabla
}

function determineWireSizeWithLength(
  current: number, 
  temperature: number, 
  length: number, 
  circuitType: string
): string {
  // FUNCIÓN OBSOLETA - Usar calculateWireSizeByVoltageDrop() para nuevos criterios
  // Esta función mantiene el criterio del 2% para circuitos
  
  // Comenzar con el tamaño básico por corriente
  let wireSize = determineWireSize(current, temperature);
  
  // Verificar caída de tensión y ajustar si es necesario
  const maxVoltageDrop = 0.02; // 2% máximo permitido para circuitos
  let voltageDrop = calculateVoltageDropForWire(current, length, wireSize, circuitType);
  
  // Si la caída de tensión es excesiva, incrementar el calibre
  const wireSizes = [
    "14 AWG", "12 AWG", "10 AWG", "8 AWG", "6 AWG", "4 AWG", 
    "3 AWG", "2 AWG", "1 AWG", "1/0 AWG", "2/0 AWG", "3/0 AWG", "4/0 AWG"
  ];
  
  let wireIndex = wireSizes.indexOf(wireSize);
  
  while (voltageDrop > maxVoltageDrop && wireIndex < wireSizes.length - 1) {
    wireIndex++;
    wireSize = wireSizes[wireIndex];
    voltageDrop = calculateVoltageDropForWire(current, length, wireSize, circuitType);
  }
  
  return wireSize;
}

function calculateVoltageDropForWire(
  current: number, 
  length: number, 
  wireSize: string, 
  circuitType: string
): number {
  const resistance = getWireResistance(wireSize); // ohms/km
  const lengthKm = length / 1000; // Convertir metros a kilómetros
  const roundTripLength = lengthKm * 2; // Ida y vuelta
  
  let voltageDrop: number;
  const voltage = circuitType === "monofasico" ? 127 : 220;
  
  if (circuitType === "trifasico") {
    voltageDrop = (Math.sqrt(3) * current * resistance * roundTripLength) / voltage;
  } else {
    voltageDrop = (current * resistance * roundTripLength) / voltage;
  }
  
  return voltageDrop;
}

function determineProtection(current: number): string {
  // Tabla de protecciones estándar
  const protections = [15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];

  // Encontrar la protección adecuada
  for (const protection of protections) {
    if (current <= protection) {
      return `${protection}A`;
    }
  }

  return "200A"; // Protección máxima en la tabla
}

function calculateSystemVoltageDrop(current: number, voltage: number): number {
  // Calcular caída de tensión aproximada para el sistema general
  // Asumimos una longitud de cable de 100m y resistencia de 0.1 ohm/km
  const length = 100; // metros
  const resistance = 0.1; // ohm/km
  return (current * length * resistance) / 1000;
}

function calculateSystemPowerLoss(current: number, voltageDrop: number): number {
  // Calcular pérdidas de potencia para el sistema general
  return current * voltageDrop;
}

// Nueva función para calcular pérdidas de potencia de un circuito específico
function calculateCircuitPowerLossForWire(
  current: number, 
  length: number, 
  wireSize: string, 
  circuitType: string
): number {
  const resistance = getWireResistance(wireSize); // ohms/km
  const lengthKm = length / 1000; // Convertir metros a kilómetros
  const roundTripLength = lengthKm * 2; // Ida y vuelta
  
  let powerLoss: number;
  
  if (circuitType === "trifasico") {
    powerLoss = 3 * Math.pow(current, 2) * resistance * roundTripLength;
  } else {
    powerLoss = Math.pow(current, 2) * resistance * roundTripLength;
  }
  
  return powerLoss;
}

// Nueva función para calcular calibre basado en caída de tensión específica
export function calculateWireSizeByVoltageDrop(
  current: number,
  length: number,
  maxVoltageDropPercent: number,
  circuitType: "monofasico" | "bifasico" | "trifasico",
  systemVoltage: number,
  temperature: number = 30
): string {
  // Factor de corrección por temperatura
  const tempCorrection = temperature > 30 ? 0.82 : 1;
  
  // Aplicar factor de seguridad del 125%
  const adjustedCurrent = current * 1.25 / tempCorrection;
  
  // Probar cada calibre hasta encontrar uno que cumpla con la caída de tensión
  for (const wire of WIRE_SIZES) {
    // Calcular caída de tensión para este calibre PRIMERO
    const resistance = wire.resistance / 1000; // Convertir a ohms/metro
    const roundTripLength = length * 2; // Ida y vuelta
    
    let voltageDrop: number;
    if (circuitType === "trifasico") {
      voltageDrop = Math.sqrt(3) * current * resistance * roundTripLength;
    } else {
      voltageDrop = current * resistance * roundTripLength;
    }
    
    const percentageDrop = (voltageDrop / systemVoltage) * 100;
    
    // Definir criterio según el límite establecido
    let meetsCriteria = false;
    if (maxVoltageDropPercent === 1.0) {
      // Para acometida: menor o igual al 1%
      meetsCriteria = percentageDrop <= 1.0;
    } else {
      // Para circuitos: estrictamente menor al 2%
      meetsCriteria = percentageDrop < 2.0;
    }
    
    // Verificar que también pueda manejar la corriente y que cumpla caída de tensión
    if (meetsCriteria && wire.ampacity >= adjustedCurrent) {
      return wire.size;
    }
  }
  
  // Si ningún calibre estándar funciona, retornar el más grande disponible
  return WIRE_SIZES[WIRE_SIZES.length - 1].size;
}

// Nueva función para calcular el ducto recomendado
export function calculateRecommendedConduit(
  wireSize: string,
  numberOfWires: number,
  circuitType: "monofasico" | "bifasico" | "trifasico"
): string {
  // Para circuitos individuales, determinar número total de conductores
  let totalConductors: number;
  if (circuitType === "monofasico") {
    totalConductors = 3; // 1 Fase + 1 Neutro + 1 Tierra
  } else if (circuitType === "bifasico") {
    totalConductors = 3; // 2 Fases + 1 Tierra (sin neutro)
  } else {
    totalConductors = 4; // 3 Fases + 1 Tierra (sin neutro)
  }
  
  // Obtener diámetro del cable (todos los conductores usan el mismo calibre)
  const cableDiameter = CABLE_DIAMETERS[wireSize] || 3.30;
  
  // Calcular área total de cables
  const cableArea = Math.PI * Math.pow(cableDiameter / 2, 2);
  const totalCableArea = cableArea * totalConductors;
  
  // Factor de llenado máximo (40% para más de 2 conductores)
  const fillFactor = 0.40;
  
  // Área mínima requerida del ducto
  const requiredConduitArea = totalCableArea / fillFactor;
  
  // Encontrar el ducto más pequeño que cumpla
  for (const conduit of CONDUIT_SIZES) {
    const conduitArea = Math.PI * Math.pow(conduit.diameterMM / 2, 2);
    if (conduitArea >= requiredConduitArea) {
      return conduit.name;
    }
  }
  
  // Si ningún ducto estándar es suficiente, retornar el más grande
  return "6\"";
}

// Función mejorada para calcular acometida con criterio de 1% caída de tensión
export function calculateServiceWireImproved(
  totalPower: number,
  panelType: "monofasico" | "bifasico" | "trifasico",
  serviceLength: number,
  ambientTemp: number
): string {
  let systemVoltage: number;
  let current: number;
  
  // Calcular corriente según el tipo de sistema (usar valores línea-línea para cálculos de caída)
  switch (panelType) {
    case "monofasico":
      systemVoltage = 127; // Voltaje fase-neutro
      current = totalPower / (systemVoltage * 0.9); // Factor de potencia promedio 0.9
      break;
    case "bifasico":
      systemVoltage = 220; // Voltaje línea-línea
      current = totalPower / (systemVoltage * 0.9);
      break;
    case "trifasico":
      systemVoltage = 220; // Voltaje línea-línea
      current = totalPower / (Math.sqrt(3) * systemVoltage * 0.9);
      break;
    default:
      systemVoltage = 127;
      current = totalPower / (systemVoltage * 0.9);
  }

  // Calcular calibre basado en 1% de caída de tensión máxima (<=1%)
  return calculateWireSizeByVoltageDrop(
    current,
    serviceLength,
    1.0, // 1% máximo para acometida
    panelType,
    systemVoltage,
    ambientTemp
  );
}

// Función para calcular ducto de acometida
export function calculateServiceConduit(
  serviceWireSize: string,
  panelType: "monofasico" | "bifasico" | "trifasico"
): string {
  return calculateRecommendedConduit(serviceWireSize, 1, panelType);
}

// Función para generar la configuración completa del cableado
export function generateWireConfiguration(
  wireSize: string,
  groundWireSize: string,
  circuitType: "monofasico" | "bifasico" | "trifasico"
): string {
  if (circuitType === "monofasico") {
    // Siempre requiere neutro
    return `1F#${wireSize}+1N#${wireSize}+1T#${groundWireSize}`;
  } else if (circuitType === "bifasico") {
    // 2 fases + tierra (sin neutro por defecto)
    return `2F#${wireSize}+1T#${groundWireSize}`;
  } else {
    // 3 fases + tierra (sin neutro)
    return `3F#${wireSize}+1T#${groundWireSize}`;
  }
} 