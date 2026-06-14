
const lessonTypeCode: { [key: string]: string } = {
    "Lecture": "LEC",
    "Tutorial": "TUT",
    "Lab": "LAB",
    "Recitation": "REC",
    "Seminar": "SEM",
    "Sectional Teaching": "SEC",
    "Studio": "STU",
    "Workshop": "WKS",
}

const weeks: string[] = ["1", "2", "3", "4", "5", "6", "Recess Week", "7", "8", "9", "10", "11", "12", "13", "Reading Week", "Exam Week"];
const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function restructureClasses(semesterData: any) {
    const timetable: any[] = semesterData.timetable;
    timetable.sort((a, b) => a.lessonType < b.lessonType ? -1 : 1);
    timetable.map((lesson) => {
        lesson.classNo = (lessonTypeCode[lesson.lessonType] || lesson.lessonType) + lesson.classNo;
    });

    return timetable;
}


export function splitToWeekAndDays(events: any[]) {
    const newEvents: { [key: string]: { [key: string]: any[] } } = {};
    for (const week of weeks) {
        newEvents[week] = {};
        for (const day of days) {
            newEvents[week][day] = [];
        }
    }
    for (const event of events) {
        const { week, day } = event;
        if (newEvents[week] && newEvents[week][day]) {
            newEvents[week][day].push(event);
        }
    }
    return newEvents;
}