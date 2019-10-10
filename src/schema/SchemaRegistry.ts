import {Injectable, ValidationUtils} from "ferrum-plumbing";
import {ObjectWithSchema, Schema, ValidationRule} from "./SchemaDef";
import {SchemaUtils} from "./SchemaUtils";
import {DataTypeValidator} from "./DataTypeValidator";

export const StandardRules = {
    STRING: {
        type: 'string',
        validator: (v: any) => DataTypeValidator.isString(v) ? undefined : 'Not an string',
    } as ValidationRule,
    NUMBER: {
        type: 'number',
        validator: (v: any) => DataTypeValidator.isNumber(v) ? undefined : 'Not a number',
    },
    HEX: {
        type: 'hex',
        validator: (v: any) => DataTypeValidator.isHex(v) ? undefined : 'Not a hex string',
    },
};

export type SchemaVersionUpgrader = (v: ObjectWithSchema) => ObjectWithSchema;

export class SchemaRegistry implements Injectable {
    private schema: Map<string, Schema> = new Map<string, Schema>();
    private schemaUpgrader: Map<string, SchemaVersionUpgrader> = new Map<string, SchemaVersionUpgrader>();
    private lastVersion: Map<string, number> = new Map<string, number>();

    register(schema: Schema) {
        const key = `${schema.name}:${schema.version}`;
        const ver = SchemaUtils.ver(schema.version);
        this.schema.set(key, {...schema, rules: {...schema.rules}});
        this.lastVersion.set(schema.name, Math.max(ver.major, this.lastVersion.get(key) || 0));
    }

    registerVersionBumper(schema: string, majorVersion: number, upgrader: SchemaVersionUpgrader) {
        const key = `${schema}:${majorVersion}`;
        this.schemaUpgrader.set(key, upgrader);
    }

    getVersionBumper(schema: string, majorVersion: number): SchemaVersionUpgrader | undefined {
        const key = `${schema}:${majorVersion}`;
        return this.schemaUpgrader.get(key)!;
    }

    getLastVersion(schemaName: string) {
        return this.lastVersion.get(schemaName);
    }

    validate(data: ObjectWithSchema) {
        const majorVer = SchemaUtils.ver(data.version).major;
        const latestVer = this.getLastVersion(data.schema);
        ValidationUtils.isTrue(majorVer === latestVer,
            `Object being stored has schema version ${data.version} while `);
        const key = `${data.schema}:${data.version}`;
        ValidationUtils.isTrue(this.schema.has(key), `Schema with key '${key}' is not registered`);
        const sch = this.schema.get(key)!;
        Object.keys(sch.rules).forEach(k => {
            const rule = sch.rules[k]! as ValidationRule;
            const value = data.fields[k];
            ValidationUtils.isTrue(
                rule.required && (value === undefined || value === null),
                `Required field ${k} was not provided`);
            const err = rule.validator(data.fields[k]);
            ValidationUtils.isTrue(!err, `Validation error on field '${k}': ${err}`);
        });
    }

    __name__(): string { return 'SchemaRegistry'; }
}
