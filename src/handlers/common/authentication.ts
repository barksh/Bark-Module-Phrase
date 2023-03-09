/**
 * @author WMXPY
 * @namespace Handlers
 * @description Authentication
 */

import { BarkAuthenticationToken } from "@barksh/token-node";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { verifyTokenSignature } from "./verify-token";

const getAuthorizationField = (headers: any): any => {

    if (headers.Authorization) {
        return headers.Authorization;
    }
    return headers.authorization;
};

export const verifyAndGetToken = async (
    headers: any,
): Promise<BarkAuthenticationToken> => {

    const authorization: string = getAuthorizationField(headers);

    if (typeof authorization !== 'string') {
        throw panic.code(ERROR_CODE.INVALID_AUTHORIZATION_FIELD);
    }

    if (authorization.substring(0, 7).toLowerCase() !== 'bearer ') {
        throw panic.code(ERROR_CODE.INVALID_AUTHORIZATION_FIELD);
    }

    const rawToken: string = authorization.substring(7);
    const token: BarkAuthenticationToken | null = BarkAuthenticationToken.fromTokenOrNull(rawToken);

    if (token === null) {
        throw panic.code(ERROR_CODE.UNABLE_TO_PARSE_TOKEN);
    }

    const verifyTimeResult: boolean = token.verifyTime();

    if (!verifyTimeResult) {
        throw panic.code(ERROR_CODE.INVALID_TOKEN);
    }

    const verifySignatureResult: boolean = await verifyTokenSignature(token);

    if (!verifySignatureResult) {
        throw panic.code(ERROR_CODE.INVALID_TOKEN_SIGNATURE);
    }

    return token;
};
