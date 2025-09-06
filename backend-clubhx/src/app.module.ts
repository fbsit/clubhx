// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubModule } from './club/club.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '2805',
      database: 'clubhx',
      autoLoadEntities: true,   // ✅ que Nest registre automáticamente las entidades
      synchronize: true,        // ⚠️ solo dev
    }),
    ClubModule,                 // ✅ tu módulo raíz de features
  ],
})
export class AppModule {}
