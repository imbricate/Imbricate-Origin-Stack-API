/**
 * @author WMXPY
 * @namespace Text
 * @description Text
 */

import { IImbricateText } from "@imbricate/core";

export class ImbricateStackAPIText implements IImbricateText {

    public static async create(
        textUniqueIdentifier: string,
        content: string,
    ): Promise<ImbricateStackAPIText> {

        return new ImbricateStackAPIText(
            textUniqueIdentifier,
            content,
        );
    }

    public static createFromContent(
        textUniqueIdentifier: string,
        content: string,
    ): ImbricateStackAPIText {

        return new ImbricateStackAPIText(
            textUniqueIdentifier,
            content,
        );
    }

    private readonly _textUniqueIdentifier: string;

    private _content: string;

    private constructor(
        textUniqueIdentifier: string,
        content: string,
    ) {

        this._textUniqueIdentifier = textUniqueIdentifier;

        this._content = content;
    }

    public get uniqueIdentifier(): string {
        return this._textUniqueIdentifier;
    }

    public async getContent(): Promise<string> {

        return this._content;
    }
}
