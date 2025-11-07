import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CommentsQueryDto {
  @IsOptional()
  @Type(() => Number) // Transforma string em número
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser no mínimo 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Tamanho deve ser um número inteiro' })
  @Min(1, { message: 'Tamanho deve ser no mínimo 1' })
  @Max(100, { message: 'Tamanho deve ser no máximo 100' })
  size?: number = 10;
}
