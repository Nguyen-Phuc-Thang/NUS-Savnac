import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Trash2 } from 'lucide-react';
import SetTimerDialog from './set-timer-dialog';
import { TimerConfig } from '@/types/timer';

interface Props {
    timer: TimerConfig;
    selected: boolean;
    onClick: () => void;
}

const TimerCard = ({ timer, selected, onClick }: Props) => {
    return (
        <Card
            className={`cursor-pointer transition hover:shadow-md ${
                selected && 'border-primary border-2'
            }`}
            onClick={onClick}
        >
            <CardContent className="py-0.5">
                {/**Top Row */}
                <div className="flex justify-between">
                    {/**Top Left */}
                    <div className="flex items-center gap-0.5">
                        {selected && <Check />}
                        <h1 className="font-bold text-xl">{timer.name}</h1>
                    </div>

                    {/**Top Right */}
                    <div className="flex items-center gap-0.5">
                        <SetTimerDialog mode="edit" />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/**Bottom Row */}
                <div className="flex gap-4">
                    <span>Focus: {timer.focusTime} min(s)</span>
                    <span>Break: {timer.breakTime} min(s)</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default TimerCard;
