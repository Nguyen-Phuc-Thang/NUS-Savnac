import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export default class CreatePomodoroDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @Min(1)
  focusTime!: number;

  @IsInt()
  @Min(1)
  breakTime!: number;
}
