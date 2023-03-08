/**
 * @author WMXPY
 * @namespace Database_Controller
 * @description Blurb
 */

import { LOCALE } from "@sudoo/locale";
import { ObjectId } from "bson";
import { IBlurbConfig } from "../interface/blurb";
import { BlurbModel, IBlurbModel } from "../model/blurb";

export const createUnsavedBlurb = (
    phraseId: ObjectId,
    locale: LOCALE,
    content: string,
): IBlurbModel => {

    const BlurbConfig: IBlurbConfig = {

        phraseId,
        locale,
        content,
    };
    return new BlurbModel(BlurbConfig);
};
