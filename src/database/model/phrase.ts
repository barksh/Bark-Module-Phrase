/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Phrase
 */

import { Document, model, Model, Schema } from "mongoose";
import { IPhrase } from "../interface/phrase";

const PhraseSchema: Schema<IPhraseModel> = new Schema(
    {
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
        domain: {
            type: String,
            required: true,
            index: true,
        },
        locale: {
            type: String,
            required: true,
            index: true,
        },
        identifier: {
            type: String,
            required: true,
            index: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    },
);

export interface IPhraseModel extends IPhrase, Document {
}

export const PhraseModel: Model<IPhraseModel> = model<IPhraseModel>('Phrase', PhraseSchema);
