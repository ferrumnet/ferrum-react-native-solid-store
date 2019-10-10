
export interface SchemaVersion {
    major: number;
    minor: number;
}

export interface ValidationRule {
    required: boolean,
    type: 'string' | 'hex' | 'number' | 'custom',
    validator: (v: any) => string | undefined;
}

export interface Schema {
    name: string;
    version: string;
    rules: { [k: string]: ValidationRule }
}

export interface ObjectWithSchema {
    version: string;
    schema: string;
    fields: { [k: string]: any };
}

