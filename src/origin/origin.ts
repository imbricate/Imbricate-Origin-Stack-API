/**
 * @author WMXPY
 * @namespace Origin
 * @description Origin
 */

import { IImbricateDatabaseManager, IImbricateOrigin, IImbricateStaticManager } from "@imbricate/core";
import { ImbricateStackAPIDatabaseManager } from "../database/manager";
import { ImbricateStackAPITextManager } from "../text/manager";
import { digestString } from "../util/digest";

export class ImbricateStackAPIOrigin implements IImbricateOrigin {

    public static create(
        payloads: Record<string, any>,
    ): ImbricateStackAPIOrigin {

        return new ImbricateStackAPIOrigin(
            payloads,
        );
    }

    private constructor(
        payloads: Record<string, any>,
    ) {

        this.payloads = payloads;
    }

    public readonly payloads: Record<string, any>;

    public get uniqueIdentifier(): string {

        return digestString(this.payloads.basePath);
    }

    public getDatabaseManager(): IImbricateDatabaseManager {

        return ImbricateStackAPIDatabaseManager.create(
            this.payloads.author,
            this.payloads.basePath,
        );
    }

    public getTextManager(): ImbricateStackAPITextManager {

        return ImbricateStackAPITextManager.create(
            this.payloads.basePath,
            this.payloads.author,
        );
    }

    public getStaticManager(): IImbricateStaticManager {

        throw new Error("Method not implemented.");
    }
}
