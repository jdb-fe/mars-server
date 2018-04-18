import { parse } from 'url';
import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuleEntity } from '../entities/rule.entity';

export interface IRule {
    host: string;
    path?: string;
    title: string;
    thumb?: string;
    description?: string;
    html: string;
}

@Component()
export class RuleService {
    constructor(
        @InjectRepository(RuleEntity)
        private readonly repository: Repository<RuleEntity>,
    ) { }

    insert(data: IRule): Promise<RuleEntity> {
        const rule = new RuleEntity();
        Object.assign(rule, data);
        return this.repository.save(rule);
    }

    findById(id: number): Promise<RuleEntity> {
        return this.repository.findOneById(id);
    }

    async findByUrl(link: string): Promise<RuleEntity> {
        const parsed = parse(link);
        const rules = await this.repository.find({ host: parsed.host });
        const findRule = rules.find(rule => {
            if (rule.path && parsed.path && new RegExp(rule.path).test(parsed.path)) {
                return true;
            }
        });
        return findRule || rules[0];
    }

    async updateById(id: number, data: Object): Promise<RuleEntity> {
        const rule = await this.findById(id);
        Object.assign(rule, data);
        return this.repository.save(rule);
    }
}
