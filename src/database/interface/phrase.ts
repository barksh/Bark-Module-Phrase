/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Phrase
 */

export interface IPhraseConfig {

    readonly domain: string;
    readonly locale: string;
    readonly identifier: string;
}

export interface IPhrase extends IPhraseConfig {

    active: boolean;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
