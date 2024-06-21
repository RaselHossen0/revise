import 'package:flutter/material.dart';

import '../api/RecordModel.dart';

class RecordDetailPage extends StatelessWidget {
  final Record record;
  final List<Record> allRecords;
  bool fromHomePage = false;

  RecordDetailPage(
      {required this.record,
      required this.allRecords,
      this.fromHomePage = false});

  @override
  Widget build(BuildContext context) {
    int initialPageIndex = allRecords.indexOf(record);

    return Scaffold(
      body: PageView.builder(
        controller: PageController(initialPage: initialPageIndex),
        itemCount: allRecords.length,
        scrollDirection: Axis.vertical,
        itemBuilder: (context, index) {
          Record currentRecord = allRecords[index];
          return SingleChildScrollView(
            child: Stack(
              children: [
                Positioned(
                    top: fromHomePage ? 30 : 50,
                    right: 10,
                    child: IconButton(
                      color: Colors.red,
                      splashRadius: 20.0,
                      splashColor: Colors.redAccent,
                      highlightColor: Colors.redAccent.withOpacity(0.5),
                      icon: Icon(Icons.close),
                      focusColor: Colors.redAccent,
                      onPressed: () {
                        Navigator.pop(context);
                      },
                    )),
                Padding(
                  padding: EdgeInsets.only(
                      top: !fromHomePage ? 88.0 : 60, left: 16.0, right: 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Last Revised Date
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Last Revised:',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16.0,
                              ),
                            ),
                            Text(
                              '${currentRecord.metaData['lastVisited'][2]}/${currentRecord.metaData['lastVisited'][1]}/${currentRecord.metaData['lastVisited'][0]} ${currentRecord.metaData['lastVisited'][3].toString().padLeft(2, '0')}:${currentRecord.metaData['lastVisited'][4].toString().padLeft(2, '0')}',
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 14.0,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Divider(color: Colors.grey),

                      // Category and Question
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              currentRecord.categories.first.categoryName,
                              style: TextStyle(
                                fontSize: 18.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.pinkAccent,
                              ),
                            ),
                            SizedBox(height: 8.0),
                            Row(
                              children: [
                                Icon(
                                  Icons.question_mark,
                                  size: 20.0,
                                  color: Colors.blueAccent,
                                ),
                                SizedBox(width: 8.0),
                                Text(
                                  'Question:',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16.0,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 4.0),
                            Text(
                              currentRecord.question,
                              style: TextStyle(
                                fontSize: 14.0,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Divider(color: Colors.grey),

                      // Solution
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  Icons.lightbulb,
                                  size: 20.0,
                                  color: Colors.yellow,
                                ),
                                SizedBox(width: 8.0),
                                Text(
                                  'Answer:',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16.0,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 4.0),
                            Text(
                              currentRecord.solution,
                              style: TextStyle(
                                fontSize: 14.0,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Divider(color: Colors.grey),

                      // Logic
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  Icons.code,
                                  size: 20.0,
                                  color: Colors.green,
                                ),
                                SizedBox(width: 8.0),
                                Text(
                                  'Logic:',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16.0,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 4.0),
                            Text(
                              currentRecord.logic,
                              style: TextStyle(
                                fontSize: 14.0,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
