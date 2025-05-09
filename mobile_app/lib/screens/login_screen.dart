import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool isLoading = false;
  String? errorMessage;

  Future<void> login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    final url = Uri.parse('http://127.0.0.1:5000/login'); // Replace with real endpoint

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': emailController.text.trim(),
          'password': passwordController.text.trim(),
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token'];
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Login successful! Token: $token")),
        );
        // TODO: Navigate or store token securely
      } else {
        setState(() {
          errorMessage = jsonDecode(response.body)['message'] ?? 'Login failed';
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Server error. Please try again.';
      });
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isWide = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      backgroundColor: const Color(0xfff3f4f6),
      body: Center(
        child: Container(
          width: isWide ? 1000 : double.infinity,
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: const [
              BoxShadow(color: Colors.black12, blurRadius: 10),
            ],
          ),
          child: isWide
              ? Row(
                  children: [
                    _buildLeftPanel(),
                    const SizedBox(width: 24),
                    Expanded(child: _buildRightPanel(context)),
                  ],
                )
              : SingleChildScrollView(
                  child: Column(
                    children: [
                      _buildLeftPanel(),
                      const SizedBox(height: 24),
                      _buildRightPanel(context),
                    ],
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildLeftPanel() {
    return Expanded(
      flex: 1,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF0066d6),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("MediLink", style: TextStyle(fontSize: 26, color: Colors.white)),
            SizedBox(height: 12),
            Text("Your Health, Our Priority",
                style: TextStyle(fontSize: 18, color: Colors.white70)),
            SizedBox(height: 20),
            Text(
              "Access your medical records, appointments, and healthcare services securely in one place.",
              style: TextStyle(fontSize: 14, color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRightPanel(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Welcome Back", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          const Text("Please sign in to access your account", style: TextStyle(fontSize: 14)),
          const SizedBox(height: 20),

          TextFormField(
            controller: emailController,
            decoration: const InputDecoration(labelText: "Email"),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty || !value.contains('@')) {
                return 'Please enter a valid email';
              }
              return null;
            },
          ),
          const SizedBox(height: 10),

          TextFormField(
            controller: passwordController,
            obscureText: true,
            decoration: const InputDecoration(labelText: "Password"),
            validator: (value) {
              if (value == null || value.length < 6) {
                return 'Password must be at least 6 characters';
              }
              return null;
            },
          ),
          const SizedBox(height: 10),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(children: const [
                Checkbox(value: false, onChanged: null),
                Text("Remember me for 30 days", style: TextStyle(fontSize: 12)),
              ]),
              TextButton(onPressed: () {}, child: const Text("Forgot password?", style: TextStyle(fontSize: 12))),
            ],
          ),

          if (errorMessage != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Text(errorMessage!, style: const TextStyle(color: Colors.red)),
            ),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: isLoading ? null : login,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0066d6),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text("Sign In", style: TextStyle(fontSize: 16)),
            ),
          ),

          const SizedBox(height: 16),
          const Center(child: Text("Don't have an account? Contact your administrator", style: TextStyle(fontSize: 13))),
          const SizedBox(height: 16),
          const Center(child: Text("Or continue with", style: TextStyle(fontSize: 13, color: Colors.grey))),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _socialButton("Google", "https://img.icons8.com/color/48/000000/google-logo.png"),
              const SizedBox(width: 20),
              _socialButton("SSO", "https://img.icons8.com/ios-filled/50/000000/login-rounded.png"),
            ],
          )
        ],
      ),
    );
  }

  Widget _socialButton(String text, String iconUrl) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Image.network(iconUrl, width: 16, height: 16),
          const SizedBox(width: 8),
          Text(text),
        ],
      ),
    );
  }
}
