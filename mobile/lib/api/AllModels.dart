class RecordCategory {
  final String name;
  final String image;
  final String id;

  RecordCategory({required this.name, required this.image, required this.id});

  factory RecordCategory.fromJson(Map<String, dynamic> json) {
    return RecordCategory(
      name: json['categoryName'],
      image: json['image'] ?? "",
      id: json['id'].toString(),
    );
  }
}
