import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// API Gateway envia mensagens e esses métodos recebem, respondendo com as informações
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(@Payload() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @MessagePattern('auth.login')
  async login(@Payload() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @MessagePattern('auth.refresh')
  async refreshTokens(
    @Payload() payload: { userId: string; refreshToken: string },
  ) {
    return await this.authService.refreshTokens(
      payload.userId,
      payload.refreshToken,
    );
  }

  @MessagePattern('auth.logout')
  async logout(@Payload() payload: { userId: string }) {
    return await this.authService.logout(payload.userId);
  }

  @MessagePattern('auth.validate')
  async validateUser(@Payload() payload: { userId: string }) {
    return await this.authService.validateUser(payload.userId);
  }
}
