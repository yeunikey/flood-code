import { json, urlencoded } from 'express';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors();
  app.setGlobalPrefix('v1');
  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));


  const volumesDir = path.join(process.cwd(), 'uploads');
  const mbtilesDir = path.join(volumesDir, 'mbtiles');
  const uploadsDir = path.join(volumesDir, 'geo');


  [volumesDir, mbtilesDir, uploadsDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });


  app.use('/tileserver', express.static(mbtilesDir));


  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🗺️ TileServer: http://localhost:${port}/tileserver`);
}


bootstrap();