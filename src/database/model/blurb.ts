/**
 * @author WMXPY
 * @namespace Database_Model
 * @description Blurb
 */

import { Document, model, Model, Schema } from "mongoose";
import { IBlurb } from "../interface/blurb";

const BlurbSchema: Schema<IBlurbModel> = new Schema(
    {
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
        phraseId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        locale: {
            type: String,
            required: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    },
);

export interface IBlurbModel extends IBlurb, Document {
}

export const BlurbModel: Model<IBlurbModel> = model<IBlurbModel>('Blurb', BlurbSchema);
