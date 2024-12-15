/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DatabaseAnnotationValue, DatabaseAnnotations, DatabaseEditRecord, DocumentAnnotations, DocumentProperties, IImbricateDocument, ImbricateDocumentQuery } from "@imbricate/core";
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
        databaseVersion: number,
        schema: ImbricateDatabaseSchema,
        annotations: DatabaseAnnotations,
    ): ImbricateStackAPIDatabase {

        return new ImbricateStackAPIDatabase(
            basePath,
            authentication,
            uniqueIdentifier,
            databaseName,
            databaseVersion,
            schema,
            annotations,
        );
    }

    private readonly _basePath: string;
    private readonly _authentication: ImbricateStackAPIAuthentication;

    public readonly uniqueIdentifier: string;
    public readonly databaseName: string;
    public readonly databaseVersion: number;

    public schema: ImbricateDatabaseSchema;
    public annotations: DatabaseAnnotations;

    private constructor(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        uniqueIdentifier: string,
        databaseName: string,
        databaseVersion: number,
        schema: ImbricateDatabaseSchema,
        annotations: DatabaseAnnotations,
    ) {

        this._basePath = basePath;
        this._authentication = authentication;

        this.uniqueIdentifier = uniqueIdentifier;
        this.databaseName = databaseName;
        this.databaseVersion = databaseVersion;

        this.schema = schema;
        this.annotations = annotations;
    }

    public async putSchema(
        schema: ImbricateDatabaseSchema,
    ): Promise<DatabaseEditRecord[]> {

        const response = await axiosClient.put(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "schema",
        ), {
            schema,
        }, {
            headers: buildHeader(this._authentication),
        });

        return response.data.editRecords;
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
            response.data.documentVersion,
            properties,
            {},
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
        const annotations: DocumentAnnotations = response.data.annotations;

        return ImbricateStackAPIDocument.create(
            this._basePath,
            this._authentication,
            this.uniqueIdentifier,
            uniqueIdentifier,
            response.data.documentVersion,
            properties,
            annotations,
        );
    }

    public async countDocuments(
        query: ImbricateDocumentQuery,
    ): Promise<number> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "count-documents",
        ), {
            query,
        }, {
            headers: buildHeader(this._authentication),
        });

        return response.data.count;
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
                document.documentVersion,
                document.properties,
                document.annotations,
            );
        });
    }

    public async removeDocument(
        uniqueIdentifier: string,
    ): Promise<void> {

        await axiosClient.delete(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "document",
            uniqueIdentifier,
        ), {
            headers: buildHeader(this._authentication),
        });
    }

    public async putAnnotation(
        namespace: string,
        identifier: string,
        value: DatabaseAnnotationValue,
    ): Promise<DatabaseEditRecord[]> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "put-annotation",
        ), {
            namespace,
            identifier,
            value,
        }, {
            headers: buildHeader(this._authentication),
        });

        return response.data.editRecords;
    }

    public async deleteAnnotation(
        namespace: string,
        identifier: string,
    ): Promise<DatabaseEditRecord[]> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "database",
            this.uniqueIdentifier,
            "delete-annotation",
        ), {
            namespace,
            identifier,
        }, {
            headers: buildHeader(this._authentication),
        });

        return response.data.editRecords;
    }
}
