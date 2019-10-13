import {Injectable, JsonStorage, StringStorage} from "ferrum-plumbing";
import {SolidSecureStorage} from "./SolidSecureStorage";
import {CryptorService} from "ferrum-crypto";
import {SchemaRegistry} from "../schema/SchemaRegistry";

export class SolidSecureStorageFactory implements Injectable {
    private schemaList = new Map<string, SolidSecureStorage>();
    constructor(
        private secureStorage: StringStorage,
        private unsecureStorage: JsonStorage,
        private cryptoSvc: CryptorService,
        private schemaRegistry: SchemaRegistry,) { }

    forSchema(schema: string): SolidSecureStorage {
        if (!this.schemaList.has(schema)) {
            const storage = new SolidSecureStorage(
                this.secureStorage, this.unsecureStorage, this.cryptoSvc, this.schemaRegistry, schema);
            this.schemaList.set(schema, storage);
        }
        return this.schemaList.get(schema)!;
    }

    __name__(): string {return 'SolidSecureStorageFactory';}
}
