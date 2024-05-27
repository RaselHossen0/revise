class Record {
  final int id;
  final List<RecordCategory> categories;
  final String question;
  final String solution;
  final String logic;
  final List references;
  final Map metaData;
  final int daysPassedSinceLastVisit;
  final String createdByUser;
  final bool checkedForMail;

  Record(
    this.id,
    this.categories,
    this.question,
    this.solution,
    this.logic,
    this.references,
    this.metaData,
    this.daysPassedSinceLastVisit,
    this.createdByUser,
    this.checkedForMail,
  );
}

class RecordCategory {
  final int id;
  final String categoryName;

  RecordCategory(this.id, this.categoryName);
}
