import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from '../entities/config.entity';

export interface IConfig {
    mail?: {
        user: string;
        pass: string;
        host: string;
    };
    subscriber?: [string];
    mercury?: string;
}

@Component()
export class ConfigService {
    constructor(
        @InjectRepository(Config)
        private readonly repository: Repository<Config>,
    ) {}

    get(): Promise<Config> {
        return this.repository.findOne({
            cache: 60000,
        });
    }

    async update(data: IConfig): Promise<Config> {
        let config = await this.get();
        if (!config) {
            config = new Config();
        }
        Object.assign(config, data);
        return this.repository.save(config);
    }
}
