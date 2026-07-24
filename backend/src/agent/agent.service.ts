import { Injectable } from '@nestjs/common';
import GeneratePlanDto from './dto/generate-plan.dto';
import RevisePlanDto from './dto/revise-plan.dto';

@Injectable()
export class AgentService {
  async generatePlan(dto: GeneratePlanDto) {
    const response = await fetch(process.env.AGENT_URL + '/agent/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target_event: dto.target_event,
        preferences: dto.preferences,
        existing_events: dto.existing_events,
        planning_session_id: dto.planning_session_id,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to generate plan: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  }

  async revisePlan(dto: RevisePlanDto) {
    const response = await fetch(process.env.AGENT_URL + '/agent/revise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planning_session_id: dto.planning_session_id,
        revision_request: dto.revision_request,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to revise plan: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  }
}
