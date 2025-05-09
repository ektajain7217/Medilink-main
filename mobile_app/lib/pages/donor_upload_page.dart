import 'package:flutter/material.dart';
import 'package:barcode_scan2/barcode_scan2.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DonorUploadPage extends StatefulWidget {
  const DonorUploadPage({super.key});

  @override
  _DonorUploadPageState createState() => _DonorUploadPageState();
}

class _DonorUploadPageState extends State<DonorUploadPage> {
  String barcode = '';
  final _formKey = GlobalKey<FormState>();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController quantityController = TextEditingController();
  final TextEditingController expiryController = TextEditingController();
  final TextEditingController conditionController = TextEditingController();

  Future<void> scanBarcode() async {
    try {
      var result = await BarcodeScanner.scan();
      setState(() {
        barcode = result.rawContent;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Barcode scan failed: $e')),
      );
    }
  }

  Future<void> submitForm() async {
    if (_formKey.currentState!.validate()) {
      final medicineData = {
        'name': nameController.text.trim(),
        'barcode': barcode,
        'quantity': quantityController.text.trim(),
        'expiry': expiryController.text.trim(),
        'condition': conditionController.text.trim(),
      };

      try {
        final response = await http.post(
          Uri.parse('http://10.0.2.2:5000/api/medicines'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(medicineData),
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('✅ Medicine uploaded successfully')),
          );

          nameController.clear();
          quantityController.clear();
          expiryController.clear();
          conditionController.clear();
          setState(() => barcode = '');
        } else {
          final responseBody = jsonDecode(response.body);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('❌ Failed: ${responseBody['message']}')),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('⚠️ Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Upload Medicine')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: nameController,
                decoration: InputDecoration(labelText: 'Medicine Name'),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: scanBarcode,
                icon: Icon(Icons.qr_code_scanner),
                label: Text('Scan Barcode'),
              ),
              SizedBox(height: 8),
              Text(
                barcode.isNotEmpty ? 'Scanned: $barcode' : 'No barcode scanned',
                style: TextStyle(fontStyle: FontStyle.italic),
              ),
              SizedBox(height: 12),
              TextFormField(
                controller: quantityController,
                decoration: InputDecoration(labelText: 'Quantity'),
                keyboardType: TextInputType.number,
                validator: (value) =>
                    value == null || value.isEmpty ? 'Required' : null,
              ),
              SizedBox(height: 12),
              TextFormField(
                controller: expiryController,
                decoration: InputDecoration(labelText: 'Expiry Date (YYYY-MM-DD)'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Required' : null,
              ),
              SizedBox(height: 12),
              TextFormField(
                controller: conditionController,
                decoration: InputDecoration(labelText: 'Condition (e.g., sealed, opened)'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Required' : null,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: submitForm,
                child: Text('Submit'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
