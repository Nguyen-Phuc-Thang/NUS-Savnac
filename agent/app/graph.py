from langchain_google_genai import ChatGoogleGenerativeAI

from app.schemas import Event, PlanningPreferences, Plan
from langchain_core.messages import HumanMessage, SystemMessage
from app.prompts import SYSTEM_PROMPT, create_planning_message
from app.state import PlannerState
from langgraph.graph import END, START, StateGraph
from langgraph.checkpoint.memory import InMemorySaver
from app.config import GOOGLE_API_KEY


checkpointer = InMemorySaver()

llm = ChatGoogleGenerativeAI(
    google_api_key=GOOGLE_API_KEY,
    model="gemini-2.5-flash",
    temperature=0
).with_structured_output(
    Plan,
    method="json_schema",
)

async def generate_plan(target_event: Event, preferences: PlanningPreferences, planned_events: list[Event]) -> Plan:
    result = await llm.ainvoke(
        [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(
                content=create_planning_message(
                    target_event,
                    preferences,
                    planned_events
                )
            ),
        ]
    )

    return result


async def agent_plan(state: PlannerState) -> PlannerState:
    plan = await generate_plan(state["target_event"], state["preferences"], state["existing_events"])
    return {
        "current_plan": plan,
    }


builder = StateGraph(PlannerState)

builder.add_node("agent_plan", agent_plan)

builder.add_edge(START, "agent_plan")
builder.add_edge("agent_plan", END)

graph = builder.compile(checkpointer=checkpointer)
