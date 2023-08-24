import { NestFactory } from '@nestjs/core';
import { Modules } from './modules';
import { setNestApp } from './common/config/setNestApp';

async function bootstrap() {
  const app = await NestFactory.create(Modules);

  setNestApp(app);
  await app.listen(3000);
}
bootstrap();
