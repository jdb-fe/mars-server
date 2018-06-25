import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindOneOptions } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}
    findByOpenId(openid: string) {
        return this.repository.findOneOrFail({ openid });
    }
    findByName(loginname: string) {
        return this.repository.findOne({ loginname });
    }
    findOne(conditions?: FindConditions<User>, options?: FindOneOptions<User>) {
        return this.repository.findOneOrFail(conditions, options);
    }
    findById(id: string | number, options?: FindOneOptions<User>) {
        return this.repository.findOneOrFail(id, options);
    }
}
