import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  // Paginação padrão: page=1, size=10
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page deve ser um número inteiro' })
  @Min(1, { message: 'Page deve ser no mínimo 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Size deve ser um número inteiro' })
  @Min(1, { message: 'Size deve ser no mínimo 1' })
  @Max(100, { message: 'Size deve ser no máximo 100' }) // No máximo size=100 para evitar queries pesadas
  size?: number = 10;
}
