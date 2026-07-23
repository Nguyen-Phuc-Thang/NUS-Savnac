export async function generatePlan(
  target_event: any,
  preferences: any,
  existing_events: any[],
  planning_session_id: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/agent/generate-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_event,
        preferences,
        existing_events,
        planning_session_id,
      }),
    },
  );

  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to generate plan: ${response.statusText}`);
  }

  return response.json();
}

export async function revisePlan(
  planning_session_id: string,
  revision_request: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/agent/revise-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planning_session_id, revision_request }),
    },
  );

  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to revise plan: ${response.statusText}`);
  }

  return response.json();
}
