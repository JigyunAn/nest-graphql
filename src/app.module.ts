import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as moment from 'moment';

const format = winston.format.combine(
  winston.format.timestamp(),
  utilities.format.nestLike('log', { prettyPrint: true }),
);

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => {
        return { token: req.headers['token'] };
      },
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
