import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity } from '../entities/config.entity';

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
        @InjectRepository(ConfigEntity)
        private readonly repository: Repository<ConfigEntity>,
    ) {}

    get(): Promise<ConfigEntity> {
        return this.repository.findOne({
            cache: 60000,
        });
    }

    async update(data: IConfig): Promise<ConfigEntity> {
        let config = await this.get();
        if (!config) {
            config = new ConfigEntity();
        }
        Object.assign(config, data);
        return this.repository.save(config);
    }
}
