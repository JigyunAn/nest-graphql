import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jigyun',
  password: '123123',
  database: 'nest-graphql',
  entities: [__dirname + '../**/*.entity.{js,ts}'],
  synchronize: true,
};
