import { days } from '@/lib/constants/time';

type NusDay = (typeof days)[number];

type CalendarRange = {
    startDate: string;
    endDate: string;
};

const dayToIndex: Record<NusDay, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
};

function createLocalDate(dateString: string) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function formatLocalDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const nusCalendar = {
    semester1: {
        'Week 1': {
            startDate: '2026-08-10',
            endDate: '2026-08-16',
        },
        'Week 2': {
            startDate: '2026-08-17',
            endDate: '2026-08-23',
        },
        'Week 3': {
            startDate: '2026-08-24',
            endDate: '2026-08-30',
        },
        'Week 4': {
            startDate: '2026-08-31',
            endDate: '2026-09-06',
        },
        'Week 5': {
            startDate: '2026-09-07',
            endDate: '2026-09-13',
        },
        'Week 6': {
            startDate: '2026-09-14',
            endDate: '2026-09-18',
        },
        'Recess Week': {
            startDate: '2026-09-19',
            endDate: '2026-09-27',
        },
        'Week 7': {
            startDate: '2026-09-28',
            endDate: '2026-10-04',
        },
        'Week 8': {
            startDate: '2026-10-05',
            endDate: '2026-10-11',
        },
        'Week 9': {
            startDate: '2026-10-12',
            endDate: '2026-10-18',
        },
        'Week 10': {
            startDate: '2026-10-19',
            endDate: '2026-10-25',
        },
        'Week 11': {
            startDate: '2026-10-26',
            endDate: '2026-11-01',
        },
        'Week 12': {
            startDate: '2026-11-02',
            endDate: '2026-11-08',
        },
        'Week 13': {
            startDate: '2026-11-09',
            endDate: '2026-11-13',
        },
        'Reading Week': {
            startDate: '2026-11-14',
            endDate: '2026-11-20',
        },
        'Exam Week': {
            startDate: '2026-11-21',
            endDate: '2026-12-05',
        },
    },
} as const;

export type NusSemester1Week = keyof typeof nusCalendar.semester1;
export type NusCalendarDay = NusDay;

export function getDate(week: NusSemester1Week, day: NusCalendarDay) {
    const calendarRange = nusCalendar.semester1[week];

    if (!calendarRange) {
        throw new Error(`Unknown semester 1 week: ${week}`);
    }

    const startDate = createLocalDate(calendarRange.startDate);
    const startDayIndex = startDate.getDay();
    const targetDayIndex = dayToIndex[day];
    const dayOffset = (targetDayIndex - startDayIndex + 7) % 7;

    return formatLocalDate(
        new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + dayOffset,
        ),
    );
}
