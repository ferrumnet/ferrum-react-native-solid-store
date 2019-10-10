import {JsonStorage, StringStorage} from 'ferrum-plumbing';
import {SchemaRegistry} from '../schema/SchemaRegistry';
import {SolidUnsecureStorage} from './SolidUnsecureStorage';
import {ObjectWithSchema} from '../schema/SchemaDef';
import {CryptorService, hexToUtf8, utf8ToHex} from "ferrum-crypto";

export class SolidSecureStorage extends SolidUnsecureStorage {
    constructor(
        private secureStorage: StringStorage,
        private unsecureStorage: JsonStorage,
        private cryptoSvc: CryptorService,
        schemaRegistry: SchemaRegistry,
        schema: string) {
        super(unsecureStorage, schemaRegistry, schema);
    }

    protected async loadItem(dataKey: string): Promise<ObjectWithSchema> {
        const fullKey = `${this.schema}/${dataKey}`;
        const encKeyForSession = await this.secureStorage.getItem(fullKey);
        const encSessionData = await this.unsecureStorage.load(fullKey) as { value: string };
        const sessionDataStr = await this.cryptoSvc.decryptToHex(
            { key: encKeyForSession, data: encSessionData.value });
        return JSON.parse(hexToUtf8(sessionDataStr)) as ObjectWithSchema;
    }

    protected async removeItem(dataKey: string): Promise<void> {
        const fullKey = `${this.schema}/${dataKey}`;
        await this.secureStorage.removeItem(fullKey);
        await this.unsecureStorage.remove(fullKey);
    }

    protected async saveItem(dataKey: string, val: ObjectWithSchema): Promise<void> {
        const fullKey = `${this.schema}/${dataKey}`;
        const payloadString = JSON.stringify(val);
        const encryptedData = await this.cryptoSvc.encryptHex(utf8ToHex(payloadString));
        await this.secureStorage.setItem(fullKey, encryptedData.key);
        await this.unsecureStorage.save(fullKey, { value: encryptedData.data });
    }
}
