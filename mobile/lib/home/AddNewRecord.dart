import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:multi_select_flutter/dialog/multi_select_dialog_field.dart';
import 'package:multi_select_flutter/util/multi_select_item.dart';
import 'package:multi_select_flutter/util/multi_select_list_type.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../api/Apis.dart';

final questionProvider = StateProvider<String>((ref) => '');
final solutionProvider = StateProvider<String>((ref) => '');
final logicProvider = StateProvider<String>((ref) => '');
final selectedFileProvider = StateProvider<String?>((ref) => null);
final checkedForMailProvider = StateProvider<bool>((ref) => true);
final errorMsgProvider = StateProvider<Map<String, String>>((ref) => {});
final isSubmittedProvider = StateProvider<bool>((ref) => false);
final uploadStatusProvider = StateProvider<String>((ref) => '');
final selectedCategoriesProvider =
    StateProvider<List<Map<String, dynamic>>>((ref) => []);

// Provider for API Services
final apiServicesProvider = Provider((ref) => ApiServices());

// Provider for fetching categories
final categoriesProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final apiServices = ref.watch(apiServicesProvider);
  final categoriesResponse = await apiServices.getAllCategories();

  // Ensure the response is a list of maps and extract categoryName
  final categories = <Map<String, dynamic>>[];
  for (var category in categoriesResponse) {
    categories.add({
      'id': category['id'],
      'categoryName': category['categoryName'],
    });
  }

  return categories;
});

class AddNewRecordPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoriesAsyncValue = ref.watch(categoriesProvider);
    final selectedCategories = ref.watch(selectedCategoriesProvider);
    final question = ref.watch(questionProvider);
    final solution = ref.watch(solutionProvider);
    final logic = ref.watch(logicProvider);
    final selectedFile = ref.watch(selectedFileProvider);
    final checkedForMail = ref.watch(checkedForMailProvider);
    final errorMsg = ref.watch(errorMsgProvider);
    final isSubmitted = ref.watch(isSubmittedProvider);
    final uploadStatus = ref.watch(uploadStatusProvider);
    final apiServices = ref.watch(apiServicesProvider);

    return Scaffold(
      appBar: AppBar(title: Text('Add New Record')),
      body: categoriesAsyncValue.when(
        data: (categories) => SingleChildScrollView(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Category'),
              MultiSelectDialogField<Map<String, dynamic>>(
                items: categories.map((category) {
                  // print(categories);
                  return MultiSelectItem<Map<String, dynamic>>(
                    category, // This is the map containing 'id' and 'categoryName'
                    category['categoryName'], // This is the display text
                  );
                }).toList(),
                onSelectionChanged: (List<Map<String, dynamic>> selectedList) {
                  ref.watch(selectedCategoriesProvider.notifier).state =
                      selectedList;
                },
                listType: MultiSelectListType.CHIP,
                searchable: false,
                buttonText: Text('Select categories'),
                onConfirm: (List<Map<String, dynamic>> selectedValues) {
                  ref.read(selectedCategoriesProvider.notifier).update((state) {
                    return selectedValues;
                  });

                  // Handle confirmation, if needed
                },
              ),
              Wrap(
                children: selectedCategories.map((category) {
                  // print(category);
                  return Chip(
                    label: Text(category['categoryName']),
                    onDeleted: () {
                      ref
                          .read(selectedCategoriesProvider.notifier)
                          .update((state) {
                        return state.where((c) => c != category).toList();
                      });
                    },
                  );
                }).toList(),
              ),
              SizedBox(height: 16.0),
              Text('Question'),
              TextField(
                decoration: InputDecoration(
                  hintText: 'Enter a Question...',
                  errorText: errorMsg['question'],
                ),
                maxLines: null,
                onChanged: (value) {
                  ref.read(questionProvider.notifier).state = value;
                },
              ),
              SizedBox(height: 16.0),
              Text('Solution'),
              TextField(
                decoration: InputDecoration(
                  hintText: 'Enter a Solution...',
                  errorText: errorMsg['solution'],
                ),
                maxLines: null,
                onChanged: (value) {
                  ref.read(solutionProvider.notifier).state = value;
                },
              ),
              SizedBox(height: 16.0),
              Text('Logic'),
              TextField(
                decoration: InputDecoration(
                  hintText: 'Input Logic',
                ),
                maxLines: null,
                onChanged: (value) {
                  ref.read(logicProvider.notifier).state = value;
                },
              ),
              SizedBox(height: 16.0),
              Row(
                children: [
                  Checkbox(
                    value: checkedForMail,
                    onChanged: (value) {
                      ref.read(checkedForMailProvider.notifier).state = value!;
                    },
                  ),
                  Text('Part of Mail Reminders?'),
                ],
              ),
              SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: Text('Cancel'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      handleSubmit(context, ref);
                    },
                    child: Text('Save changes'),
                  ),
                ],
              ),
            ],
          ),
        ),
        loading: () => Center(child: CircularProgressIndicator()),
        error: (e, _) {
          print(e);
          return Center(child: Text('Failed to load categories'));
        },
      ),
    );
  }

  void handleSubmit(BuildContext context, WidgetRef ref) async {
    final selectedCategories = ref.read(selectedCategoriesProvider);
    final question = ref.read(questionProvider);
    final solution = ref.read(solutionProvider);
    final logic = ref.read(logicProvider);
    final selectedFile = ref.read(selectedFileProvider);
    final checkedForMail = ref.read(checkedForMailProvider);
    final apiServices = ref.read(apiServicesProvider);
    final setErrorMsg = ref.read(errorMsgProvider.notifier).update;
    final setIsSubmitted = ref.read(isSubmittedProvider.notifier).state = true;
    final setRecordId = (id) => {}; // Placeholder

    // Perform validation and show error messages if necessary
    if (selectedCategories.length > 3) {
      setErrorMsg((prevErrorMsg) => ({
            ...prevErrorMsg,
            'categories': 'Please attach only three categories'
          }));
      return;
    }

    if (selectedCategories.isEmpty) {
      setErrorMsg((prevErrorMsg) => ({
            ...prevErrorMsg,
            'categories': 'Please select or add at least one category'
          }));
      return;
    }

    if (question.trim().isEmpty) {
      setErrorMsg((prevErrorMsg) =>
          ({...prevErrorMsg, 'question': 'Please add at least 1 question'}));
      return;
    }

    if (solution.trim().isEmpty) {
      setErrorMsg((prevErrorMsg) =>
          ({...prevErrorMsg, 'solution': 'Please add at least 1 solution'}));
      return;
    }
    showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text('Uploading File'),
            content: Text('Please wait while we upload the file'),
          );
        });
    // Format the categories correctly
    final formattedCategories = selectedCategories
        .map((category) => {
              'id': category['id'], // Assuming ID is generated server-side
              'categoryName': category['categoryName'],
            })
        .toList();
    // var rs = await apiServices.uploadFile(ref.read(uploadStatusProvider), '1');
    // print(rs);

    // Placeholder for references
    final formattedReferences = <Map<String, dynamic>>[];
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final email = await prefs.getString('email');
    final userJson = prefs.getString('user');
    final user = userJson != null ? json.decode(userJson) : {};

    final uploadStatus = ref.read(uploadStatusProvider);

    // print(email);

    final recordData = {
      'id': null,
      'categories': formattedCategories,
      'question': question,
      'solution': solution,
      'logic': logic,
      // 'references': formattedReferences,
      'metaData': {
        'createdTime': DateTime.now().toIso8601String(),
        'modified': DateTime.now().toIso8601String(),
        'lastVisited': DateTime.now().toIso8601String(),
        'fibonaccidays': 0,
      },

      'daysPassedSinceLastVisit': 0,
      'createdByUser': user,
      'checkedForMail': checkedForMail,
    };

    try {
      final id = await apiServices.addRecordToDB(recordData);
      print(id);
      setRecordId(id);
      setIsSubmitted;
      Navigator.pop(context);
      showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: Text('Success'),
              content: Text('Record added successfully'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: Text('OK'),
                ),
              ],
            );
          });

      // Optionally navigate back or show success message
    } catch (error) {
      print(error);
      Navigator.pop(context);
      showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text('Error'),
            content: Text('An error occurred while adding the record'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text('OK'),
              ),
            ],
          );
        },
      );

      // Optionally show error message
    }
  }
}
