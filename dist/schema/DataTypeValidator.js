"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataTypeValidator {
    static isString(v) {
        return typeof v === 'string';
    }
    static isHex(hex) {
        return ((DataTypeValidator.isString(hex) || DataTypeValidator.isNumber(hex))
            && /^(-0x|0x)?[0-9a-f]*$/i.test(hex));
    }
    static isNumber(v) {
        const num = Number(v);
        return Number.isFinite(num);
    }
}
exports.DataTypeValidator = DataTypeValidator;
//# sourceMappingURL=DataTypeValidator.js.map