import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entity/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Registra usuário
  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Verifica se email já existe
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email já cadastrado.');
    }

    // Verifica se username já existe
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Nome de usuário já cadastrado.');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Cria usuário
    const user = this.userRepository.create({
      email,
      username,
      passwordHash,
    });

    await this.userRepository.save(user);

    // Gera tokens JWT
    const tokens = await this.generateTokens(user);

    // Salva refresh token no banco
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    // Busca usuário por email ou username
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Compara senhas
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera novos tokens
    const tokens = await this.generateTokens(user);

    // Atualiza refresh token no banco
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    // Busca usuário
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Acesso negado');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Acesso negado');
    }

    // Gerar novos tokens
    const tokens = await this.generateTokens(user);

    // Atualizar refresh token no banco
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // Logout de usuário
  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshTokenHash: '' });
    return { message: 'Logout realizado com sucesso' };
  }

  // Valida usuário por ID (para os Guards)
  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  // Gera access e refresh token para o usuário
  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    // Pega as variáveis de ambiente
    const accessExpiration = this.configService.getOrThrow(
      'JWT_ACCESS_EXPIRATION',
    );
    const refreshExpiration = this.configService.getOrThrow(
      'JWT_REFRESH_EXPIRATION',
    );

    const [accessToken, refreshToken] = await Promise.all([
      // Access token com expiração curta
      this.jwtService.signAsync(payload, { expiresIn: accessExpiration }),
      // Refresh token com expiração longa
      this.jwtService.signAsync(payload, { expiresIn: refreshExpiration }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshTokenHash });
  }
}
