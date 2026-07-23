import { IsNotEmpty, IsString } from 'class-validator';

export default class RevisePlanDto {
  @IsString()
  @IsNotEmpty()
  planning_session_id!: string;

  @IsString()
  @IsNotEmpty()
  revision_request!: string;
}
