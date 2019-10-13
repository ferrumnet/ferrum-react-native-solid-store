import { Injectable, JsonStorage, StringStorage } from "ferrum-plumbing";
import { SolidSecureStorage } from "./SolidSecureStorage";
import { CryptorService } from "ferrum-crypto";
import { SchemaRegistry } from "../schema/SchemaRegistry";
export declare class SolidSecureStorageFactory implements Injectable {
    private secureStorage;
    private unsecureStorage;
    private cryptoSvc;
    private schemaRegistry;
    private schemaList;
    constructor(secureStorage: StringStorage, unsecureStorage: JsonStorage, cryptoSvc: CryptorService, schemaRegistry: SchemaRegistry);
    forSchema(schema: string): SolidSecureStorage;
    __name__(): string;
}
//# sourceMappingURL=SolidSecureStorageFactory.d.ts.map