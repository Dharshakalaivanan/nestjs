import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
//import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',  
      password: 'root',   
      database: 'profilepro',   
     synchronize: true, 
     entities: [Product], 
    }),
    ProductModule,  CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
