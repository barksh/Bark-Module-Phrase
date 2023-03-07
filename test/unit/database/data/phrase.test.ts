/**
 * @author WMXPY
 * @namespace Database_Data
 * @description Phrase
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { PHRASE_IDENTIFIER_VALIDATE_RESPONSE, validatePhraseIdentifier } from "../../../../src/database/data/phrase";

describe('Given [Phrase] Database Data helper methods', (): void => {

    const chance: Chance.Chance = new Chance('database-data-phrase');

    it('should be able to validate with only letters', (): void => {

        const phraseIdentifier: string = chance.word();

        const verifyResult: PHRASE_IDENTIFIER_VALIDATE_RESPONSE = validatePhraseIdentifier(phraseIdentifier);

        expect(verifyResult).to.be.equal(PHRASE_IDENTIFIER_VALIDATE_RESPONSE.OK);
    });

    it('should be able to validate with only letters and numbers', (): void => {

        const phraseIdentifier: string = `${chance.word()}${chance.integer()}`;

        const verifyResult: PHRASE_IDENTIFIER_VALIDATE_RESPONSE = validatePhraseIdentifier(phraseIdentifier);

        expect(verifyResult).to.be.equal(PHRASE_IDENTIFIER_VALIDATE_RESPONSE.OK);
    });

    it('should be able to validate with only letters and numbers and dash', (): void => {

        const phraseIdentifier: string = `${chance.word()}-${chance.integer()}`;

        const verifyResult: PHRASE_IDENTIFIER_VALIDATE_RESPONSE = validatePhraseIdentifier(phraseIdentifier);

        expect(verifyResult).to.be.equal(PHRASE_IDENTIFIER_VALIDATE_RESPONSE.OK);
    });

    it('should be able to fail when contains special characters', (): void => {

        const phraseIdentifier: string = `${chance.word()}*${chance.word()}`;

        const verifyResult: PHRASE_IDENTIFIER_VALIDATE_RESPONSE = validatePhraseIdentifier(phraseIdentifier);

        expect(verifyResult).to.be.equal(PHRASE_IDENTIFIER_VALIDATE_RESPONSE.ONLY_LETTERS_OR_NUMBERS);
    });

    it('should be able to fail when contains space', (): void => {

        const phraseIdentifier: string = `${chance.word()} ${chance.word()}`;

        const verifyResult: PHRASE_IDENTIFIER_VALIDATE_RESPONSE = validatePhraseIdentifier(phraseIdentifier);

        expect(verifyResult).to.be.equal(PHRASE_IDENTIFIER_VALIDATE_RESPONSE.ONLY_LETTERS_OR_NUMBERS);
    });

    it('should be able to fail when starts with dash', (): void => {

        const phraseIdentifier: string = `-${chance.word()}`;

        const verifyResult: PHRASE_IDENTIFIER_VALIDATE_RESPONSE = validatePhraseIdentifier(phraseIdentifier);

        expect(verifyResult).to.be.equal(PHRASE_IDENTIFIER_VALIDATE_RESPONSE.MUST_START_WITH_LETTER_OR_NUMBER);
    });

    it('should be able to fail when ends with dash', (): void => {

        const phraseIdentifier: string = `${chance.word()}-`;

        const verifyResult: PHRASE_IDENTIFIER_VALIDATE_RESPONSE = validatePhraseIdentifier(phraseIdentifier);

        expect(verifyResult).to.be.equal(PHRASE_IDENTIFIER_VALIDATE_RESPONSE.MUST_END_WITH_LETTER_OR_NUMBER);
    });
});
