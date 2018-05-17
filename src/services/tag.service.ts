import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag) private readonly repository: Repository<Tag>,
    ) {}
    findByName(name: string) {
        return this.repository.findOne({ name });
    }
}
