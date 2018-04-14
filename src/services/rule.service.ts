import { parse } from 'url';
import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Rule } from '../entities/rule.entity';

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
        @InjectRepository(Rule)
        private readonly repository: Repository<Rule>,
    ) { }

    insert(data: IRule) {
        const rule = new Rule();
        Object.assign(rule, data);
        return this.repository.save(rule);
    }

    findById(id: number) {
        return this.repository.findOneById(id);
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

    async updateById(id: number, data: Object) {
        const rule = await this.findById(id);
        Object.assign(rule, data);
        return this.repository.save(rule);
    }
}
