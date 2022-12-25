import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as moment from 'moment';
import { ConfigModule } from '@nestjs/config';

const format = winston.format.combine(
  winston.format.timestamp(),
  utilities.format.nestLike('log'),
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: 'schema.gql',
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          dirname: `./logData/${moment(new Date()).format('YYYY-MM-DD')}`,
          filename: `${moment(new Date()).format('YYYY-MM-DD')}.log`,
          format: format,
        }),
      ],
    }),
    UserModule,
    AuthModule,
    BoardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
