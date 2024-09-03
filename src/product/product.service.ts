import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { emptyResponse } from '../utils/response.utils'; 

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('winston') private readonly logger: Logger, 
  ) {}

  async getProduct(name: string, price: number, launch_data: Date): Promise<Product | any> {
    try {
      const [newProduct] = await this.productRepository.query(
        `SELECT * FROM product WHERE name = ? AND price = ? AND launch_data = ? ORDER BY id DESC LIMIT 1`,
        [name, price, launch_data]
      );

      if (!newProduct) {
        return emptyResponse;
      }

      return newProduct;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get product: ${err.message}`, { error: err });
      throw new InternalServerErrorException('Failed to fetch product details');
    }
  }

  async insertProduct(price: number, launch_data: Date, category: string, description: string, status_: number): Promise<void> {
    try {
      await this.productRepository.query(
        `INSERT INTO product (name, price, launch_data, category, description, status_)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [ price, launch_data, category, description, status_]
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to insert product: ${err.message}`, { error: err });
      throw new BadRequestException('Failed to insert product');
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product | any> {
    try {
        const { name, price, launch_data, category, description, status_ } = createProductDto;
        
        const launchDate = new Date(launch_data);

        await this.insertProduct( price, launchDate, category, description, status_);
        
        const newProduct = await this.getProduct(name, price, launchDate);

        return newProduct;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}


  async getProducts(query: any): Promise<Product[]> {
    try {
      const { name, status, price } = query;
      let sql = `SELECT * FROM product WHERE 1=1`;
      const params: any[] = [];

      if (name) {
        sql += ` AND name = ?`;
        params.push(name);
      }
      if (status) {
        sql += ` AND status_ = ?`;
        params.push(Number(status));
      }
      if (price) {
        sql += ` AND price = ?`;
        params.push(Number(price));
      }

      const products = await this.productRepository.query(sql, params);
      return products.length ? products : emptyResponse.response;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get products: ${err.message}`, { error: err });
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async getProductById(id: number): Promise<Product | any> {
    try {
      const [product] = await this.productRepository.query(
        `SELECT * FROM product WHERE id = ?`,
        [id]
      );

      if (!product) {
        this.logger.warn(`Product with ID ${id} not found`);
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return product;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get product by ID: ${err.message}`, { error: err });
      throw new InternalServerErrorException('Failed to fetch product by ID');
    }
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product | any> {
    try {
      const { name, price, launch_data, category, description, status_ } = updateProductDto;

      await this.productRepository.query(
        `UPDATE product SET name = ?, price = ?, launch_data = ?, category = ?, description = ?, status_ = ?
         WHERE id = ?`,
        [name, price, launch_data, category, description, status_, id]
      );

      return await this.getProductById(id);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update product: ${err.message}`, { error: err });
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const result = await this.productRepository.query(
        `DELETE FROM product WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        this.logger.warn(`Product with ID ${id} not found`);
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      this.logger.info(`Product with ID ${id} successfully deleted`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete product: ${err.message}`, { error: err });
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
