/**
 * @author WMXPY
 * @namespace Handlers
 * @description Authentication
 */

import { BarkAuthenticationToken } from "@barksh/token-node";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";

const getAuthorizationField = (headers: any): any => {

    if (headers.Authorization) {
        return headers.Authorization;
    }
    return headers.authorization;
};

export const verifyAndGetToken = (headers: any): BarkAuthenticationToken => {

    const authorization: string = getAuthorizationField(headers);

    if (typeof authorization !== 'string') {
        throw panic.code(ERROR_CODE.INVALID_AUTHORIZATION_FIELD);
    }

    if (authorization.substring(0, 7).toLowerCase() !== 'bearer ') {
        throw panic.code(ERROR_CODE.INVALID_AUTHORIZATION_FIELD);
    }

    const rawToken: string = authorization.substring(7);
    const token: BarkAuthenticationToken = BarkAuthenticationToken.fromTokenOrThrow(rawToken);

    return token;
};
