/**
 * @author WMXPY
 * @namespace Text
 * @description Text
 */

import { IImbricateText, ImbricateAuthor, ImbricateTextFullFeatureBase, ImbricateTextGetContentOutcome } from "@imbricate/core";

export class ImbricateStackAPIText extends ImbricateTextFullFeatureBase implements IImbricateText {

    public static async create(
        textUniqueIdentifier: string,
        content: string,
        author: ImbricateAuthor,
    ): Promise<ImbricateStackAPIText> {

        return new ImbricateStackAPIText(
            textUniqueIdentifier,
            content,
            author,
        );
    }

    public static createFromContent(
        textUniqueIdentifier: string,
        content: string,
        author: ImbricateAuthor,
    ): ImbricateStackAPIText {

        return new ImbricateStackAPIText(
            textUniqueIdentifier,
            content,
            author,
        );
    }

    private readonly _textUniqueIdentifier: string;

    private _content: string;
    private _author: ImbricateAuthor;

    private constructor(
        textUniqueIdentifier: string,
        content: string,
        author: ImbricateAuthor,
    ) {

        super();

        this._textUniqueIdentifier = textUniqueIdentifier;
        this._content = content;
        this._author = author;
    }

    public get uniqueIdentifier(): string {
        return this._textUniqueIdentifier;
    }

    public get author(): ImbricateAuthor {
        return this._author;
    }

    public async getContent(): Promise<ImbricateTextGetContentOutcome> {

        return {
            content: this._content,
        };
    }
}
