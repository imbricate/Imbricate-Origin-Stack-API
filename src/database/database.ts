/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DocumentProperties, IImbricateDocument, ImbricateDocumentQuery } from "@imbricate/core";
import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { ImbricateStackAPIAuthentication } from "../definition";
import { ImbricateStackAPIDocument } from "../document/document";
import { axiosClient } from "../util/client";
import { buildHeader } from "../util/header";
import { joinUrl } from "../util/path-joiner";

export class ImbricateStackAPIDatabase implements IImbricateDatabase {

    public static create(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ): ImbricateStackAPIDatabase {

        return new ImbricateStackAPIDatabase(
            basePath,
            authentication,
            uniqueIdentifier,
            databaseName,
            schema,
        );
    }

    private readonly _basePath: string;
    private readonly _authentication: ImbricateStackAPIAuthentication;

    public readonly uniqueIdentifier: string;
    public readonly databaseName: string;
    public schema: ImbricateDatabaseSchema;

    private constructor(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ) {

        this._basePath = basePath;
        this._authentication = authentication;

        this.uniqueIdentifier = uniqueIdentifier;
        this.databaseName = databaseName;
        this.schema = schema;
    }

    public async putSchema(
        schema: ImbricateDatabaseSchema,
    ): Promise<void> {

        await axiosClient.put(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "schema",
        ), {
            schema,
        }, {
            headers: buildHeader(this._authentication),
        });
    }

    public async createDocument(
        properties: DocumentProperties,
    ): Promise<IImbricateDocument> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "create-document",
        ), {
            properties,
        }, {
            headers: buildHeader(this._authentication),
        });

        const documentUniqueIdentifier: string = response.data.documentUniqueIdentifier;

        return ImbricateStackAPIDocument.create(
            this._basePath,
            this._authentication,
            this.uniqueIdentifier,
            documentUniqueIdentifier,
            this.schema,
            properties,
        );
    }

    public async getDocument(
        uniqueIdentifier: string,
    ): Promise<IImbricateDocument | null> {

        const response = await axiosClient.get(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "document",
            uniqueIdentifier,
        ), {
            headers: buildHeader(this._authentication),
        });

        const properties: DocumentProperties = response.data.properties;

        return ImbricateStackAPIDocument.create(
            this._basePath,
            this._authentication,
            this.uniqueIdentifier,
            uniqueIdentifier,
            this.schema,
            properties,
        );
    }

    public async queryDocuments(
        query: ImbricateDocumentQuery,
    ): Promise<IImbricateDocument[]> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "query-documents",
        ), {
            query,
        }, {
            headers: buildHeader(this._authentication),
        });

        const documents = response.data.documents;

        return documents.map((document: any) => {

            return ImbricateStackAPIDocument.create(
                this._basePath,
                this._authentication,
                this.uniqueIdentifier,
                document.uniqueIdentifier,
                this.schema,
                document.properties,
            );
        });
    }
}
