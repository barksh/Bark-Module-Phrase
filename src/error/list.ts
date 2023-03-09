/**
 * @author WMXPY
 * @namespace Error
 * @description List
 */

import { ERROR_CODE } from "./code";

export const ERROR_LIST: Record<ERROR_CODE, string> = {

    [ERROR_CODE.INVALID_AUTHORIZATION_FIELD]: 'Invalid Authorization Field',
    [ERROR_CODE.INVALID_TOKEN]: 'Invalid Token',
    [ERROR_CODE.UNABLE_TO_PARSE_TOKEN]: 'Unable To Parse Token',
    [ERROR_CODE.INVALID_SELF_DOMAIN_TOKEN_2]: 'Invalid Self Domain Token, domain: {}, token: {}',
    [ERROR_CODE.INVALID_TOKEN_SIGNATURE]: 'Invalid Token Signature',
    [ERROR_CODE.REQUIRES_ADMINISTRATOR_1]: 'Requires Administrator, {}',

    [ERROR_CODE.TOKEN_NOT_PART_OF_OWNERSHIP_GROUP_2]: 'Token Not Part Of Ownership Group, domain: {}, ownership: {}',

    [ERROR_CODE.APPLICATION_NOT_INITIALIZED]: 'Application Not Initialized',
    [ERROR_CODE.ENVIRONMENT_VARIABLE_REQUIRED_BUT_NOT_FOUND_1]: 'Environment Variable Required But Not Found, {}',

    [ERROR_CODE.APPLICATION_INITIALIZED_WITH_INFO_MISSING_1]: 'Application Initialized With Info Missing, {}',

    [ERROR_CODE.INTERNAL_ERROR]: 'Internal Error',
};
