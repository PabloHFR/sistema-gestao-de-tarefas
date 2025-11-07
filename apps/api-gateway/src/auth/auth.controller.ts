import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthResponse, LogoutResponse, RefreshResponse } from '@monorepo/types';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token';

@Controller('auth')
export class AuthController {
  constructor(
    // Injeta o cliente RabbitMQ configurado no AppModule
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  // POST /api/auth/register
  // Registra um novo usuário
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registra um novo usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ou Nome do Usuário já existem',
  })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<AuthResponse> {
    return await firstValueFrom(
      this.authClient.send('auth.register', registerDto),
    );
  }

  // POST /api/auth/login
  // Autentica e loga o usuário
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autentica e loga um usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<AuthResponse> {
    return await firstValueFrom(this.authClient.send('auth.login', loginDto));
  }

  // POST /api/auth/refresh
  // Renova token do usuário usando seu refresh token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard) // Guard que requer que o usuário já esteja autenticado
  @ApiBearerAuth() // Documenta no Swagger que é necessário um Bearer token na requisição
  @ApiOperation({
    summary: 'Renova o token do usuário usando seu refresh token',
  })
  @ApiResponse({ status: 200, description: 'Token renovado com sucesso!' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refresh(
    @Body(ValidationPipe) refreshTokenDto: RefreshTokenDto,
    @Req()
    req: {
      user: {
        userId: string;
      };
    },
  ): Promise<RefreshResponse> {
    const userId = req.user.userId;

    return await firstValueFrom(
      this.authClient.send('auth.refresh', {
        userId,
        refreshToken: refreshTokenDto.refreshToken,
      }),
    );
  }

  // POST /api/auth/logout
  // Desloga o usuário
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard) // Guard que requer que o usuário já esteja autenticado
  @ApiBearerAuth() // Documenta no Swagger que é necessário um Bearer token na requisição
  @ApiOperation({ summary: 'Faz o logout do usuário' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  async logout(
    @Req()
    req: {
      user: {
        userId: string;
      };
    },
  ): Promise<LogoutResponse> {
    const userId = req.user.userId;

    return await firstValueFrom(
      this.authClient.send('auth.logout', { userId }),
    );
  }
}
