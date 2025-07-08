import 'package:flutter/material.dart';

class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const _localizedValues = <String, Map<String, String>>{
    'en': {
      'appTitle': 'Electrical Calculators',
      'currentPowerCalculator': 'Current and Power Calculator',
      'voltageDrop': 'Voltage Drop Calculator',
      'cableSizing': 'Cable Sizing Calculator',
      'conduitSizing': 'Conduit Sizing Calculator',
      'cableCalculator': 'Cable Calculator',
      'voltage': 'Voltage (V) *',
      'current': 'Current (A)',
      'nominalCurrent': 'Nominal Current (A)',
      'designCurrent': 'Design Current (A)',
      'power': 'Power *',
      'powerUnit': 'Power Unit',
      'kw': 'Kilowatts (kW)',
      'hp': 'Horsepower (HP)',
      'powerValue': 'Power Value',
      'powerFactor': 'Power Factor',
      'system': 'System',
      'singlePhase': 'Single Phase',
      'threePhase': 'Three Phase',
      'calculatePower': 'Calculate Power',
      'calculateCurrent': 'Calculate Current',
      'designNote': 'Design current is 1.25 times the nominal current',
      'requiredField': 'Required field',
      'invalidVoltage': 'Voltage must be greater than 0',
      'invalidCurrent': 'Current must be greater than 0',
      'invalidPower': 'Power must be greater than 0',
      'invalidPowerFactor': 'Power factor must be between 0.1 and 1.0',
      'voltageHelp': 'Ex: 120, 220, 380, 480',
      'powerFactorHelp': 'Valid range: 0.1 - 1.0',
      'powerHelp': 'For motors typically 0.75-15 kW or 1-20 HP',
      'missingFieldsForPower': 'To calculate power you need: voltage, current and power factor',
      'missingFieldsForCurrent': 'To calculate current you need: voltage, power and power factor',
    },
    'es': {
      'appTitle': 'Calculadoras Eléctricas',
      'currentPowerCalculator': 'Calculadora de Corriente y Potencia',
      'voltageDrop': 'Calculadora de Caída de Tensión',
      'cableSizing': 'Calculadora de Dimensionado de Cables',
      'conduitSizing': 'Calculadora de Dimensionado de Conductos',
      'cableCalculator': 'Calculadora de Cables',
      'voltage': 'Tensión (V) *',
      'current': 'Corriente (A)',
      'nominalCurrent': 'Corriente Nominal (A)',
      'designCurrent': 'Corriente de Diseño (A)',
      'power': 'Potencia *',
      'powerUnit': 'Unidad de Potencia',
      'kw': 'Kilowatts (kW)',
      'hp': 'Caballos de Fuerza (HP)',
      'powerValue': 'Valor de Potencia',
      'powerFactor': 'Factor de Potencia',
      'system': 'Sistema',
      'singlePhase': 'Monofásico',
      'threePhase': 'Trifásico',
      'calculatePower': 'Calcular Potencia',
      'calculateCurrent': 'Calcular Corriente',
      'designNote': 'La corriente de diseño es 1.25 veces la corriente nominal',
      'requiredField': 'Campo obligatorio',
      'invalidVoltage': 'La tensión debe ser mayor a 0',
      'invalidCurrent': 'La corriente debe ser mayor a 0',
      'invalidPower': 'La potencia debe ser mayor a 0',
      'invalidPowerFactor': 'El factor de potencia debe estar entre 0.1 y 1.0',
      'voltageHelp': 'Ej: 120, 220, 380, 480',
      'powerFactorHelp': 'Rango válido: 0.1 - 1.0',
      'powerHelp': 'Para motores típicamente 0.75-15 kW o 1-20 HP',
      'missingFieldsForPower': 'Para calcular potencia necesitas: tensión, corriente y factor de potencia',
      'missingFieldsForCurrent': 'Para calcular corriente necesitas: tensión, potencia y factor de potencia',
    },
  };

  String get appTitle => _localizedValues[locale.languageCode]!['appTitle']!;
  String get currentPowerCalculator => _localizedValues[locale.languageCode]!['currentPowerCalculator']!;
  String get voltageDrop => _localizedValues[locale.languageCode]!['voltageDrop']!;
  String get cableSizing => _localizedValues[locale.languageCode]!['cableSizing']!;
  String get conduitSizing => _localizedValues[locale.languageCode]!['conduitSizing']!;
  String get cableCalculator => _localizedValues[locale.languageCode]!['cableCalculator']!;
  String get voltage => _localizedValues[locale.languageCode]!['voltage']!;
  String get current => _localizedValues[locale.languageCode]!['current']!;
  String get nominalCurrent => _localizedValues[locale.languageCode]!['nominalCurrent']!;
  String get designCurrent => _localizedValues[locale.languageCode]!['designCurrent']!;
  String get power => _localizedValues[locale.languageCode]!['power']!;
  String get powerUnit => _localizedValues[locale.languageCode]!['powerUnit']!;
  String get kw => _localizedValues[locale.languageCode]!['kw']!;
  String get hp => _localizedValues[locale.languageCode]!['hp']!;
  String get powerValue => _localizedValues[locale.languageCode]!['powerValue']!;
  String get powerFactor => _localizedValues[locale.languageCode]!['powerFactor']!;
  String get system => _localizedValues[locale.languageCode]!['system']!;
  String get singlePhase => _localizedValues[locale.languageCode]!['singlePhase']!;
  String get threePhase => _localizedValues[locale.languageCode]!['threePhase']!;
  String get calculatePower => _localizedValues[locale.languageCode]!['calculatePower']!;
  String get calculateCurrent => _localizedValues[locale.languageCode]!['calculateCurrent']!;
  String get designNote => _localizedValues[locale.languageCode]!['designNote']!;
  String get requiredField => _localizedValues[locale.languageCode]!['requiredField']!;
  String get invalidVoltage => _localizedValues[locale.languageCode]!['invalidVoltage']!;
  String get invalidCurrent => _localizedValues[locale.languageCode]!['invalidCurrent']!;
  String get invalidPower => _localizedValues[locale.languageCode]!['invalidPower']!;
  String get invalidPowerFactor => _localizedValues[locale.languageCode]!['invalidPowerFactor']!;
  String get voltageHelp => _localizedValues[locale.languageCode]!['voltageHelp']!;
  String get powerFactorHelp => _localizedValues[locale.languageCode]!['powerFactorHelp']!;
  String get powerHelp => _localizedValues[locale.languageCode]!['powerHelp']!;
  String get missingFieldsForPower => _localizedValues[locale.languageCode]!['missingFieldsForPower']!;
  String get missingFieldsForCurrent => _localizedValues[locale.languageCode]!['missingFieldsForCurrent']!;
}

class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'es'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(AppLocalizationsDelegate old) => false;
} 