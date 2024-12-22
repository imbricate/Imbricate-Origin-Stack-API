/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DatabaseAnnotationValue, DatabaseAnnotations, DatabaseEditRecord, DocumentAnnotations, DocumentProperties, IImbricateDocument, ImbricateDatabaseAddEditRecordsOutcome, ImbricateDatabaseCountDocumentsOutcome, ImbricateDatabaseCreateDocumentOutcome, ImbricateDatabaseDeleteAnnotationOutcome, ImbricateDatabaseFullFeatureBase, ImbricateDatabaseGetDocumentOutcome, ImbricateDatabaseGetEditRecordsOutcome, ImbricateDatabasePutAnnotationOutcome, ImbricateDatabasePutSchemaOutcome, ImbricateDatabaseQueryDocumentsOutcome, ImbricateDatabaseRemoveDocumentOutcome, ImbricateDocumentQuery, rebuildImbricateDatabaseCountDocumentsSymbol, rebuildImbricateDatabaseCreateDocumentSymbol, rebuildImbricateDatabaseDeleteAnnotationSymbol, rebuildImbricateDatabaseGetDocumentSymbol, rebuildImbricateDatabaseGetEditRecordsSymbol, rebuildImbricateDatabasePutAnnotationSymbol, rebuildImbricateDatabasePutSchemaSymbol, rebuildImbricateDatabaseQueryDocumentsSymbol, rebuildImbricateDatabaseRemoveDocumentSymbol } from "@imbricate/core";
import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { ImbricateStackAPIAuthentication } from "../definition";
import { ImbricateStackAPIDocument } from "../document/document";
import { axiosClient } from "../util/client";
import { getAxiosErrorSymbol } from "../util/error";
import { buildHeader } from "../util/header";
import { joinUrl } from "../util/path-joiner";

export class ImbricateStackAPIDatabase extends ImbricateDatabaseFullFeatureBase implements IImbricateDatabase {

    public static create(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        uniqueIdentifier: string,
        databaseName: string,
        databaseVersion: string,
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
    public readonly databaseVersion: string;

    public schema: ImbricateDatabaseSchema;
    public annotations: DatabaseAnnotations;

    private constructor(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        uniqueIdentifier: string,
        databaseName: string,
        databaseVersion: string,
        schema: ImbricateDatabaseSchema,
        annotations: DatabaseAnnotations,
    ) {

        super();

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
    ): Promise<ImbricateDatabasePutSchemaOutcome> {

        try {

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

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDatabasePutSchemaSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async createDocument(
        properties: DocumentProperties,
    ): Promise<ImbricateDatabaseCreateDocumentOutcome> {

        try {

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

            return {
                document: ImbricateStackAPIDocument.create(
                    this._basePath,
                    this._authentication,
                    this.uniqueIdentifier,
                    documentUniqueIdentifier,
                    response.data.documentVersion,
                    properties,
                    {},
                ),
            };
        } catch (error) {

            return rebuildImbricateDatabaseCreateDocumentSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async getDocument(
        uniqueIdentifier: string,
    ): Promise<ImbricateDatabaseGetDocumentOutcome> {

        try {

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

            const document = ImbricateStackAPIDocument.create(
                this._basePath,
                this._authentication,
                this.uniqueIdentifier,
                uniqueIdentifier,
                response.data.documentVersion,
                properties,
                annotations,
            );

            return {
                document,
            };
        } catch (error) {

            return rebuildImbricateDatabaseGetDocumentSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async countDocuments(
        query: ImbricateDocumentQuery,
    ): Promise<ImbricateDatabaseCountDocumentsOutcome> {

        try {

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

            return {
                count: response.data.count,
            };
        } catch (error) {

            return rebuildImbricateDatabaseCountDocumentsSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async queryDocuments(
        query: ImbricateDocumentQuery,
    ): Promise<ImbricateDatabaseQueryDocumentsOutcome> {

        try {

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

            const result: IImbricateDocument[] = documents.map((document: any) => {

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

            return {
                documents: result,
            };
        } catch (error) {

            return rebuildImbricateDatabaseQueryDocumentsSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async removeDocument(
        uniqueIdentifier: string,
    ): Promise<ImbricateDatabaseRemoveDocumentOutcome> {

        try {

            await axiosClient.delete(joinUrl(
                this._basePath,
                "database",
                this.uniqueIdentifier,
                "document",
                uniqueIdentifier,
            ), {
                headers: buildHeader(this._authentication),
            });

            return {
                success: true,
            };
        } catch (error) {

            return rebuildImbricateDatabaseRemoveDocumentSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async addEditRecords(
        _editRecords: DatabaseEditRecord[],
    ): Promise<ImbricateDatabaseAddEditRecordsOutcome> {

        throw new Error("Method not implemented.");
    }

    public async getEditRecords(): Promise<ImbricateDatabaseGetEditRecordsOutcome> {

        try {

            const response = await axiosClient.get(joinUrl(
                this._basePath,
                "database",
                this.uniqueIdentifier,
                "edit-records",
            ), {
                headers: buildHeader(this._authentication),
            });

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDatabaseGetEditRecordsSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async putAnnotation(
        namespace: string,
        identifier: string,
        value: DatabaseAnnotationValue,
    ): Promise<ImbricateDatabasePutAnnotationOutcome> {

        try {

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

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDatabasePutAnnotationSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async deleteAnnotation(
        namespace: string,
        identifier: string,
    ): Promise<ImbricateDatabaseDeleteAnnotationOutcome> {

        try {

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

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDatabaseDeleteAnnotationSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }
}
