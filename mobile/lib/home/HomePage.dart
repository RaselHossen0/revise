import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../api/Apis.dart';
import '../api/RecordModel.dart';
import '../main.dart';
import 'RecordDetailsPage.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class UniqueCategory {
  final String categoryName;
  final int count;
  final List<Record> records;

  UniqueCategory(this.categoryName, this.count, this.records);
}

class _HomePageState extends State<HomePage> {
  List<RecordCategory> categories = [];
  List<Record> records = [];
  List<Record> filteredRecords = [];
  List<UniqueCategory> uniqueCategories = [];
  String searchQuery = '';
  String sortCriteria = 'Last Revised';
  bool isLoaded = false;

  @override
  void initState() {
    super.initState();
    fetchCategoriesAndRecords();
    _searchFocusNode.addListener(() {
      if (!_searchFocusNode.hasFocus) {
        setState(() {
          showFloatingSearchResults = false;
        });
      }
    });
  }

  Future<void> fetchCategoriesAndRecords() async {
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
      categories = records
          .where((element) => element.categories.isNotEmpty)
          .map((e) => e.categories.first)
          .toSet()
          .toList();
      updateUniqueCategories(updateRecords: true);
      isLoaded = true;
    });
  }

  List<Record> searchResults = [];

  void updateUniqueCategories({bool updateRecords = false}) {
    final uniqueCategoryNames = categories
        .where((element) => element.categoryName != null)
        .map((e) => e.categoryName)
        .toSet()
        .toList();

    uniqueCategories = uniqueCategoryNames.map((e) {
      return UniqueCategory(
        e,
        filteredRecords
            .where((record) => record.categories.first.categoryName == e)
            .length,
        filteredRecords
            .where((element) => element.categories.first.categoryName == e)
            .toList(),
      );
    }).toList();
    if (updateRecords) {
      uniqueCategories.sort((a, b) => b.count.compareTo(a.count));
    }
    if (!updateRecords)
      uniqueCategories.sort((a, b) => a.categoryName.compareTo(b.categoryName));

    // Sort based on count
  }

  void filterRecords(String query) {
    setState(() {
      searchQuery = query;
      searchResults = records
          .where((record) =>
              record.question.toLowerCase().contains(query.toLowerCase()) ||
              record.solution.toLowerCase().contains(query.toLowerCase()))
          .toList();
      showFloatingSearchResults = true;
    });
  }

  void sortRecords(String criteria) {
    setState(() {
      sortCriteria = criteria;
      if (criteria == 'Last Revised') {
        filteredRecords.sort((a, b) {
          var dateA = DateTime(
              a.metaData['lastVisited'][0],
              a.metaData['lastVisited'][1],
              a.metaData['lastVisited'][2],
              a.metaData['lastVisited'][3],
              a.metaData['lastVisited'][4],
              a.metaData['lastVisited'][5]);
          var dateB = DateTime(
              b.metaData['lastVisited'][0],
              b.metaData['lastVisited'][1],
              b.metaData['lastVisited'][2],
              b.metaData['lastVisited'][3],
              b.metaData['lastVisited'][4],
              b.metaData['lastVisited'][5]);
          return dateB.compareTo(dateA);
        });
      } else if (criteria == 'Question') {
        filteredRecords.sort((a, b) => a.question.compareTo(b.question));
      } else if (criteria == 'Solution') {
        filteredRecords.sort((a, b) => a.solution.compareTo(b.solution));
      } else if (criteria == 'Logic') {
        filteredRecords.sort((a, b) => a.logic.compareTo(b.logic));
      } else if (criteria == 'Category') {
        filteredRecords.sort((a, b) => a.categories.first.categoryName
            .compareTo(b.categories.first.categoryName));
      }
      updateUniqueCategories();
    });
  }

  bool showFloatingSearchResults = false;
  final FocusNode _searchFocusNode = FocusNode();
  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    _searchFocusNode.dispose();
  }

  int currentI = 0;
  @override
  Widget build(BuildContext context) {
    var width = MediaQuery.of(context).size.width;
    var height = MediaQuery.of(context).size.height;
    return Scaffold(
      appBar: currentI != 1
          ? AppBar(
              forceMaterialTransparency: true,
              automaticallyImplyLeading: false,
              systemOverlayStyle: SystemUiOverlayStyle(
                statusBarColor: Colors.transparent,
                statusBarIconBrightness: Brightness.dark,
                systemNavigationBarColor: Colors.pink[50],
                systemNavigationBarIconBrightness: Brightness.dark,
              ),
              title:
                  Image.asset('assets/logo.png', height: 30, fit: BoxFit.cover),
              actions: [
                IconButton(
                  icon: Icon(Icons.logout),
                  onPressed: () async {
                    SharedPreferences prefs =
                        await SharedPreferences.getInstance();
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
            )
          : null,
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.pink[50],
        selectedItemColor: Colors.pinkAccent,
        unselectedItemColor: Colors.grey,
        currentIndex: currentI,
        onTap: (index) {
          setState(() {
            currentI = index;
          });
          // if (index == 1) {
          //   Navigator.push(
          //     context,
          //     MaterialPageRoute(
          //       builder: (context) =>
          //           RecordDetailPage(record: records[0], allRecords: records),
          //     ),
          //   );
          // } else if (index == 2) {
          //   // Navigator.push(
          //   //   context,
          //   //   MaterialPageRoute(
          //   //     builder: (context) => SettingsPage(),
          //   //   ),
          //   // );
          // }
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.file_copy_outlined),
            label: 'Files',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          if (_searchFocusNode.hasFocus) _searchFocusNode.unfocus();
          setState(() {
            showFloatingSearchResults = false;
          });
        },
        child: currentI == 0
            ? Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 25.0, vertical: 6),
                    child: Container(
                      height: MediaQuery.of(context).size.height * 0.062,
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Search',
                          hintStyle: TextStyle(color: Colors.pinkAccent),
                          prefixIcon:
                              Icon(Icons.search, color: Colors.pinkAccent),
                          filled: true,
                          fillColor: Colors.pink[50],
                          border: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.all(Radius.circular(30.0)),
                            borderSide: BorderSide.none,
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.all(Radius.circular(30.0)),
                            borderSide: BorderSide(color: Colors.pinkAccent),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.all(Radius.circular(30.0)),
                            borderSide: BorderSide(color: Colors.pinkAccent),
                          ),
                        ),
                        cursorColor: Colors.pinkAccent,
                        style: TextStyle(color: Colors.pinkAccent),
                        onChanged: filterRecords,
                      ),
                    ),
                  ),
                  if (showFloatingSearchResults)
                    SizedBox(
                      height: height * 0.3,
                      child: SingleChildScrollView(
                        child: Container(
                          margin: EdgeInsets.symmetric(horizontal: 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 10,
                                spreadRadius: 5,
                              ),
                            ],
                          ),
                          child: Column(
                            children: searchResults.map((record) {
                              return ListTile(
                                onFocusChange: (value) {
                                  setState(() {
                                    showFloatingSearchResults = false;
                                    _searchFocusNode.unfocus();
                                  });
                                },
                                title: Text(
                                  record.question,
                                  maxLines: 1,
                                ),
                                subtitle: Text(
                                  record.solution,
                                  maxLines: 1,
                                ),
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => RecordDetailPage(
                                        record: record,
                                        allRecords: records,
                                      ),
                                    ),
                                  );
                                  _searchFocusNode.unfocus();
                                },
                              );
                            }).toList(),
                          ),
                        ),
                      ),
                    ),
                  if (isLoaded)
                    Expanded(
                      child: ListView(
                        children: [
                          SizedBox(height: 16),
                          Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 12.0),
                            child: Text(
                              'Top Records',
                              style: TextStyle(
                                fontSize: 17,
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
                              itemCount: uniqueCategories.length,
                              itemBuilder: (context, index) {
                                return RecordCard(
                                  title: uniqueCategories[index].categoryName,
                                  count: uniqueCategories[index].count,
                                  color: Colors.pink,
                                );
                              },
                            ),
                          ),
                          SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              SizedBox(width: 15),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 0.0),
                                child: Text(
                                  'All Files',
                                  style: TextStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              Spacer(),
                              DropdownButton<String>(
                                value: sortCriteria,
                                items: [
                                  DropdownMenuItem(
                                    value: 'Category',
                                    child: Text('Category'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'Last Revised',
                                    child: Text('Last Revised'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'Question',
                                    child: Text('Question'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'Solution',
                                    child: Text('Solution'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'Logic',
                                    child: Text('Logic'),
                                  ),
                                ],
                                onChanged: (value) {
                                  if (value != null) {
                                    sortRecords(value);
                                  }
                                },
                              ),
                              SizedBox(width: 15),
                            ],
                          ),
                          SizedBox(height: 16),
                          ...uniqueCategories.map((category) {
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16.0),
                                  child: Text(
                                    category.categoryName,
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                SizedBox(
                                  height: height * 0.3,
                                  child: ListView.builder(
                                    scrollDirection: Axis.horizontal,
                                    padding:
                                        EdgeInsets.symmetric(horizontal: 10),
                                    itemCount: category.records.length,
                                    itemBuilder: (context, index) {
                                      return RecordTile(category.records[index],
                                          records: records);
                                    },
                                  ),
                                ),
                                SizedBox(height: 16),
                              ],
                            );
                          }).toList(),
                        ],
                      ),
                    ),
                  !isLoaded
                      ? Center(
                          child: CircularProgressIndicator(),
                        )
                      : records.isEmpty
                          ? Center(
                              child: Text('No records found'),
                            )
                          : Container(),
                ],
              )
            : currentI == 1
                ? RecordDetailPage(
                    record: records[0],
                    allRecords: records,
                    fromHomePage: true,
                  )
                : Center(
                    child: Text('Settings'),
                  ),
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
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Flexible(
              child: Text(
                title,
                maxLines: 1,
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
  final List<Record> records;

  RecordTile(this.record, {required this.records});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => RecordDetailPage(
              record: record,
              allRecords: records,
            ),
          ),
        );
      },
      child: Container(
        width: MediaQuery.of(context).size.width * 0.8,
        margin: EdgeInsets.symmetric(vertical: 8.0, horizontal: 6.0),
        padding: EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10.0),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 2,
              blurRadius: 10,
              offset: Offset(0, 2), // changes position of shadow
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 8.0),
            _buildInfoRow('Question:', record.question),
            _buildInfoRow('Answer:', record.solution),
            _buildInfoRow('Logic:', record.logic),
            SizedBox(height: 8.0),
            Text(
              'Last Revised: ${record.metaData['lastVisited'][3].toString().padLeft(2, '0')}:${record.metaData['lastVisited'][4].toString().padLeft(2, '0')}, ${record.metaData['lastVisited'][2]}/${record.metaData['lastVisited'][1]}/${record.metaData['lastVisited'][0]}',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 12.0,
              ),
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
          maxLines: 1,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14.0,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        Text(
          value,
          maxLines: 1,
          style: TextStyle(
            fontSize: 14.0,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        SizedBox(height: 8.0),
      ],
    );
  }
}
