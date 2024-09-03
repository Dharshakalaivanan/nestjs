// src/product/entities/product.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  launch_data: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column('int')
  status_: number;
}
