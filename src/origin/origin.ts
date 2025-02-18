/**
 * @author WMXPY
 * @namespace Origin
 * @description Origin
 */

import { IImbricateDatabaseManager, IImbricateOrigin, IImbricateStaticManager, ImbricateOriginFullFeatureBase, ImbricateOriginSearchOutcome, rebuildImbricateOriginSearchSymbol } from "@imbricate/core";
import { ImbricateStackAPIDatabaseManager } from "../database/manager";
import { ImbricateStackAPITextManager } from "../text/manager";
import { axiosClient } from "../util/client";
import { digestString } from "../util/digest";
import { getAxiosErrorSymbol } from "../util/error";
import { buildHeader } from "../util/header";
import { joinUrl } from "../util/path-joiner";

export class ImbricateStackAPIOrigin extends ImbricateOriginFullFeatureBase implements IImbricateOrigin {

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

        super();

        this.payloads = payloads;
    }

    public readonly payloads: Record<string, any>;

    public get uniqueIdentifier(): string {

        return digestString(this.payloads.basePath);
    }

    public getDatabaseManager(): IImbricateDatabaseManager {

        return ImbricateStackAPIDatabaseManager.create(
            this.payloads.basePath,
            this.payloads.authentication,
        );
    }

    public getTextManager(): ImbricateStackAPITextManager {

        return ImbricateStackAPITextManager.create(
            this.payloads.basePath,
            this.payloads.authentication,
        );
    }

    public getStaticManager(): IImbricateStaticManager {

        throw new Error("Method not implemented.");
    }

    public async search(
        keyword: string,
    ): Promise<ImbricateOriginSearchOutcome> {

        try {

            const response = await axiosClient.post(joinUrl(
                this.payloads.basePath,
                "search",
            ), {
                keyword,
            }, {
                headers: buildHeader(this.payloads.authentication),
            });

            return {
                items: response.data.result.items,
            };
        } catch (error) {

            return rebuildImbricateOriginSearchSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }
}
