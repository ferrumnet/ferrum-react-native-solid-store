import {SchemaVersion} from "./SchemaDef";
import {ValidationUtils} from "ferrum-plumbing";

export class SchemaUtils {
    static ver(version: string): SchemaVersion {
        const [major, minor] = version.split('.');
        const majorNum = Number(major || '');
        const minorNum = Number(minor || '');
        ValidationUtils.isTrue(Number.isInteger(majorNum) && majorNum > 0, 'No major version in ' + version);
        ValidationUtils.isTrue(Number.isInteger(minorNum), 'No minor version in ' + version);
        return {
            major: majorNum,
            minor: minorNum,
        }
    }
}
