export class GenericUtils {
    static otherKeysExcept(obj, key){
        if (typeof obj !== 'object' || obj === null) return false;
        return Object.keys(obj).some(k => k !== key);
    };
}

