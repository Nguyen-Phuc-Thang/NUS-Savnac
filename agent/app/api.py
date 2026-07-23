from fastapi import FastAPI
from pydantic import BaseModel
from app.schemas import Event, PlanningPreferences, Plan
from app.graph import graph
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage

load_dotenv()  

app = FastAPI()

class PlanRequest(BaseModel):
    target_event: Event
    preferences: PlanningPreferences
    existing_events: list[Event] 

    planning_session_id: str

class ReviseRequest(BaseModel):
    revision_request: str
    planning_session_id: str

@app.post("/agent/plan", response_model=Plan)
async def agent_plan(request: PlanRequest):
    result = await graph.ainvoke(
        {
            "messages": [],
            "target_event": request.target_event,
            "preferences": request.preferences,
            "existing_events": request.existing_events,
            "current_plan": None,
            "revision_request": None,
        },
        config={"configurable": {"thread_id": request.planning_session_id}}
    )

    return result["current_plan"]


@app.post("/agent/revise", response_model=Plan)
async def agent_revise(request: ReviseRequest):
    result = await graph.ainvoke(
        {
            "messages": [HumanMessage(content=request.revision_request)],
            "revision_request": request.revision_request,

        },
        config={"configurable": {"thread_id": request.planning_session_id}}
    )

    return result["current_plan"]
