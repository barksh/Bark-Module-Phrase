/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Phrase
 */

import { IPhraseConfig } from "../interface/phrase";
import { IPhraseModel, PhraseModel } from "../model/phrase";

export const createUnsavedPhrase = (
    domain: string,
    locale: string,
    identifier: string,
): IPhraseModel => {

    const phraseConfig: IPhraseConfig = {

        domain,
        locale,
        identifier,
    };
    return new PhraseModel(phraseConfig);
};
