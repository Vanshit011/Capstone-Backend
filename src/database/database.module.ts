import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options = typeOrmConfig;
        return {
          ...options,
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || options.host,
          port: configService.get<number>('DB_PORT')
            ? Number(configService.get('DB_PORT'))
            : options.port,
          username:
            configService.get<string>('DB_USERNAME') || options.username,
          password:
            configService.get<string>('DB_PASSWORD') || options.password,
          database:
            configService.get<string>('DB_DATABASE') || options.database,
          synchronize: configService.get<string>('NODE_ENV') === 'test',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
