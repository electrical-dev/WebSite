import 'dart:math';

class CurrentPowerCalculator {
  // Conversion factor from HP to kW
  static const double hpToKw = 0.746;

  // Calculation result model
  static Map<String, dynamic> calculatePower({
    required double voltage,
    required double current,
    required double powerFactor,
    required bool isThreePhase,
    required String powerUnit,
  }) {
    try {
      // Validate inputs
      if (voltage <= 0) {
        return {'error': 'Voltage must be greater than 0'};
      }
      if (current <= 0) {
        return {'error': 'Current must be greater than 0'};
      }
      if (powerFactor < 0.1 || powerFactor > 1.0) {
        return {'error': 'Power factor must be between 0.1 and 1.0'};
      }

      // Calculate power in kW
      double powerInKw;
      if (isThreePhase) {
        powerInKw = sqrt(3) * voltage * current * powerFactor / 1000;
      } else {
        powerInKw = voltage * current * powerFactor / 1000;
      }

      // Convert to HP if necessary
      double finalPower;
      if (powerUnit == 'hp') {
        finalPower = powerInKw / hpToKw;
      } else {
        finalPower = powerInKw;
      }

      return {
        'success': true,
        'power': double.parse(finalPower.toStringAsFixed(2)),
        'powerInKw': double.parse(powerInKw.toStringAsFixed(2)),
      };
    } catch (e) {
      return {'error': 'Calculation error: ${e.toString()}'};
    }
  }

  static Map<String, dynamic> calculateCurrent({
    required double voltage,
    required double power,
    required double powerFactor,
    required bool isThreePhase,
    required String powerUnit,
  }) {
    try {
      // Validate inputs
      if (voltage <= 0) {
        return {'error': 'Voltage must be greater than 0'};
      }
      if (power <= 0) {
        return {'error': 'Power must be greater than 0'};
      }
      if (powerFactor < 0.1 || powerFactor > 1.0) {
        return {'error': 'Power factor must be between 0.1 and 1.0'};
      }

      // Convert HP to kW if necessary
      double powerInKw = power;
      if (powerUnit == 'hp') {
        powerInKw = power * hpToKw;
      }

      // Calculate current
      double nominalCurrent;
      if (isThreePhase) {
        nominalCurrent = (powerInKw * 1000) / (sqrt(3) * voltage * powerFactor);
      } else {
        nominalCurrent = (powerInKw * 1000) / (voltage * powerFactor);
      }

      // Calculate design current (1.25 times nominal)
      double designCurrent = nominalCurrent * 1.25;

      return {
        'success': true,
        'nominalCurrent': double.parse(nominalCurrent.toStringAsFixed(2)),
        'designCurrent': double.parse(designCurrent.toStringAsFixed(2)),
      };
    } catch (e) {
      return {'error': 'Calculation error: ${e.toString()}'};
    }
  }

  // Validation methods
  static String? validateVoltage(String? value) {
    if (value == null || value.isEmpty) {
      return 'Required field';
    }
    final voltage = double.tryParse(value);
    if (voltage == null || voltage <= 0) {
      return 'Voltage must be greater than 0';
    }
    return null;
  }

  static String? validateCurrent(String? value) {
    if (value == null || value.isEmpty) {
      return 'Required field';
    }
    final current = double.tryParse(value);
    if (current == null || current <= 0) {
      return 'Current must be greater than 0';
    }
    return null;
  }

  static String? validatePower(String? value) {
    if (value == null || value.isEmpty) {
      return 'Required field';
    }
    final power = double.tryParse(value);
    if (power == null || power <= 0) {
      return 'Power must be greater than 0';
    }
    return null;
  }

  static String? validatePowerFactor(String? value) {
    if (value == null || value.isEmpty) {
      return 'Required field';
    }
    final powerFactor = double.tryParse(value);
    if (powerFactor == null || powerFactor < 0.1 || powerFactor > 1.0) {
      return 'Power factor must be between 0.1 and 1.0';
    }
    return null;
  }
} 