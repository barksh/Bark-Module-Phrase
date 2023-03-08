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

export const createOrReplaceBlurbContent = async (
    phraseId: ObjectId,
    locale: LOCALE,
    content: string,
): Promise<IBlurbModel> => {

    const blurb: IBlurbModel | null = await BlurbModel.findOne({
        phraseId,
        locale,
    });

    if (blurb) {

        blurb.content = content;
        await blurb.save();

        return blurb;
    }

    const newBlurb: IBlurbModel = createUnsavedBlurb(phraseId, locale, content);
    await newBlurb.save();

    return newBlurb;
};
