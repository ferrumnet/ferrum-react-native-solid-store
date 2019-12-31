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
const ferrum_plumbing_1 = require("ferrum-plumbing");
const SchemaUtils_1 = require("../schema/SchemaUtils");
class SolidUnsecureStorage {
    constructor(storage, schemaRegistry, schema) {
        this.storage = storage;
        this.schemaRegistry = schemaRegistry;
        this.schema = schema;
    }
    /**
     * The load process:
     * - Get the value
     * - Validate with the schema
     * - If upgrade is required, upgrade it
     * @param dataKey the key
     */
    load(dataKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${this.schema}/${dataKey}`;
            let value = yield this.loadItem(key);
            if (!value) {
                return undefined;
            }
            const schemaVer = SchemaUtils_1.SchemaUtils.ver(value.version).major;
            const latestVer = this.schemaRegistry.getLastVersion(this.schema);
            if (latestVer > schemaVer) { // data upgrade is needed
                const newValue = yield this.upgradeData(value, schemaVer, latestVer);
                yield this.saveItem(`${key}.${schemaVer}.bak`, newValue);
                yield this.saveItem(key, value); // Save back the upgraded value
            }
            return value;
        });
    }
    remove(key) {
        return this.removeItem(key);
    }
    /**
     * Save process:
     * - Validate the value
     * -
     * @param key the key
     * @param val the value
     */
    save(key, val) {
        return __awaiter(this, void 0, void 0, function* () {
            this.schemaRegistry.validate(val);
            yield this.saveItem(key, val);
        });
    }
    loadItem(dataKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${this.schema}/${dataKey}`;
            return yield this.storage.load(key);
        });
    }
    upgradeData(value, ver, targetVer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ver == targetVer) {
                return value;
            }
            const upgrader = this.schemaRegistry.getVersionBumper(this.schema, ver);
            if (!upgrader) {
            }
            const upgradedValue = upgrader(value);
            const upgradedVer = SchemaUtils_1.SchemaUtils.ver(upgradedValue.version).major;
            ferrum_plumbing_1.ValidationUtils.isTrue(upgradedVer === ver + 1, `Schema version bumper '${this.schema}' has moved version more than one from ${ver} to ${upgradedVer}`);
            return this.upgradeData(upgradedValue, upgradedVer, targetVer);
        });
    }
    removeItem(dataKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${this.schema}/${dataKey}`;
            return this.storage.remove(key);
        });
    }
    saveItem(dataKey, val) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${this.schema}/${dataKey}`;
            return this.storage.save(key, val);
        });
    }
}
exports.SolidUnsecureStorage = SolidUnsecureStorage;
//# sourceMappingURL=SolidUnsecureStorage.js.map