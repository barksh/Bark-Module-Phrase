/**
 * @author WMXPY
 * @namespace Database_Interface
 * @description Blurb
 */

import { LOCALE } from "@sudoo/locale";
import { ObjectId } from "bson";

export interface IBlurbConfig {

    readonly phraseId: ObjectId;
    readonly locale: LOCALE;

    content: string;
}

export interface IBlurb extends IBlurbConfig {

    active: boolean;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
