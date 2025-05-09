import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';


class DonateMedicineScreen extends StatefulWidget {
  const DonateMedicineScreen({Key? key}) : super(key: key);

  @override
  _DonateMedicineScreenState createState() => _DonateMedicineScreenState();
}

class _DonateMedicineScreenState extends State<DonateMedicineScreen> {
  final _formKey = GlobalKey<FormState>();
  String name = '';
  int quantity = 1;
  String expiryDate = '';
  String condition = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Donate Medicine"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: 'Medicine Name'),
                validator: (val) => val == null || val.isEmpty ? 'Enter name' : null,
                onSaved: (val) => name = val ?? '',
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Quantity'),
                keyboardType: TextInputType.number,
                validator: (val) => val == null || int.tryParse(val) == null ? 'Enter a valid number' : null,
                onSaved: (val) => quantity = int.parse(val!),
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Expiry Date (YYYY-MM-DD)'),
                validator: (val) => val == null || val.isEmpty ? 'Enter expiry date' : null,
                onSaved: (val) => expiryDate = val ?? '',
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Condition'),
                validator: (val) => val == null || val.isEmpty ? 'Enter condition' : null,
                onSaved: (val) => condition = val ?? '',
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _submitForm,
                child: const Text('Submit'),
              ),
            ],
          ),
        ),
      ),
    );
  }

 void _submitForm() async {
  if (_formKey.currentState?.validate() ?? false) {
    _formKey.currentState?.save();

    final Map<String, dynamic> medicineData = {
      'name': name,
      'quantity': quantity,
      'expiry_date': expiryDate,
      'condition': condition,
      'donor_id': 'test_donor_123' // TODO: Replace with actual logged-in user ID
    };

    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:5000/api/medicines'), // use 10.0.2.2 for Android emulator
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(medicineData),
      );

      if (response.statusCode == 201) {
        final responseData = jsonDecode(response.body);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Medicine donated successfully!')),
        );
        print('📦 Response: $responseData');
      } else {
        print('❌ Error: ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ Error: ${response.body}')),
        );
      }
    } catch (e) {
      print('❌ Exception: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ Exception: $e')),
      );
    }
  }
}

}
