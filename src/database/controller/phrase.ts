/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Phrase
 */

import { IPhraseConfig } from "../interface/phrase";
import { IPhraseModel, PhraseModel } from "../model/phrase";

export const createUnsavedPhrase = (
    domain: string,
    identifier: string,
): IPhraseModel => {

    const phraseConfig: IPhraseConfig = {

        domain,
        identifier,
    };
    return new PhraseModel(phraseConfig);
};

export const getPhraseByDomainAndIdentifier = async (
    domain: string,
    identifier: string,
): Promise<IPhraseModel | null> => {

    const phrase: IPhraseModel | null = await PhraseModel.findOne({
        domain,
        identifier,
    });

    return phrase;
};

export const createOrGetPhrase = async (
    domain: string,
    identifier: string,
): Promise<IPhraseModel> => {

    const phrase: IPhraseModel | null = await getPhraseByDomainAndIdentifier(domain, identifier);

    if (phrase) {
        return phrase;
    }

    const newPhrase: IPhraseModel = createUnsavedPhrase(domain, identifier);
    await newPhrase.save();

    return newPhrase;
};

export const searchPhrasesByIdentifier = async (
    domain: string,
    identifier: string,
    page: number,
    limit: number = 32,
): Promise<IPhraseModel[]> => {

    const phrases: IPhraseModel[] = await PhraseModel.find({
        domain,
        identifier: {
            $regex: identifier,
            $options: 'i',
        },
    }).skip(page * limit).limit(limit);

    return phrases;
};
