"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SolidSecureStorage_1 = require("./SolidSecureStorage");
class SolidSecureStorageFactory {
    constructor(secureStorage, unsecureStorage, cryptoSvc, schemaRegistry) {
        this.secureStorage = secureStorage;
        this.unsecureStorage = unsecureStorage;
        this.cryptoSvc = cryptoSvc;
        this.schemaRegistry = schemaRegistry;
        this.schemaList = new Map();
    }
    forSchema(schema) {
        if (!this.schemaList.has(schema)) {
            const storage = new SolidSecureStorage_1.SolidSecureStorage(this.secureStorage, this.unsecureStorage, this.cryptoSvc, this.schemaRegistry, schema);
            this.schemaList.set(schema, storage);
        }
        return this.schemaList.get(schema);
    }
    __name__() { return 'SolidSecureStorageFactory'; }
}
exports.SolidSecureStorageFactory = SolidSecureStorageFactory;
//# sourceMappingURL=SolidSecureStorageFactory.js.map