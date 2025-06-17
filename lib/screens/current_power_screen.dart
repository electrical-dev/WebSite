import 'package:flutter/material.dart';
import '../calculators/current_power_calculator.dart';
import '../l10n/app_localizations.dart';

class CurrentPowerScreen extends StatefulWidget {
  const CurrentPowerScreen({super.key});

  @override
  State<CurrentPowerScreen> createState() => _CurrentPowerScreenState();
}

class _CurrentPowerScreenState extends State<CurrentPowerScreen> {
  final _formKey = GlobalKey<FormState>();
  final _voltageController = TextEditingController();
  final _currentController = TextEditingController();
  final _powerController = TextEditingController();
  final _powerFactorController = TextEditingController(text: '0.9');

  String _powerUnit = 'kw';
  bool _isThreePhase = true;
  String? _result;
  String? _errorMessage;

  @override
  void dispose() {
    _voltageController.dispose();
    _currentController.dispose();
    _powerController.dispose();
    _powerFactorController.dispose();
    super.dispose();
  }

  void _calculatePower() {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final voltage = double.tryParse(_voltageController.text);
    final current = double.tryParse(_currentController.text);
    final powerFactor = double.tryParse(_powerFactorController.text);

    if (voltage == null || current == null || powerFactor == null) {
      setState(() {
        _errorMessage = AppLocalizations.of(context)?.missingFieldsForPower ?? 'Missing fields';
        _result = null;
      });
      return;
    }

    final result = CurrentPowerCalculator.calculatePower(
      voltage: voltage,
      current: current,
      powerFactor: powerFactor,
      isThreePhase: _isThreePhase,
      powerUnit: _powerUnit,
    );

    setState(() {
      if (result['success'] == true) {
        _powerController.text = result['power'].toString();
        _result = 'Power calculated: ${result['power']} ${_powerUnit.toUpperCase()}';
        _errorMessage = null;
      } else {
        _errorMessage = result['error'];
        _result = null;
      }
    });
  }

  void _calculateCurrent() {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final voltage = double.tryParse(_voltageController.text);
    final power = double.tryParse(_powerController.text);
    final powerFactor = double.tryParse(_powerFactorController.text);

    if (voltage == null || power == null || powerFactor == null) {
      setState(() {
        _errorMessage = AppLocalizations.of(context)?.missingFieldsForCurrent ?? 'Missing fields';
        _result = null;
      });
      return;
    }

    final result = CurrentPowerCalculator.calculateCurrent(
      voltage: voltage,
      power: power,
      powerFactor: powerFactor,
      isThreePhase: _isThreePhase,
      powerUnit: _powerUnit,
    );

    setState(() {
      if (result['success'] == true) {
        _currentController.text = result['nominalCurrent'].toString();
        _result = '''
Nominal Current: ${result['nominalCurrent']} A
Design Current: ${result['designCurrent']} A
${AppLocalizations.of(context)?.designNote ?? 'Design current is 1.25 times the nominal current'}
        ''';
        _errorMessage = null;
      } else {
        _errorMessage = result['error'];
        _result = null;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text(localizations?.currentPowerCalculator ?? 'Current and Power Calculator'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        // Voltage Input
                        TextFormField(
                          controller: _voltageController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: localizations?.voltage ?? 'Voltage (V) *',
                            helperText: localizations?.voltageHelp ?? 'Ex: 120, 220, 380, 480',
                            border: const OutlineInputBorder(),
                          ),
                          validator: CurrentPowerCalculator.validateVoltage,
                        ),
                        const SizedBox(height: 16),

                        // Current Input
                        TextFormField(
                          controller: _currentController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: localizations?.current ?? 'Current (A)',
                            border: const OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Power Input
                        TextFormField(
                          controller: _powerController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: localizations?.power ?? 'Power *',
                            helperText: localizations?.powerHelp ?? 'For motors typically 0.75-15 kW or 1-20 HP',
                            border: const OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Power Unit Dropdown
                        DropdownButtonFormField<String>(
                          value: _powerUnit,
                          decoration: InputDecoration(
                            labelText: localizations?.powerUnit ?? 'Power Unit',
                            border: const OutlineInputBorder(),
                          ),
                          items: [
                            DropdownMenuItem(
                              value: 'kw',
                              child: Text(localizations?.kw ?? 'Kilowatts (kW)'),
                            ),
                            DropdownMenuItem(
                              value: 'hp',
                              child: Text(localizations?.hp ?? 'Horsepower (HP)'),
                            ),
                          ],
                          onChanged: (value) {
                            setState(() {
                              _powerUnit = value!;
                            });
                          },
                        ),
                        const SizedBox(height: 16),

                        // Power Factor Input
                        TextFormField(
                          controller: _powerFactorController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: localizations?.powerFactor ?? 'Power Factor',
                            helperText: localizations?.powerFactorHelp ?? 'Valid range: 0.1 - 1.0',
                            border: const OutlineInputBorder(),
                          ),
                          validator: CurrentPowerCalculator.validatePowerFactor,
                        ),
                        const SizedBox(height: 16),

                        // System Type Switch
                        SwitchListTile(
                          title: Text(localizations?.system ?? 'System'),
                          subtitle: Text(_isThreePhase 
                              ? (localizations?.threePhase ?? 'Three Phase')
                              : (localizations?.singlePhase ?? 'Single Phase')),
                          value: _isThreePhase,
                          onChanged: (value) {
                            setState(() {
                              _isThreePhase = value;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Calculate Buttons
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _calculatePower,
                        icon: const Icon(Icons.flash_on),
                        label: Text(localizations?.calculatePower ?? 'Calculate Power'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _calculateCurrent,
                        icon: const Icon(Icons.electric_bolt),
                        label: Text(localizations?.calculateCurrent ?? 'Calculate Current'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Results Section
                if (_result != null)
                  Card(
                    color: Colors.green.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.check_circle, color: Colors.green),
                          const SizedBox(height: 8),
                          Text(
                            _result!,
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                        ],
                      ),
                    ),
                  ),

                // Error Section
                if (_errorMessage != null)
                  Card(
                    color: Colors.red.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.error, color: Colors.red),
                          const SizedBox(height: 8),
                          Text(
                            _errorMessage!,
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: Colors.red.shade700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
} 