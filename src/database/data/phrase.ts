/**
 * @author WMXPY
 * @namespace Database_Data
 * @description Phrase
 */

export enum PHRASE_IDENTIFIER_VALIDATE_RESPONSE {

    MUST_START_WITH_LETTER_OR_NUMBER = "MUST_START_WITH_LETTER_OR_NUMBER",
    MUST_END_WITH_LETTER_OR_NUMBER = "MUST_END_WITH_LETTER_OR_NUMBER",
    ONLY_LETTERS_OR_NUMBERS = "ONLY_LETTERS_OR_NUMBERS",
    OK = "OK",
}

export const validatePhraseIdentifier = (
    phraseIdentifier: string,
): PHRASE_IDENTIFIER_VALIDATE_RESPONSE => {

    if (!/^[A-Za-z0-9]$/.test(phraseIdentifier.substring(0, 1))) {
        return PHRASE_IDENTIFIER_VALIDATE_RESPONSE.MUST_START_WITH_LETTER_OR_NUMBER;
    }
    if (!/^[A-Za-z0-9]$/.test(phraseIdentifier.substring(
        phraseIdentifier.length - 1,
        phraseIdentifier.length,
    ))) {
        return PHRASE_IDENTIFIER_VALIDATE_RESPONSE.MUST_END_WITH_LETTER_OR_NUMBER;
    }

    if (!/^([A-Za-z0-9]|-)+$/.test(phraseIdentifier)) {
        return PHRASE_IDENTIFIER_VALIDATE_RESPONSE.ONLY_LETTERS_OR_NUMBERS;
    }

    return PHRASE_IDENTIFIER_VALIDATE_RESPONSE.OK;
};
