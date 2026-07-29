import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import CourseGrid from './CourseGrid';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        prefetch: vi.fn(),
    }),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

const mockCourses = [
    {
        courseCode: 'CS1010S',
        courseTitle: 'Programming Methodology',
        tasks: [],
    },
    {
        courseCode: 'CS2040S',
        courseTitle: 'Data Structures and Algorithms',
        tasks: [],
    },
    {
        courseCode: 'CS2100',
        courseTitle: 'Computer Organisation',
        tasks: [],
    },
];

type CourseGridMode = 'NORMAL' | 'EDIT' | 'DELETE';

function renderCourseGrid(mode: CourseGridMode = 'NORMAL') {
    const callbacks = {
        onCourseClick: vi.fn(),
        onEditModeCardClick: vi.fn(),
        onDeleteModeCardClick: vi.fn(),
    };

    render(<CourseGrid courses={mockCourses} mode={mode} {...callbacks} />);

    return callbacks;
}

function getFirstCourseCard() {
    return screen.getByRole('button', {
        name: /CS1010S.*Programming Methodology/i,
    });
}

describe('CourseGrid', () => {
    it('renders the correct number of course cards', () => {
        renderCourseGrid();

        const courseCards = screen.getAllByRole('button');

        expect(courseCards).toHaveLength(mockCourses.length);
    });

    it('displays the correct information for every course', () => {
        renderCourseGrid();

        mockCourses.forEach((course) => {
            expect(screen.getByText(course.courseCode)).toBeInTheDocument();

            expect(screen.getByText(course.courseTitle)).toBeInTheDocument();
        });
    });

    it('calls onCourseClick when clicked in NORMAL mode', async () => {
        const user = userEvent.setup();

        const { onCourseClick, onEditModeCardClick, onDeleteModeCardClick } =
            renderCourseGrid('NORMAL');

        await user.click(getFirstCourseCard());

        expect(onCourseClick).toHaveBeenCalledOnce();
        expect(onCourseClick).toHaveBeenCalledWith(mockCourses[0]);

        expect(onEditModeCardClick).not.toHaveBeenCalled();
        expect(onDeleteModeCardClick).not.toHaveBeenCalled();
    });

    it('calls onEditModeCardClick when clicked in EDIT mode', async () => {
        const user = userEvent.setup();

        const { onCourseClick, onEditModeCardClick, onDeleteModeCardClick } =
            renderCourseGrid('EDIT');

        await user.click(getFirstCourseCard());

        expect(onEditModeCardClick).toHaveBeenCalledOnce();
        expect(onDeleteModeCardClick).not.toHaveBeenCalled();
    });

    it('calls onDeleteModeCardClick when clicked in DELETE mode', async () => {
        const user = userEvent.setup();

        const { onCourseClick, onEditModeCardClick, onDeleteModeCardClick } =
            renderCourseGrid('DELETE');

        await user.click(getFirstCourseCard());

        expect(onDeleteModeCardClick).toHaveBeenCalledOnce();
        expect(onEditModeCardClick).not.toHaveBeenCalled();
    });
});
