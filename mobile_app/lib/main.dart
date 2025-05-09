import 'package:flutter/material.dart';
import 'ocr_screen.dart'; // OCR scanner page
import 'screens/donate_medicine_screen.dart'; // This should be your final donor upload form

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Medilink',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      // ✅ Register routes here
      routes: {
        '/donate': (context) => const DonateMedicineScreen(),
      },
      home: const MyHomePage(title: 'Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  void _navigateToOCR() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => OcrScreen()),
    );
  }

  void _navigateToDonorUpload() {
    Navigator.pushNamed(context, '/donate');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text('You have pushed the button this many times:'),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _navigateToOCR,
              child: const Text('Go to OCR Scanner'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: _navigateToDonorUpload,
              child: const Text('Donate Medicine'),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
