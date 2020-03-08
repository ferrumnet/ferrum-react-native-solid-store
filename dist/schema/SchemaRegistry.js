"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ferrum_plumbing_1 = require("ferrum-plumbing");
const SchemaUtils_1 = require("./SchemaUtils");
const DataTypeValidator_1 = require("./DataTypeValidator");
exports.StandardRules = {
    STRING: {
        type: 'string',
        validator: (v) => DataTypeValidator_1.DataTypeValidator.isString(v) ? undefined : 'Not an string',
    },
    NUMBER: {
        type: 'number',
        validator: (v) => DataTypeValidator_1.DataTypeValidator.isNumber(v) ? undefined : 'Not a number',
    },
    HEX: {
        type: 'hex',
        validator: (v) => DataTypeValidator_1.DataTypeValidator.isHex(v) ? undefined : 'Not a hex string',
    },
};
class SchemaRegistry {
    constructor() {
        this.schema = new Map();
        this.schemaUpgrader = new Map();
        this.lastVersion = new Map();
    }
    register(schema) {
        const key = `${schema.name}:${schema.version}`;
        const ver = SchemaUtils_1.SchemaUtils.ver(schema.version);
        this.schema.set(key, Object.assign(Object.assign({}, schema), { rules: Object.assign({}, schema.rules) }));
        this.lastVersion.set(schema.name, Math.max(ver.major, this.lastVersion.get(key) || 0));
    }
    registerVersionBumper(schema, majorVersion, upgrader) {
        const key = `${schema}:${majorVersion}`;
        this.schemaUpgrader.set(key, upgrader);
    }
    getVersionBumper(schema, majorVersion) {
        const key = `${schema}:${majorVersion}`;
        return this.schemaUpgrader.get(key);
    }
    getLastVersion(schemaName) {
        return this.lastVersion.get(schemaName);
    }
    validate(data) {
        const majorVer = SchemaUtils_1.SchemaUtils.ver(data.version).major;
        const latestVer = this.getLastVersion(data.schema);
        ferrum_plumbing_1.ValidationUtils.isTrue(majorVer === latestVer, `Object being stored has schema version ${data.version} while expected version is ${latestVer}`);
        const key = `${data.schema}:${data.version}`;
        ferrum_plumbing_1.ValidationUtils.isTrue(this.schema.has(key), `Schema with key '${key}' is not registered`);
        const sch = this.schema.get(key);
        Object.keys(sch.rules).forEach(k => {
            const rule = sch.rules[k];
            const value = data.fields[k];
            ferrum_plumbing_1.ValidationUtils.isTrue(!rule.required || (value !== undefined && value !== null), `Required field ${k} was not provided`);
            const err = rule.validator(data.fields[k]);
            ferrum_plumbing_1.ValidationUtils.isTrue(!err, `Validation error on field '${k}': ${err}`);
        });
    }
    __name__() { return 'SchemaRegistry'; }
}
exports.SchemaRegistry = SchemaRegistry;
//# sourceMappingURL=SchemaRegistry.js.map