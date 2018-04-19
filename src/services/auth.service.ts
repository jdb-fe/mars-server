import * as jwt from 'jsonwebtoken';
import { Component } from '@nestjs/common';
import { JwtPayload } from '../components/jwt.strategy';
import Config from '../config';

@Component()
export class AuthService {
    async createToken() {
        const expiresIn = 3600;
        const user: JwtPayload = { email: 'test@email.com' };
        return {
            expiresIn: expiresIn,
            accessToken: jwt.sign(user, Config.jwtSecret, { expiresIn }),
        };
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        // put some validation logic here
        // for example query user by id/email/username
        return {};
    }
}
