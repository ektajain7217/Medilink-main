import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'dart:io';
import '../theme/app_theme.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DonateMedicineScreen extends StatefulWidget {
  const DonateMedicineScreen({super.key});

  @override
  State<DonateMedicineScreen> createState() => _DonateMedicineScreenState();
}

class _DonateMedicineScreenState extends State<DonateMedicineScreen> with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController brandController = TextEditingController();
  final TextEditingController quantityController = TextEditingController();
  final TextEditingController batchNumberController = TextEditingController();
  final TextEditingController dosageController = TextEditingController();
  
  DateTime? selectedExpiryDate;
  String selectedCondition = 'good';
  String selectedUnit = 'tablets';
  String selectedDosageForm = 'tablet';
  File? selectedImage;
  bool isLoading = false;
  int currentStep = 0;
  
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  final List<String> conditions = ['excellent', 'good', 'fair', 'poor'];
  final List<String> units = ['tablets', 'capsules', 'bottles', 'strips', 'vials', 'tubes', 'sachets'];
  final List<String> dosageForms = ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment', 'drops', 'inhaler'];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.2),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    ));
    
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    nameController.dispose();
    brandController.dispose();
    quantityController.dispose();
    batchNumberController.dispose();
    dosageController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.camera);
    
    if (image != null) {
      setState(() {
        selectedImage = File(image.path);
      });
    }
  }

  Future<void> _selectExpiryDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 30)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
    );
    
    if (picked != null) {
      setState(() {
        selectedExpiryDate = picked;
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    if (selectedExpiryDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select expiry date')),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    final Map<String, dynamic> medicineData = {
      'name': nameController.text.trim(),
      'brand': brandController.text.trim(),
      'batch_number': batchNumberController.text.trim(),
      'expiry_date': DateFormat('yyyy-MM-dd').format(selectedExpiryDate!),
      'quantity': int.parse(quantityController.text),
      'condition': selectedCondition,
      'unit': selectedUnit,
      'dosage_form': selectedDosageForm,
      'dosage_strength': dosageController.text.trim(),
      'donor_id': 'test_donor_123', // TODO: Replace with actual logged-in user ID
      'status': 'available',
    };

    try {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:5000/api/medicines'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(medicineData),
      );

      if (response.statusCode == 201) {
        _showSuccessDialog();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${response.body}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Exception: $e')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: AppStyles.cardDecoration,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppTheme.successColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  FontAwesomeIcons.check,
                  color: AppTheme.successColor,
                  size: 40,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Medicine Donated!',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Thank you for your contribution to saving lives.',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: const Text('Continue'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppTheme.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Donate Medicine',
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        centerTitle: true,
      ),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: SlideTransition(
          position: _slideAnimation,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildProgressIndicator(),
                  const SizedBox(height: 24),
                  _buildStepContent(),
                  const SizedBox(height: 32),
                  _buildActionButtons(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProgressIndicator() {
    return AnimationConfiguration.staggeredList(
      position: 0,
      duration: const Duration(milliseconds: 600),
      child: SlideAnimation(
        verticalOffset: 50.0,
        child: FadeInAnimation(
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: AppStyles.cardDecoration,
            child: Column(
              children: [
                Row(
                  children: [
                    _buildProgressStep(0, 'Basic Info', Icons.info_outline),
                    _buildProgressLine(),
                    _buildProgressStep(1, 'Details', Icons.description),
                    _buildProgressLine(),
                    _buildProgressStep(2, 'Review', Icons.check_circle_outline),
                  ],
                ),
                const SizedBox(height: 16),
                LinearProgressIndicator(
                  value: (currentStep + 1) / 3,
                  backgroundColor: AppTheme.textTertiary.withOpacity(0.2),
                  valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProgressStep(int step, String title, IconData icon) {
    final isActive = step <= currentStep;
    return Expanded(
      child: Column(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: isActive ? AppTheme.primaryColor : AppTheme.textTertiary.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: isActive ? Colors.white : AppTheme.textTertiary,
              size: 20,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
              color: isActive ? AppTheme.primaryColor : AppTheme.textTertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressLine() {
    return Container(
      height: 2,
      width: 20,
      color: AppTheme.textTertiary.withOpacity(0.2),
    );
  }

  Widget _buildStepContent() {
    switch (currentStep) {
      case 0:
        return _buildBasicInfoStep();
      case 1:
        return _buildDetailsStep();
      case 2:
        return _buildReviewStep();
      default:
        return const SizedBox();
    }
  }

  Widget _buildBasicInfoStep() {
    return AnimationConfiguration.staggeredList(
      position: 1,
      duration: const Duration(milliseconds: 600),
      child: SlideAnimation(
        verticalOffset: 50.0,
        child: FadeInAnimation(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Basic Information',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Tell us about the medicine you want to donate',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              
              // Medicine Name
              TextFormField(
                controller: nameController,
                decoration: const InputDecoration(
                  labelText: 'Medicine Name *',
                  hintText: 'e.g., Paracetamol',
                  prefixIcon: Icon(FontAwesomeIcons.pills),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter medicine name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              
              // Brand Name
              TextFormField(
                controller: brandController,
                decoration: const InputDecoration(
                  labelText: 'Brand Name',
                  hintText: 'e.g., Crocin, Tylenol',
                  prefixIcon: Icon(FontAwesomeIcons.tag),
                ),
              ),
              const SizedBox(height: 16),
              
              // Quantity
              TextFormField(
                controller: quantityController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Quantity *',
                  hintText: 'e.g., 10',
                  prefixIcon: Icon(FontAwesomeIcons.hashtag),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty || int.tryParse(value) == null) {
                    return 'Please enter a valid quantity';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              
              // Unit Selection
              DropdownButtonFormField<String>(
                value: selectedUnit,
                decoration: const InputDecoration(
                  labelText: 'Unit *',
                  prefixIcon: Icon(FontAwesomeIcons.ruler),
                ),
                items: units.map((unit) {
                  return DropdownMenuItem(
                    value: unit,
                    child: Text(unit),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedUnit = value!;
                  });
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailsStep() {
    return AnimationConfiguration.staggeredList(
      position: 2,
      duration: const Duration(milliseconds: 600),
      child: SlideAnimation(
        verticalOffset: 50.0,
        child: FadeInAnimation(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Additional Details',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Provide more information about the medicine',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              
              // Expiry Date
              InkWell(
                onTap: _selectExpiryDate,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(color: AppTheme.textTertiary.withOpacity(0.3)),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(FontAwesomeIcons.calendar, color: AppTheme.textSecondary),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Expiry Date *',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                            Text(
                              selectedExpiryDate != null
                                  ? DateFormat('MMM dd, yyyy').format(selectedExpiryDate!)
                                  : 'Select expiry date',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                color: selectedExpiryDate != null
                                    ? AppTheme.textPrimary
                                    : AppTheme.textTertiary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              
              // Condition
              DropdownButtonFormField<String>(
                value: selectedCondition,
                decoration: const InputDecoration(
                  labelText: 'Condition *',
                  prefixIcon: Icon(FontAwesomeIcons.star),
                ),
                items: conditions.map((condition) {
                  return DropdownMenuItem(
                    value: condition,
                    child: Text(condition.toUpperCase()),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedCondition = value!;
                  });
                },
              ),
              const SizedBox(height: 16),
              
              // Dosage Form
              DropdownButtonFormField<String>(
                value: selectedDosageForm,
                decoration: const InputDecoration(
                  labelText: 'Dosage Form',
                  prefixIcon: Icon(FontAwesomeIcons.capsules),
                ),
                items: dosageForms.map((form) {
                  return DropdownMenuItem(
                    value: form,
                    child: Text(form.toUpperCase()),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedDosageForm = value!;
                  });
                },
              ),
              const SizedBox(height: 16),
              
              // Dosage Strength
              TextFormField(
                controller: dosageController,
                decoration: const InputDecoration(
                  labelText: 'Dosage Strength',
                  hintText: 'e.g., 500mg, 10ml',
                  prefixIcon: Icon(FontAwesomeIcons.weightScale),
                ),
              ),
              const SizedBox(height: 16),
              
              // Batch Number
              TextFormField(
                controller: batchNumberController,
                decoration: const InputDecoration(
                  labelText: 'Batch Number',
                  hintText: 'e.g., BATCH001',
                  prefixIcon: Icon(FontAwesomeIcons.barcode),
                ),
              ),
              const SizedBox(height: 24),
              
              // Image Upload
              InkWell(
                onTap: _pickImage,
                child: Container(
                  height: 120,
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: AppTheme.primaryColor.withOpacity(0.3),
                      style: BorderStyle.solid,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: selectedImage != null
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.file(
                            selectedImage!,
                            fit: BoxFit.cover,
                            width: double.infinity,
                          ),
                        )
                      : Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              FontAwesomeIcons.camera,
                              color: AppTheme.primaryColor,
                              size: 32,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Tap to add medicine photo',
                              style: GoogleFonts.inter(
                                color: AppTheme.primaryColor,
                                fontWeight: FontWeight.w600,
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
    );
  }

  Widget _buildReviewStep() {
    return AnimationConfiguration.staggeredList(
      position: 3,
      duration: const Duration(milliseconds: 600),
      child: SlideAnimation(
        verticalOffset: 50.0,
        child: FadeInAnimation(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Review & Submit',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Please review your information before submitting',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              
              Container(
                padding: const EdgeInsets.all(20),
                decoration: AppStyles.cardDecoration,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildReviewItem('Medicine Name', nameController.text),
                    _buildReviewItem('Brand', brandController.text.isNotEmpty ? brandController.text : 'Not specified'),
                    _buildReviewItem('Quantity', '${quantityController.text} $selectedUnit'),
                    _buildReviewItem('Expiry Date', selectedExpiryDate != null ? DateFormat('MMM dd, yyyy').format(selectedExpiryDate!) : 'Not selected'),
                    _buildReviewItem('Condition', selectedCondition.toUpperCase()),
                    _buildReviewItem('Dosage Form', selectedDosageForm.toUpperCase()),
                    if (dosageController.text.isNotEmpty)
                      _buildReviewItem('Dosage Strength', dosageController.text),
                    if (batchNumberController.text.isNotEmpty)
                      _buildReviewItem('Batch Number', batchNumberController.text),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReviewItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppTheme.textPrimary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return AnimationConfiguration.staggeredList(
      position: 4,
      duration: const Duration(milliseconds: 600),
      child: SlideAnimation(
        verticalOffset: 50.0,
        child: FadeInAnimation(
          child: Row(
            children: [
              if (currentStep > 0)
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      setState(() {
                        currentStep--;
                      });
                    },
                    child: const Text('Previous'),
                  ),
                ),
              if (currentStep > 0) const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton(
                  onPressed: isLoading
                      ? null
                      : () {
                          if (currentStep < 2) {
                            setState(() {
                              currentStep++;
                            });
                          } else {
                            _submitForm();
                          }
                        },
                  child: isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : Text(currentStep < 2 ? 'Next' : 'Donate Medicine'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}