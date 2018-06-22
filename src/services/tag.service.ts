import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tag) private readonly repository: Repository<Tag>) {}
    findByName(name: string) {
        return this.repository.findOne({ name });
    }
    addTags(tags: string[]) {
        return Promise.all(
            tags.map(tagName =>
                this.findByName(tagName).then(tagEntity => {
                    if (!tagEntity) {
                        tagEntity = new Tag();
                        tagEntity.name = tagName;
                    }
                    return tagEntity;
                })
            )
        );
    }
}
