/**
 * @author WMXPY
 * @namespace Error
 * @description List
 */

import { ERROR_CODE } from "./code";

export const ERROR_LIST: Record<ERROR_CODE, string> = {

    [ERROR_CODE.INVALID_AUTHORIZATION_FIELD]: 'Invalid Authorization Field',
    [ERROR_CODE.INVALID_TOKEN]: 'Invalid Token',

    [ERROR_CODE.APPLICATION_NOT_INITIALIZED]: 'Application Not Initialized',
    [ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1]: 'Environment Variable Required But Not Found, {}',

    [ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1]: 'Application Initialized With Info Missing, {}',
};
