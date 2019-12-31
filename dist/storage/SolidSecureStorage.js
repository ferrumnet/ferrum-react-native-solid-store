"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SolidUnsecureStorage_1 = require("./SolidUnsecureStorage");
const ferrum_crypto_1 = require("ferrum-crypto");
class SolidSecureStorage extends SolidUnsecureStorage_1.SolidUnsecureStorage {
    constructor(secureStorage, unsecureStorage, cryptoSvc, schemaRegistry, schema) {
        super(unsecureStorage, schemaRegistry, schema);
        this.secureStorage = secureStorage;
        this.unsecureStorage = unsecureStorage;
        this.cryptoSvc = cryptoSvc;
    }
    loadItem(dataKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullKey = `${dataKey}`;
            const encKeyForSession = yield this.secureStorage.getItem(fullKey);
            if (!encKeyForSession) {
                return undefined;
            }
            const encSessionData = yield this.unsecureStorage.load(fullKey);
            const sessionDataStr = yield this.cryptoSvc.decryptToHex({ key: encKeyForSession, data: encSessionData.value });
            return JSON.parse(ferrum_crypto_1.hexToUtf8(sessionDataStr));
        });
    }
    removeItem(dataKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullKey = `${this.schema}/${dataKey}`;
            yield this.secureStorage.removeItem(fullKey);
            yield this.unsecureStorage.remove(fullKey);
        });
    }
    saveItem(dataKey, val) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullKey = `${this.schema}/${dataKey}`;
            const payloadString = JSON.stringify(val);
            const encryptedData = yield this.cryptoSvc.encryptHex(ferrum_crypto_1.utf8ToHex(payloadString));
            yield this.secureStorage.setItem(fullKey, encryptedData.key);
            yield this.unsecureStorage.save(fullKey, { value: encryptedData.data });
        });
    }
}
exports.SolidSecureStorage = SolidSecureStorage;
//# sourceMappingURL=SolidSecureStorage.js.map