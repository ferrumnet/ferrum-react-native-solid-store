import { Injectable } from "ferrum-plumbing";
import { ObjectWithSchema, Schema, ValidationRule } from "./SchemaDef";
export declare const StandardRules: {
    STRING: ValidationRule;
    NUMBER: {
        type: string;
        validator: (v: any) => "Not a number" | undefined;
    };
    HEX: {
        type: string;
        validator: (v: any) => "Not a hex string" | undefined;
    };
};
export declare type SchemaVersionUpgrader = (v: ObjectWithSchema) => ObjectWithSchema;
export declare class SchemaRegistry implements Injectable {
    private schema;
    private schemaUpgrader;
    private lastVersion;
    register(schema: Schema): void;
    registerVersionBumper(schema: string, majorVersion: number, upgrader: SchemaVersionUpgrader): void;
    getVersionBumper(schema: string, majorVersion: number): SchemaVersionUpgrader | undefined;
    getLastVersion(schemaName: string): number | undefined;
    validate(data: ObjectWithSchema): void;
    __name__(): string;
}
//# sourceMappingURL=SchemaRegistry.d.ts.map