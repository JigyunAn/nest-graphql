import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModuleOptions } from './jwt/jwt.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    ConfigService,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        AuthService,
      ],
      exports: [AuthService],
    };
  }
}
