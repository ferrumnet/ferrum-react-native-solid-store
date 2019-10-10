import { JsonStorage } from 'ferrum-plumbing';
import { SchemaRegistry } from "../schema/SchemaRegistry";
import { ObjectWithSchema } from "../schema/SchemaDef";
export declare class SolidUnsecureStorage implements JsonStorage {
    private storage;
    protected schemaRegistry: SchemaRegistry;
    protected schema: string;
    constructor(storage: JsonStorage, schemaRegistry: SchemaRegistry, schema: string);
    /**
     * The load process:
     * - Get the value
     * - Validate with the schema
     * - If upgrade is required, upgrade it
     * @param dataKey the key
     */
    load(dataKey: string): Promise<ObjectWithSchema>;
    remove(key: string): Promise<void>;
    /**
     * Save process:
     * - Validate the value
     * -
     * @param key the key
     * @param val the value
     */
    save(key: string, val: ObjectWithSchema): Promise<void>;
    protected loadItem(dataKey: string): Promise<any>;
    protected upgradeData(value: ObjectWithSchema, ver: number, targetVer: number): Promise<ObjectWithSchema>;
    protected removeItem(dataKey: string): Promise<void>;
    protected saveItem(dataKey: string, val: ObjectWithSchema): Promise<void>;
}
//# sourceMappingURL=SolidUnsecureStorage.d.ts.map