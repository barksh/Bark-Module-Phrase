/**
 * @author WMXPY
 * @namespace Handlers
 * @description Setup
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent, VerifiedAPIGatewayProxyHandler } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { Initializer } from "../../initialize/initializer";
import { responseManager } from "./response";

export const wrapHandler = (
    verifier: LambdaVerifier,
    handler: VerifiedAPIGatewayProxyHandler,
): APIGatewayProxyHandler => {

    const newHandler: APIGatewayProxyHandler = verifier.warpAPIGateWayProxyHandler(
        async (
            event: VerifiedAPIGatewayProxyEvent,
            context: Context,
            callback: Callback,
        ): Promise<APIGatewayProxyResult> => {

            await Initializer.initialize();

            const result: APIGatewayProxyResult | void = await handler(event, context, callback);

            await Initializer.terminate();

            if (typeof result === 'undefined') {

                return responseManager
                    .createBuilder()
                    .build(HTTP_RESPONSE_CODE.NO_CONTENT);
            }

            return result;
        },
    );

    return newHandler;
};
