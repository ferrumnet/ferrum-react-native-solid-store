
export class DataTypeValidator {
    static isString(v: any): boolean {
        return typeof v === 'string';
    }

    static isHex(hex: any): boolean {
        return ((DataTypeValidator.isString(hex) || DataTypeValidator.isNumber(hex))
            && /^(-0x|0x)?[0-9a-f]*$/i.test(hex));
    }

    static isNumber(v: any): boolean {
        const num = Number(v);
        return Number.isFinite(num);
    }
}
