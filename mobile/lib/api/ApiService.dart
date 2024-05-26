import 'package:dio/dio.dart';
import 'package:mobile/api/EndPoints.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'AllModels.dart';

class ApiService {
  Dio dio = Dio();

  Future<void> login() async {
    try {
      Response response = await dio.get('https://api.example.com/login');
      print(response.data);
    } catch (e) {
      print(e);
    }
  }

  Future<List<RecordCategory>> fetchCategory() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    String? email = await prefs.getString('email');
    print(email);
    try {
      var url = baseUrl + '/revise/getallcategories?usermail=$email';
      Response response = await dio.get(url);
      print(response.data);
      List<dynamic> data = response.data;
      List<RecordCategory> categories = [];
      data.forEach((element) {
        // print(element);
        categories.add(RecordCategory.fromJson(element));
      });

      return categories;
    } catch (e) {
      print(e);
    }
    return [];
  }
}
