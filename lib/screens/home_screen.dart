import 'package:flutter/material.dart';
import '../l10n/app_localizations.dart';
import 'current_power_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text(localizations?.appTitle ?? 'Electrical Calculators'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.language),
            onPressed: () {
              // TODO: Implement language switcher
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            _CalculatorCard(
              title: localizations?.currentPowerCalculator ?? 'Current and Power Calculator',
              icon: Icons.flash_on,
              color: Colors.blue,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const CurrentPowerScreen(),
                  ),
                );
              },
            ),
            _CalculatorCard(
              title: localizations?.voltageDrop ?? 'Voltage Drop Calculator',
              icon: Icons.trending_down,
              color: Colors.orange,
              onTap: () {
                // TODO: Implement voltage drop calculator
                _showComingSoon(context, localizations?.voltageDrop ?? 'Voltage Drop Calculator');
              },
            ),
            _CalculatorCard(
              title: localizations?.cableSizing ?? 'Cable Sizing Calculator',
              icon: Icons.cable,
              color: Colors.green,
              onTap: () {
                // TODO: Implement cable sizing calculator
                _showComingSoon(context, localizations?.cableSizing ?? 'Cable Sizing Calculator');
              },
            ),
            _CalculatorCard(
              title: localizations?.conduitSizing ?? 'Conduit Sizing Calculator',
              icon: Icons.architecture,
              color: Colors.purple,
              onTap: () {
                // TODO: Implement conduit sizing calculator
                _showComingSoon(context, localizations?.conduitSizing ?? 'Conduit Sizing Calculator');
              },
            ),
            _CalculatorCard(
              title: localizations?.cableCalculator ?? 'Cable Calculator',
              icon: Icons.electric_bolt,
              color: Colors.red,
              onTap: () {
                // TODO: Implement cable calculator
                _showComingSoon(context, localizations?.cableCalculator ?? 'Cable Calculator');
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showComingSoon(BuildContext context, String calculatorName) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Coming Soon'),
        content: Text('$calculatorName will be available in the next update.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}

class _CalculatorCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _CalculatorCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withOpacity(0.1),
                color.withOpacity(0.2),
              ],
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: color,
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
} 