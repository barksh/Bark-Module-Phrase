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
