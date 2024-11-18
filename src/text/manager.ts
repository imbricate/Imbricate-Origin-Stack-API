/**
 * @author WMXPY
 * @namespace Text
 * @description Manager
 */

import { IImbricateText, IImbricateTextManager } from "@imbricate/core";
import { ImbricateStackAPIAuthentication } from "../definition";
import { axiosClient } from "../util/client";
import { buildHeader } from "../util/header";
import { joinUrl } from "../util/path-joiner";
import { ImbricateStackAPIText } from "./text";

export class ImbricateStackAPITextManager implements IImbricateTextManager {

    public static create(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
    ): ImbricateStackAPITextManager {

        return new ImbricateStackAPITextManager(
            basePath,
            authentication,
        );
    }

    private readonly _basePath: string;
    private readonly _authentication: ImbricateStackAPIAuthentication;

    private constructor(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
    ) {

        this._basePath = basePath;
        this._authentication = authentication;
    }

    public async getText(
        uniqueIdentifier: string,
    ): Promise<IImbricateText | null> {

        const response = await axiosClient.get(joinUrl(
            this._basePath,
            "text",
            uniqueIdentifier,
        ), {
            headers: buildHeader(this._authentication),
        });

        const content: string = response.data.content;

        const text: IImbricateText = ImbricateStackAPIText.createFromContent(
            uniqueIdentifier,
            content,
        );

        return text;
    }

    public async createText(
        content: string,
    ): Promise<IImbricateText> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "create-text",
        ), {
            content,
        }, {
            headers: buildHeader(this._authentication),
        });

        const textUniqueIdentifier: string = response.data.textUniqueIdentifier;

        return ImbricateStackAPIText.create(
            textUniqueIdentifier,
            content,
        );
    }
}
