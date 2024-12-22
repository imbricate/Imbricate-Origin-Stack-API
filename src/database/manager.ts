/**
 * @author WMXPY
 * @namespace Database
 * @description Manager
 */

import { IImbricateDatabaseManager, ImbricateDatabaseManagerCreateDatabaseOutcome, ImbricateDatabaseManagerFullFeatureBase, ImbricateDatabaseManagerGetDatabaseOutcome, ImbricateDatabaseManagerListDatabasesOutcome, ImbricateDatabaseManagerRemoveDatabaseOutcome, ImbricateDatabaseSchemaForCreation, rebuildImbricateDatabaseManagerCreateDatabaseSymbol, rebuildImbricateDatabaseManagerGetDatabaseSymbol, rebuildImbricateDatabaseManagerListDatabasesSymbol, rebuildImbricateDatabaseManagerRemoveDatabaseSymbol } from "@imbricate/core";
import { ImbricateStackAPIAuthentication } from "../definition";
import { axiosClient } from "../util/client";
import { buildHeader } from "../util/header";
import { joinUrl } from "../util/path-joiner";
import { ImbricateStackAPIDatabase } from "./database";

export class ImbricateStackAPIDatabaseManager extends ImbricateDatabaseManagerFullFeatureBase implements IImbricateDatabaseManager {

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

        super();

        this._basePath = basePath;
        this._authentication = authentication;
    }

    public async listDatabases(): Promise<ImbricateDatabaseManagerListDatabasesOutcome> {

        try {

            const response = await axiosClient.get(joinUrl(
                this._basePath,
                "list-database",
            ), {
                headers: buildHeader(this._authentication),
            });

            const databases = response.data.databases;

            return {
                databases: databases.map((database: any) => {

                    return ImbricateStackAPIDatabase.create(
                        this._basePath,
                        this._authentication,
                        database.databaseUniqueIdentifier,
                        database.databaseName,
                        database.databaseVersion,
                        database.databaseSchema,
                        database.databaseAnnotations,
                    );
                }),
            };
        } catch (error) {

            return rebuildImbricateDatabaseManagerListDatabasesSymbol(error.response.data);
        }
    }

    public async getDatabase(
        uniqueIdentifier: string,
    ): Promise<ImbricateDatabaseManagerGetDatabaseOutcome> {

        try {

            const response = await axiosClient.get(joinUrl(
                this._basePath,
                "database",
                uniqueIdentifier,
            ), {
                headers: buildHeader(this._authentication),
            });

            const databaseName = response.data.databaseName;
            const databaseVersion = response.data.databaseVersion;
            const databaseSchema = response.data.databaseSchema;
            const databaseAnnotations = response.data.databaseAnnotations;

            const database = ImbricateStackAPIDatabase.create(

                this._basePath,
                this._authentication,
                uniqueIdentifier,
                databaseName,
                databaseVersion,
                databaseSchema,
                databaseAnnotations,
            );

            return {
                database,
            };
        } catch (error) {

            return rebuildImbricateDatabaseManagerGetDatabaseSymbol(error.response.data);
        }
    }

    public async createDatabase(
        databaseName: string,
        schema: ImbricateDatabaseSchemaForCreation,
    ): Promise<ImbricateDatabaseManagerCreateDatabaseOutcome> {

        try {

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
            const databaseVersion = response.data.databaseVersion;
            const responseSchema = response.data.schema;
            const responseAnnotations = response.data.annotations;

            const database = ImbricateStackAPIDatabase.create(

                this._basePath,
                this._authentication,
                databaseUniqueIdentifier,
                databaseName,
                databaseVersion,
                responseSchema,
                responseAnnotations,
            );

            return {
                database,
            };
        } catch (error) {

            return rebuildImbricateDatabaseManagerCreateDatabaseSymbol(error.response.data);
        }
    }

    public async removeDatabase(uniqueIdentifier: string): Promise<ImbricateDatabaseManagerRemoveDatabaseOutcome> {

        try {

            await axiosClient.delete(joinUrl(
                this._basePath,
                "database",
                uniqueIdentifier,
            ), {
                headers: buildHeader(this._authentication),
            });

            return {
                success: true,
            };
        } catch (error) {

            return rebuildImbricateDatabaseManagerRemoveDatabaseSymbol(error.response.data);
        }
    }
}
