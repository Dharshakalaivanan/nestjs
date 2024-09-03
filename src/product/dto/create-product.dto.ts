// src/product/dto/create-product.dto.ts

import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  launch_data: string;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsNumber()
  status_: number;
}
