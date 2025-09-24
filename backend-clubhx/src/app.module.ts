// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClubModule } from './club/club.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const synchronize = config.get<string>('DB_SYNCHRONIZE', 'true') === 'true';
        const ssl = config.get<string>('DB_SSL', 'false') === 'true';

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize,
            ssl,
          } as const;
        }

        const host = config.get<string>('PGHOST') ?? config.get<string>('DB_HOST', 'localhost');
        const port = parseInt(
          config.get<string>('PGPORT') ?? config.get<string>('DB_PORT', '5432'),
          10,
        );
        const username = config.get<string>('PGUSER') ?? config.get<string>('DB_USER', 'root');
        const password = config.get<string>('PGPASSWORD') ?? config.get<string>('DB_PASSWORD', 'password');
        const database = config.get<string>('PGDATABASE') ?? config.get<string>('DB_NAME', 'clubhx'); 

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize,
          ssl,
        } as const;
      },
    }),
    ClubModule,                 // ✅ tu módulo raíz de features
  ],
})
export class AppModule {}
