/**
 * @author WMXPY
 * @namespace Handlers_Portal
 * @description Post Query Phrases
 */

import { BarkAuthenticationToken } from "@barksh/token-node";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createNumberPattern, createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { searchPhrasesByIdentifier } from "../../database/controller/phrase";
import { IPhraseModel } from "../../database/model/phrase";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { dnsLookupPhraseOwnershipTxt } from "../../util/network/dns/txt";
import { verifyAndGetToken } from "../common/authentication";
import { createErroredLambdaResponse, createSucceedLambdaResponse } from "../common/response";
import { wrapHandler } from "../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(
        createStrictMapPattern({
            scopeDomain: createStringPattern(),
            searchPhraseIdentifier: createStringPattern({
                optional: true,
            }),
            page: createNumberPattern({
                integer: true,
                minimum: 0,
                optional: true,
            }),
        }),
    );

type Body = {

    readonly scopeDomain: string;
    readonly searchPhraseIdentifier?: string;
    readonly page?: number;
};

export const portalPostQueryPhraseHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const body: Body = event.verifiedBody;

        const token: BarkAuthenticationToken = await verifyAndGetToken(event.headers);

        if (!token.isAdministrator()) {
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                panic.code(
                    ERROR_CODE.REQUIRES_ADMINISTRATOR_1,
                    token.getAccountIdentifier(),
                ),
            );
        }

        const availableOwnership: string[] = await dnsLookupPhraseOwnershipTxt(body.scopeDomain);
        const domain: string = token.getSelfDomain();

        if (!availableOwnership.includes(domain)) {
            return createErroredLambdaResponse(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                panic.code(
                    ERROR_CODE.TOKEN_NOT_PART_OF_OWNERSHIP_GROUP_2,
                    domain,
                    availableOwnership,
                ),
            );
        }

        const phrases: IPhraseModel[] = await searchPhrasesByIdentifier(
            body.scopeDomain,
            body.searchPhraseIdentifier ?? "",
            body.page ?? 0,
        );

        return createSucceedLambdaResponse({
            phrases,
        });
    },
);
