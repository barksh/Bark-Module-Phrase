/**
 * @author WMXPY
 * @namespace Handlers
 * @description Response
 */

import { LambdaResponseBodyType, LambdaResponseBuilder, LambdaResponseManager } from "@sudoo/lambda";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { APIGatewayProxyResult } from "aws-lambda";

export const responseManager: LambdaResponseManager = LambdaResponseManager.create();

export const createSucceedLambdaResponse = (body?: LambdaResponseBodyType): APIGatewayProxyResult => {

    const builder: LambdaResponseBuilder = responseManager.createBuilder();

    if (typeof body === 'undefined') {

        return builder.build(HTTP_RESPONSE_CODE.NO_CONTENT);
    }

    return builder.replaceBody(body).build(HTTP_RESPONSE_CODE.OK);
};

export const createErroredLambdaResponse = (
    code: HTTP_RESPONSE_CODE,
    reason?: Error | string,
): APIGatewayProxyResult => {

    const builder: LambdaResponseBuilder = responseManager.createBuilder();

    if (typeof reason === 'undefined') {

        return builder.build(code);
    }

    if (typeof reason === 'string') {

        return builder.addBody(
            'reason', reason,
        ).build(code);
    }

    return builder.addBody(
        'reason', reason.message,
    ).build(code);
};
