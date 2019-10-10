"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ferrum_plumbing_1 = require("ferrum-plumbing");
class SchemaUtils {
    static ver(version) {
        const [major, minor] = version.split('.');
        const majorNum = Number(major || '');
        const minorNum = Number(minor || '');
        ferrum_plumbing_1.ValidationUtils.isTrue(Number.isInteger(majorNum) && majorNum > 0, 'No major version in ' + version);
        ferrum_plumbing_1.ValidationUtils.isTrue(Number.isInteger(minorNum), 'No minor version in ' + version);
        return {
            major: majorNum,
            minor: minorNum,
        };
    }
}
exports.SchemaUtils = SchemaUtils;
//# sourceMappingURL=SchemaUtils.js.map