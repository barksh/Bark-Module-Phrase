/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Blurb
 */

import { LOCALE } from "@sudoo/locale";

export interface IBlurbConfig {

    readonly phraseId: string;

    readonly identifier: string;
    readonly locale: LOCALE;
}

export interface IBlurb extends IBlurbConfig {

    active: boolean;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
