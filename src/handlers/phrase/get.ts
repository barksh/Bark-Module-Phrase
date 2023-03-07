/**
 * @author WMXPY
 * @namespace Handlers_Phrase
 * @description Get
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { createSucceedLambdaResponse } from "../common/response";
import { wrapHandler } from "../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setQueryPattern(
        createStrictMapPattern({
            domain: createStringPattern(),
            id: createStringPattern(),
        }),
    );

type Query = {
    // Nothing
};

export const phraseGetHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const query: Query = event.verifiedQuery;

        console.log(query);

        return createSucceedLambdaResponse({
            ...query,
        });
    },
);
