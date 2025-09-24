import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👉 habilitar CORS
  app.enableCors({
    origin: [
      'http://localhost:8080',   // front dev
      'http://127.0.0.1:3000',
      'https://frontend-clubhx-production.up.railway.app',
      'https://clubhx.up.railway.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // necesario si usas cookies, sesiones o auth headers
  });

  app.setGlobalPrefix(''); // si quieres prefijo vacío, aunque puedes omitirlo

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('ClubHX API')
    .setDescription('Documentación de endpoints internos de ClubHX (gateway y módulos locales)')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'ClubHX API Docs',
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
