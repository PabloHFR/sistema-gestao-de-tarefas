import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token recebido no login',
  })
  @IsString()
  refreshToken: string;
}
