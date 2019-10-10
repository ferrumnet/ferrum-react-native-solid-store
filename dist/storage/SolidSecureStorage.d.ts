import { JsonStorage, StringStorage } from 'ferrum-plumbing';
import { SchemaRegistry } from '../schema/SchemaRegistry';
import { SolidUnsecureStorage } from './SolidUnsecureStorage';
import { ObjectWithSchema } from '../schema/SchemaDef';
import { CryptorService } from "ferrum-crypto";
export declare class SolidSecureStorage extends SolidUnsecureStorage {
    private secureStorage;
    private unsecureStorage;
    private cryptoSvc;
    constructor(secureStorage: StringStorage, unsecureStorage: JsonStorage, cryptoSvc: CryptorService, schemaRegistry: SchemaRegistry, schema: string);
    protected loadItem(dataKey: string): Promise<ObjectWithSchema>;
    protected removeItem(dataKey: string): Promise<void>;
    protected saveItem(dataKey: string, val: ObjectWithSchema): Promise<void>;
}
//# sourceMappingURL=SolidSecureStorage.d.ts.map