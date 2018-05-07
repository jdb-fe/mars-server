import { Module } from '@nestjs/common';
import { CommonModule } from './common.module';

import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';
import { LocalStrategy } from '../services/local.strategy';
import { AuthController } from '../controllers/auth.controller';

@Module({
    imports: [CommonModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    exports: [AuthService]
})
export class AuthModule {}
