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

export const createOrGetPhrase = async (
    domain: string,
    identifier: string,
): Promise<IPhraseModel> => {

    const phrase: IPhraseModel | null = await PhraseModel.findOne({
        domain,
        identifier,
    });

    if (phrase) {
        return phrase;
    }

    const newPhrase: IPhraseModel = createUnsavedPhrase(domain, identifier);
    await newPhrase.save();

    return newPhrase;
};
