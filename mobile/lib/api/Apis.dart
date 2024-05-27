import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiServices {
  final Dio _dio = Dio(BaseOptions(
    baseUrl:
        'http://ec2-54-251-143-90.ap-southeast-1.compute.amazonaws.com:8089',
    headers: {
      'Content-Type': 'application/json',
    },
  ));

  Future<dynamic> makeRequest(
    String method,
    String url, {
    dynamic data,
    Map<String, dynamic>? params,
    String contentType = 'application/json',
  }) async {
    try {
      Options options = Options(
        method: method,
        headers: {
          'Content-Type': contentType,
        },
      );
      Response response = await _dio.request(
        url,
        data: data,
        queryParameters: params,
        options: options,
      );
      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Request failed');
      }
    } catch (error) {
      throw Exception('Network error: $error');
    }
  }

  Future<dynamic> addRecordToDB(Map<String, dynamic> record) {
    return makeRequest('POST', '/records/addtodb', data: record);
  }

  Future<dynamic> uploadFile(String filePath, String recordId) async {
    FormData formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath),
    });
    return makeRequest(
      'POST',
      '/file/upload',
      data: formData,
      params: {'recordId': recordId},
      contentType: 'multipart/form-data',
    );
  }

  Future<dynamic> searchRecords(Map<String, dynamic> searchModel) {
    return makeRequest('POST', '/revise/search', data: searchModel);
  }

  Future<dynamic> getRecordDetails(String recordId) {
    return makeRequest('GET', '/records/getarecorddetail',
        params: {'recordid': recordId});
  }

  Future<dynamic> getRevisionDetails() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    String? email = await preferences.getString('email');
    return makeRequest('GET', '/revise/letusrevise',
        params: {'usermail': email});
  }

  Future<dynamic> getAllCategories() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    String? email = await preferences.getString('email');
    return makeRequest('GET', '/revise/getallcategories',
        params: {'usermail': email});
  }

  Future<dynamic> fetchSuggestionsApi(String term) async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    String? email = await preferences.getString('email');
    return makeRequest('GET', '/revise/getsuggestions',
        params: {'key': term, 'usermail': email});
  }

  Future<dynamic> fetchRecordsByIds(String mailIds) {
    return makeRequest('GET', '/records/getrecordsbyids',
        params: {'recordids': mailIds});
  }

  Future<dynamic> applyConfigChangesApi(
      Map<String, dynamic> updateConfigurationModels) {
    return makeRequest('POST', '/config/configuration',
        data: updateConfigurationModels);
  }

  Future<dynamic> fetchConfigurationsApi() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    String? email = await preferences.getString('email');
    return makeRequest('GET', '/config/configuration',
        params: {'usermail': email});
  }

  Future<dynamic> deleteReferenceFromRecord(
      String recordId, String referenceId) {
    return makeRequest(
        'DELETE', '/file/record/$recordId/references/$referenceId');
  }

  Future<dynamic> deleteARecord(String recordId) {
    return makeRequest('DELETE', '/records/deleterecordbyid',
        params: {'recordid': recordId});
  }
}
