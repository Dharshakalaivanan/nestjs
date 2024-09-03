// src/product/product.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async getProducts(query: any): Promise<Product[]> {
    const { name, status, price } = query;
    const where: any = {};

    if (name) {
      where.name = name;
    }
    if (status) {
      where.status_ = Number(status);
    }
    if (price) {
      where.price = Number(price);
    }

    return this.productRepository.find({ where });
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.getProductById(id);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
