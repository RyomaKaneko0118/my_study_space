import { NestFactory } from '@nestjs/core';
import { MessagesModule } from './messages/messages.module'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MessagesModule);
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by')
    res.removeHeader('date')
    next()
  }
  )
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
