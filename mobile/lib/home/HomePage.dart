import 'package:flutter/material.dart';
import 'package:mobile/api/ApiService.dart';

import '../api/AllModels.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<RecordCategory> categories = [];
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    ApiService().fetchCategory().then((value) {
      setState(() {
        categories = value;
      });
    });
  }

  final List<Record> records = [
    Record('Javascript', 'How to amend const?', 'Const Advices',
        DateTime(2024, 1, 10, 10, 24)),
    Record('Collections', 'Explain where have you used collections in th...',
        'Collections Storage', DateTime(2024, 1, 10, 10, 24)),
    Record('Javascript', 'How to amend const?', 'Const Advices',
        DateTime(2024, 1, 10, 10, 24)),
    Record('Collections', 'Explain where have you used collections in th...',
        'Collections Storage', DateTime(2024, 1, 10, 10, 24)),
    Record('Javascript', 'How to amend const?', 'Const Advices',
        DateTime(2024, 1, 10, 10, 24)),
  ];

  @override
  Widget build(BuildContext context) {
    print(categories.length);
    return Scaffold(
      appBar: AppBar(
        title: Text('Revise'),
        actions: [
          IconButton(
            icon: Icon(Icons.person),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
            ),
          ),
          Expanded(
            child: ListView(
              children: [
                SizedBox(height: 16),
                Text(
                  'Top Records',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.1,
                  child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      shrinkWrap: true,
                      padding: EdgeInsets.symmetric(horizontal: 10),
                      itemCount: categories.length,
                      itemBuilder: (context, index) {
                        // print(categories[index].name);
                        return RecordCard(
                            title: categories[index].name,
                            count: 10,
                            color: Colors.pink);
                      }),
                ),
                SizedBox(height: 16),
                Text(
                  'All Files',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text('Sort by'),
                    SizedBox(width: 8),
                    DropdownButton(
                      value: 'Last Revised',
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
                      onChanged: (_) {},
                    ),
                  ],
                ),
                ...records.map((record) => RecordTile(record)).toList(),
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
    return Container(
      padding: EdgeInsets.all(16),
      margin: EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: color,
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
    );
  }
}

class RecordTile extends StatelessWidget {
  final Record record;

  RecordTile(this.record);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        child: Text(
          record.category[0],
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: Colors.pink,
      ),
      title: Text(record.title),
      subtitle: Text(record.question),
      trailing: Text(
        '${record.lastRevised.hour}:${record.lastRevised.minute}',
        style: TextStyle(
          color: Colors.grey,
        ),
      ),
    );
  }
}

class Record {
  final String category;
  final String question;
  final String title;
  final DateTime lastRevised;

  Record(this.category, this.question, this.title, this.lastRevised);
}
