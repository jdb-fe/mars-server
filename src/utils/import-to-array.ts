export default function importToArray<Key extends string, PropType>(importObject: Record<Key, PropType>): PropType[] {
    const keys = Object.getOwnPropertyNames(importObject);

    // ES6 / TypeScript exports contain a __esModule property. Don't include that.
    return keys.filter(key => key.indexOf('__') !== 0).map(key => importObject[key]);
}
