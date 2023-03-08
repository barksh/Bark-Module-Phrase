/**
 * @author WMXPY
 * @namespace Handlers_Phrase
 * @description Get
 */

import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { LOCALE, verifyLocale } from "@sudoo/locale";
import { createCustomPattern, createStrictMapPattern, createStringPattern } from "@sudoo/pattern";
import { APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { batchGetBlurbByPhraseIdsAndLocale } from "../../database/controller/blurb";
import { batchGetPhrasesByIdentifiers } from "../../database/controller/phrase";
import { IBlurbModel } from "../../database/model/blurb";
import { IPhraseModel } from "../../database/model/phrase";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { logAgent } from "../../util/log/log";
import { createSucceedLambdaResponse } from "../common/response";
import { wrapHandler } from "../common/setup";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setQueryPattern(
        createStrictMapPattern({
            domain: createStringPattern(),
            id: createStringPattern(),
            locale: createCustomPattern((value: any) => {
                return verifyLocale(value);
            }),
        }),
    );

type Query = {

    readonly domain: string;
    readonly id: string;
    readonly locale: LOCALE;
};

type PhraseGetResponseElement = {

    readonly identifier: string;
    readonly content: string;
};

type PhraseGetResponse = {

    readonly phrases: PhraseGetResponseElement[];
};

export const phraseGetHandler: APIGatewayProxyHandler = wrapHandler(verifier,
    async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ): Promise<APIGatewayProxyResult> => {

        const query: Query = event.verifiedQuery;

        const identifiers: string[] = query.id.split(',');

        if (identifiers.length <= 0) {
            return createSucceedLambdaResponse({
                phrases: [],
            } as PhraseGetResponse);
        }

        const phrases: IPhraseModel[] = await batchGetPhrasesByIdentifiers(
            query.domain,
            identifiers,
        );

        if (phrases.length <= 0) {
            return createSucceedLambdaResponse({
                phrases: [],
            } as PhraseGetResponse);
        }

        const phraseIdentifierMap: Map<string, IPhraseModel> = new Map<string, IPhraseModel>();
        for (const phrase of phrases) {
            phraseIdentifierMap.set(String(phrase._id), phrase);
        }

        const blurbs: IBlurbModel[] = await batchGetBlurbByPhraseIdsAndLocale(
            phrases.map((phrase: IPhraseModel) => phrase._id),
            query.locale,
        );

        const notFulfilled: Set<string> = new Set<string>(phraseIdentifierMap.keys());
        for (const blurb of blurbs) {
            notFulfilled.delete(String(blurb.phraseId.toString()));
        }

        if (notFulfilled.size > 0) {
            logAgent.info(notFulfilled.size, 'phrases are not fulfilled with locale:', query.locale);
            const notFulfilledBlurbs: IBlurbModel[] = await batchGetBlurbByPhraseIdsAndLocale(
                [...notFulfilled],
                LOCALE.ENGLISH_UNITED_STATES,
            );

            logAgent.info('Fulfilled:', notFulfilledBlurbs.length, 'blurbs with default locale');
            blurbs.push(...notFulfilledBlurbs);
        }

        return createSucceedLambdaResponse({
            phrases: blurbs.map((blurb: IBlurbModel) => {

                const phrase: IPhraseModel | undefined = phraseIdentifierMap.get(String(blurb.phraseId.toString()));

                if (!phrase) {
                    throw panic.code(ERROR_CODE.INTERNAL_ERROR);
                }

                return {
                    identifier: phrase.identifier,
                    content: blurb.content,
                };
            }),
        } as PhraseGetResponse);
    },
);
