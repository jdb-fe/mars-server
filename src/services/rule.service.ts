import { parse } from 'url';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Rule } from '../entities/rule.entity';

export interface IRule {
    host: string;
    path?: string;
    title: string;
    thumb?: string;
    description?: string;
    html: string;
}

@Injectable()
export class RuleService {
    constructor(
        @InjectRepository(Rule)
        private readonly repository: Repository<Rule>,
    ) { }

    insert(data: IRule) {
        return this.repository.insert(data);
    }

    findById(id: number) {
        return this.repository.findOne(id);
    }

    async findByUrl(link: string) {
        const parsed = parse(link);
        const rules = await this.repository.find({ host: parsed.host });
        const findRule = rules.find(rule => {
            if (rule.path && parsed.path && new RegExp(rule.path).test(parsed.path)) {
                return true;
            }
        });
        return findRule || rules[0];
    }

    updateById(id: number, data: DeepPartial<Rule>) {
        data.id = id;
        return this.repository.save(data);
    }
}
