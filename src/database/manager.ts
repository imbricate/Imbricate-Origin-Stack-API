/**
 * @author WMXPY
 * @namespace Database
 * @description Manager
 */

import { IImbricateDatabase, IImbricateDatabaseManager, ImbricateDatabaseSchemaForCreation } from "@imbricate/core";
import { ImbricateStackAPIAuthentication } from "../definition";
import { axiosClient } from "../util/client";
import { buildHeader } from "../util/header";
import { joinUrl } from "../util/path-joiner";
import { ImbricateStackAPIDatabase } from "./database";

export class ImbricateStackAPIDatabaseManager implements IImbricateDatabaseManager {

    public static create(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
    ): ImbricateStackAPIDatabaseManager {

        return new ImbricateStackAPIDatabaseManager(
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

    public async listDatabases(): Promise<IImbricateDatabase[]> {

        const response = await axiosClient.get(joinUrl(
            this._basePath,
            "list-database",
        ), {
            headers: buildHeader(this._authentication),
        });

        const databases = response.data.databases;

        return databases.map((database: any) => {

            return ImbricateStackAPIDatabase.create(
                this._basePath,
                this._authentication,
                database.databaseUniqueIdentifier,
                database.databaseName,
                database.schema,
            );
        });
    }

    public async getDatabase(uniqueIdentifier: string): Promise<IImbricateDatabase | null> {

        const response = await axiosClient.get(joinUrl(
            this._basePath,
            "database",
            uniqueIdentifier,
        ), {
            headers: buildHeader(this._authentication),
        });

        const databaseName = response.data.databaseName;
        const databaseSchema = response.data.databaseSchema;

        return ImbricateStackAPIDatabase.create(

            this._basePath,
            this._authentication,
            uniqueIdentifier,
            databaseName,
            databaseSchema,
        );
    }

    public async createDatabase(
        databaseName: string,
        schema: ImbricateDatabaseSchemaForCreation,
    ): Promise<IImbricateDatabase> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "create-database",
        ), {
            databaseName,
            schema,
        }, {
            headers: buildHeader(this._authentication),
        });

        const databaseUniqueIdentifier = response.data.databaseUniqueIdentifier;
        const responseSchema = response.data.schema;

        return ImbricateStackAPIDatabase.create(

            this._basePath,
            this._authentication,
            databaseUniqueIdentifier,
            databaseName,
            responseSchema,
        );
    }
}