import { IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetNotificationQueryDto {
  @IsOptional()
  @IsIn(['email', 'sms'])
  channel?: 'email' | 'sms';

  @IsOptional()
  @IsIn(['pending', 'sent', 'failed'])
  status?: 'pending' | 'sent' | 'failed';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
