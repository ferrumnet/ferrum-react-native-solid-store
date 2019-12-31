import {JsonStorage, ValidationUtils} from 'ferrum-plumbing';
import {SchemaRegistry} from "../schema/SchemaRegistry";
import {ObjectWithSchema} from "../schema/SchemaDef";
import {SchemaUtils} from "../schema/SchemaUtils";

export class SolidUnsecureStorage implements JsonStorage {
    constructor(
        private storage: JsonStorage,
        protected schemaRegistry: SchemaRegistry,
        protected schema: string) {
    }

    /**
     * The load process:
     * - Get the value
     * - Validate with the schema
     * - If upgrade is required, upgrade it
     * @param dataKey the key
     */
    async load(dataKey: string): Promise<ObjectWithSchema|undefined> {
        const key = `${this.schema}/${dataKey}`;
        let value = await this.loadItem(key) as ObjectWithSchema;
        if (!value) {
            return undefined;
        }
        const schemaVer = SchemaUtils.ver(value.version).major;
        const latestVer = this.schemaRegistry.getLastVersion(this.schema)!;
        if (latestVer > schemaVer) { // data upgrade is needed
            const newValue = await this.upgradeData(value, schemaVer, latestVer);
            await this.saveItem(`${key}.${schemaVer}.bak`, newValue);
            await this.saveItem(key, value); // Save back the upgraded value
        }
        return value;
    }

    remove(key: string): Promise<void> {
        return this.removeItem(key);
    }

    /**
     * Save process:
     * - Validate the value
     * -
     * @param key the key
     * @param val the value
     */
    async save(key: string, val: ObjectWithSchema): Promise<void> {
        this.schemaRegistry.validate(val);
        await this.saveItem(key, val);
    }

    protected async loadItem(dataKey: string) {
        const key = `${this.schema}/${dataKey}`;
        return await this.storage.load(key) as any;
    }

    protected async upgradeData(value: ObjectWithSchema, ver: number, targetVer: number): Promise<ObjectWithSchema> {
        if (ver == targetVer) {
            return value;
        }
        const upgrader = this.schemaRegistry.getVersionBumper(this.schema, ver);
        if (!upgrader) {

        }
        const upgradedValue = upgrader!(value);
        const upgradedVer = SchemaUtils.ver(upgradedValue.version).major;
        ValidationUtils.isTrue(upgradedVer === ver + 1,
        `Schema version bumper '${this.schema}' has moved version more than one from ${ver} to ${upgradedVer}`);
        return this.upgradeData(upgradedValue, upgradedVer, targetVer);
    }

    protected async removeItem(dataKey: string) {
        const key = `${this.schema}/${dataKey}`;
        return this.storage.remove(key);
    }

    protected async saveItem(dataKey: string, val: ObjectWithSchema) {
        const key = `${this.schema}/${dataKey}`;
        return this.storage.save(key, val);
    }
}
