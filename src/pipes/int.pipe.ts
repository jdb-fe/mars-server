import {
    PipeTransform,
    Injectable,
    BadRequestException,
    ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class IntPipe implements PipeTransform<string> {
    /**
     * 参数是否必选
     */
    private required: boolean;
    constructor(required = true) {
        this.required = required;
    }
    transform(value: string, metadata: ArgumentMetadata): number | undefined {
        if (!this.required && typeof value === 'undefined') {
            return undefined;
        }
        const val = +value;
        if (isNaN(val)) {
            throw new BadRequestException(
                `Validation failed: ${metadata.data} must be a numeric string`,
            );
        }
        return val;
    }
}
