/**
 * @author WMXPY
 * @namespace Handlers_Portal
 * @description Put Phrase
 */

import { BarkAuthenticationToken } from "@barksh/token-node";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { LOCALE, verifyLocale } from "@sudoo/locale";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createCustomPattern, createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { createOrReplaceBlurbContent } from "../../database/controller/blurb";
import { createOrGetPhrase } from "../../database/controller/phrase";
import { IBlurbModel } from "../../database/model/blurb";
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
            phraseIdentifier: createStringPattern(),
            locale: createCustomPattern((value: any) => {
                return verifyLocale(value);
            }),
            content: createStringPattern(),
        }),
    );

type Body = {

    readonly scopeDomain: string;
    readonly phraseIdentifier: string;
    readonly locale: LOCALE;
    readonly content: string;
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

        const availableOwnership: string[] = await dnsLookupPhraseOwnershipTxt(body.scopeDomain);
        const domain: string = token.getTargetDomain();

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

        const phrase: IPhraseModel = await createOrGetPhrase(
            body.scopeDomain,
            body.phraseIdentifier,
        );

        const blurb: IBlurbModel = await createOrReplaceBlurbContent(
            phrase._id,
            body.locale,
            body.content,
        );

        return createSucceedLambdaResponse({
            scopeDomain: phrase.domain,
            identifier: phrase.identifier,
            locale: blurb.locale,
            content: blurb.content,
        });
    },
);
