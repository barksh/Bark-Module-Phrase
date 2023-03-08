/**
 * @author WMXPY
 * @namespace Handlers_Portal
 * @description Put Phrase
 */

import { BarkAuthenticationToken } from "@barksh/token-node";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { verifyAndGetToken } from "../common/authentication";
import { createErroredLambdaResponse, createSucceedLambdaResponse } from "../common/response";
import { wrapHandler } from "../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            scopeDomain: createStringPattern(),
        }),
    );

type Body = {

    readonly scopeDomain: string;
};

export const portalPutPhraseHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        const token: BarkAuthenticationToken = await verifyAndGetToken(event.headers);

        if (!token.isAdministrator()) {
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                panic.code(ERROR_CODE.REQUIRES_ADMINISTRATOR_1, token.getAccountIdentifier()),
            );
        }

        const domain: string = token.getSelfDomain();

        console.log(domain);

        return createSucceedLambdaResponse({
            ...body,
        });
    },
);
