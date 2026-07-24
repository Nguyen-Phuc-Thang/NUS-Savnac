from typing import Annotated, TypedDict, Optional
from langchain_core.messages import AnyMessage
from langgraph.graph.message import add_messages
from app.schemas import Event, PlanningPreferences, Plan

class PlannerState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]

    target_event: Event
    preferences: PlanningPreferences
    existing_events: list[Event]

    current_plan: Optional[Plan]
    revision_request: Optional[str]