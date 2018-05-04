import { Module } from '@nestjs/common';
import { CommonModule } from './common.module';

import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';

@Module({
    imports: [CommonModule],
    components: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
