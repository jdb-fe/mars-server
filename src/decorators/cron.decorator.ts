import 'reflect-metadata';
import { RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit} from 'node-schedule'

export function Cron(rule: RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string): MethodDecorator {
    return function(target: object, key: string, descriptor) {
        if (key !== 'start' && key !== 'stop') {
            Reflect.defineMetadata(key, rule, target);
        }
        return descriptor;
    }
}
