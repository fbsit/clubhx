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

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
          username: config.get<string>('DB_USER', 'postgres'),
          password: config.get<string>('DB_PASSWORD', ''),
          database: config.get<string>('DB_NAME', 'clubhx'),
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
