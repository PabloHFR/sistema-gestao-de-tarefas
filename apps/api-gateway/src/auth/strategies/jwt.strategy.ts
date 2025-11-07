import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Estratégia JWT com Passport que valida o token e extrai dados do usuário
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Extrai o token do header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  //
  validate(payload: { sub: string; email: string; username: string }) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    // Retorna os dados do usuário que serão anexados à request
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}
