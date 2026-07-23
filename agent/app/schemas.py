from typing import Literal, Optional
from pydantic import BaseModel, Field, model_validator

class Event(BaseModel):
    event_id: str
    event_type: Literal["EXAM", "DEADLINE", "CLASS", "OTHER"]
    title: str

    week: str
    day: str
    start_time: str
    end_time: Optional[str] = None

    venue: Optional[str] = None
    course_id: Optional[str] = None


class PlanningPreferences(BaseModel):
    preparation_time: str
    intensity: Literal["LIGHT", "MODERATE", "INTENSIVE"]
    notes: str = ""

class Plan(BaseModel):
    plan_title: str = Field(
        min_length=1,
        max_length=120,
    )

    strategy: str = Field(
        min_length=1,
        description="How the preparation workload is divided across events.",
    )

    events: list[Event] = Field(
        min_length=1,
        description=(
            "Preparation events ordered chronologically. "
            "Each event must occur after the previous event."
        ),
    )

    @model_validator(mode="after")
    def validate_event_times(self):
        for event in self.events:
            if event.start_time >= event.end_time:
                raise ValueError(
                    f'Event "{event.title}" must end after it starts.'
                )

        return self