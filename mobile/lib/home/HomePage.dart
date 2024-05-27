import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../api/Apis.dart';
import '../api/RecordModel.dart';
import '../main.dart';
import 'RecordDetailsPage.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<RecordCategory> categories = [];
  List<Record> records = [];
  List<Record> filteredRecords = [];
  String searchQuery = '';
  String sortCriteria = 'Last Revised';

  @override
  void initState() {
    super.initState();
    fetchCategoriesAndRecords();
  }

  Future<void> fetchCategoriesAndRecords() async {
    var categoryResponse = await ApiServices().getAllCategories();
    var recordsResponse = await ApiServices().getRevisionDetails();
    setState(() {
      var recordsList = recordsResponse as List;
      records = recordsList.map((element) {
        return Record(
          element['id'],
          (element['categories'] as List)
              .map((cat) => RecordCategory(cat['id'], cat['categoryName']))
              .toList(),
          element['question'],
          element['solution'],
          element['logic'],
          element['references'] as List,
          element['metaData'],
          element['daysPassedSinceLastVisit'],
          element['createdByUser']['email'],
          element['checkedForMail'],
        );
      }).toList();
      filteredRecords = List.from(records);
      categories = (categoryResponse as List)
          .map((element) =>
              RecordCategory(element['id'], element['categoryName']))
          .toList();
    });
  }

  void filterRecords(String query) {
    setState(() {
      searchQuery = query;
      filteredRecords = records
          .where((record) =>
              record.question.toLowerCase().contains(query.toLowerCase()) ||
              record.solution.toLowerCase().contains(query.toLowerCase()))
          .toList();
      sortRecords(sortCriteria);
    });
  }

  void sortRecords(String criteria) {
    setState(() {
      sortCriteria = criteria;
      if (criteria == 'Last Revised') {
        filteredRecords.sort((a, b) =>
            b.metaData['lastVisited'].compareTo(a.metaData['lastVisited']));
      } else if (criteria == 'Title') {
        filteredRecords.sort((a, b) => a.question.compareTo(b.question));
      } else if (criteria == 'Category') {
        filteredRecords.sort((a, b) => a.categories.first.categoryName
            .compareTo(b.categories.first.categoryName));
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    var width = MediaQuery.of(context).size.width;
    var height = MediaQuery.of(context).size.height;
    return Scaffold(
      appBar: AppBar(
        forceMaterialTransparency: true,
        automaticallyImplyLeading: false,
        title: Image.asset('assets/logo.png', height: 30, fit: BoxFit.cover),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              SharedPreferences prefs = await SharedPreferences.getInstance();
              prefs.remove('email');
              Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(
                    builder: (context) => LoginPage(),
                  ),
                  (route) => false);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 6),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search',
                hintStyle: TextStyle(color: Colors.pinkAccent),
                prefixIcon: Icon(Icons.search, color: Colors.pinkAccent),
                filled: true,
                fillColor: Colors.pink[50],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(30.0)),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(30.0)),
                  borderSide: BorderSide(color: Colors.pinkAccent),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(30.0)),
                  borderSide: BorderSide(color: Colors.pinkAccent),
                ),
              ),
              cursorColor: Colors.pinkAccent,
              style: TextStyle(color: Colors.pinkAccent),
              onChanged: filterRecords,
            ),
          ),
          Expanded(
            child: ListView(
              children: [
                SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                  child: Text(
                    'Top Records',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                SizedBox(height: 8),
                SizedBox(
                  height: height * 0.1,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    shrinkWrap: true,
                    padding: EdgeInsets.symmetric(horizontal: 10),
                    itemCount: categories.length,
                    itemBuilder: (context, index) {
                      return RecordCard(
                        title: categories[index].categoryName,
                        count: 10,
                        color: Colors.pink,
                      );
                    },
                  ),
                ),
                SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                  child: Text(
                    'All Files',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text('Sort by'),
                    SizedBox(width: 8),
                    DropdownButton<String>(
                      value: sortCriteria,
                      items: [
                        DropdownMenuItem(
                          value: 'Last Revised',
                          child: Text('Last Revised'),
                        ),
                        DropdownMenuItem(
                          value: 'Title',
                          child: Text('Title'),
                        ),
                        DropdownMenuItem(
                          value: 'Category',
                          child: Text('Category'),
                        ),
                      ],
                      onChanged: (value) {
                        if (value != null) {
                          sortRecords(value);
                        }
                      },
                    ),
                  ],
                ),
                ...filteredRecords.map((record) => RecordTile(record)).toList(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class RecordCard extends StatelessWidget {
  final String title;
  final int count;
  final Color color;

  RecordCard({
    required this.title,
    required this.count,
    this.color = Colors.grey,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        padding: EdgeInsets.all(16),
        margin: EdgeInsets.symmetric(horizontal: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.2),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Flexible(
              child: Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ),
            SizedBox(height: 8),
            Text(
              '$count',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class RecordTile extends StatelessWidget {
  final Record record;

  RecordTile(this.record);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => RecordDetailPage(record: record),
          ),
        );
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
        padding: EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10.0),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              spreadRadius: 2,
              blurRadius: 4,
              offset: Offset(0, 2), // changes position of shadow
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              record.categories.first.categoryName,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.pinkAccent,
                fontSize: 16.0,
              ),
            ),
            SizedBox(height: 8.0),
            _buildInfoRow('Question:', record.question),
            _buildInfoRow('Answer:', record.solution),
            _buildInfoRow('Logic:', record.logic),
            SizedBox(height: 16.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Last Revised: ${record.metaData['lastVisited'][3].toString().padLeft(2, '0')}:${record.metaData['lastVisited'][4].toString().padLeft(2, '0')}, ${record.metaData['lastVisited'][2]}/${record.metaData['lastVisited'][1]}/${record.metaData['lastVisited'][0]}',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 12.0,
                  ),
                ),
                CircleAvatar(
                  backgroundColor: Colors.pinkAccent,
                  child: Text(
                    record.categories.first.categoryName[0],
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14.0,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 14.0,
          ),
        ),
        SizedBox(height: 8.0),
      ],
    );
  }
}
