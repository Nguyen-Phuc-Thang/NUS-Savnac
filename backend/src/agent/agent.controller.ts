import { Controller, Get, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';
import GeneratePlanDto from './dto/generate-plan.dto';
import RevisePlanDto from './dto/revise-plan.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('generate-plan')
  async generatePlan(@Body() dto: GeneratePlanDto) {
    return this.agentService.generatePlan(dto);
  }

  @Post('revise-plan')
  async revisePlan(@Body() dto: RevisePlanDto) {
    return this.agentService.revisePlan(dto);
  }
}
