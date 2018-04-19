import * as passport from 'passport';
import { Module } from '@nestjs/common';
import { CommonModule } from './common.module';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../components/jwt.strategy';
import { AuthController } from '../controllers/auth.controller';

@Module({
    imports: [CommonModule],
    components: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
