import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

class OcrScreen extends StatefulWidget {
  const OcrScreen({super.key});

  @override
  _OcrScreenState createState() => _OcrScreenState();
}

class _OcrScreenState extends State<OcrScreen> {
  File? _image;
  String _extractedText = '';
  bool _loading = false;

  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
        _extractedText = '';
      });
      await _uploadImage(File(pickedFile.path));
    }
  }

  Future<void> _uploadImage(File imageFile) async {
    setState(() {
      _loading = true;
    });

    final request = http.MultipartRequest(
      'POST',
      Uri.parse('http://10.0.2.2:5000/api/ocr'), // Use 10.0.2.2 for localhost on Android emulator
    );
    request.files.add(await http.MultipartFile.fromPath('image', imageFile.path));

    try {
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _extractedText = data['text'] ?? 'No text found.';
        });
      } else {
        setState(() {
          _extractedText = 'Failed to process image.';
        });
      }
    } catch (e) {
      setState(() {
        _extractedText = 'Error: $e';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('OCR Scanner')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: _pickImage,
              child: Text('Pick Image for OCR'),
            ),
            SizedBox(height: 20),
            _image != null
                ? Image.file(_image!, height: 200)
                : Text('No image selected'),
            SizedBox(height: 20),
            _loading ? CircularProgressIndicator() : Text(_extractedText),
          ],
        ),
      ),
    );
  }
}
