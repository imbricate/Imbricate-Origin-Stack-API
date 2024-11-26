/**
 * @author WMXPY
 * @namespace Document
 * @description Document
 */

import { DocumentEditRecord, DocumentProperties, DocumentPropertyKey, DocumentPropertyValue, IImbricateDocument, IMBRICATE_PROPERTY_TYPE, ImbricateDatabaseSchema } from "@imbricate/core";
import { ImbricateStackAPIAuthentication } from "../definition";
import { axiosClient } from "../util/client";
import { buildHeader } from "../util/header";
import { joinUrl } from "../util/path-joiner";

export class ImbricateStackAPIDocument implements IImbricateDocument {

    public static create(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        schema: ImbricateDatabaseSchema,
        properties: DocumentProperties,
    ): ImbricateStackAPIDocument {

        return new ImbricateStackAPIDocument(
            basePath,
            authentication,
            databaseUniqueIdentifier,
            documentUniqueIdentifier,
            schema,
            properties,
        );
    }

    private readonly _basePath: string;
    private readonly _authentication: ImbricateStackAPIAuthentication;
    private readonly _databaseUniqueIdentifier: string;
    private readonly _documentUniqueIdentifier: string;
    private readonly _schema: ImbricateDatabaseSchema;

    private _properties: DocumentProperties;

    private constructor(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        schema: ImbricateDatabaseSchema,
        properties: DocumentProperties,
    ) {

        this._basePath = basePath;
        this._authentication = authentication;
        this._databaseUniqueIdentifier = databaseUniqueIdentifier;
        this._documentUniqueIdentifier = documentUniqueIdentifier;
        this._schema = schema;

        this._properties = properties;
    }

    public get uniqueIdentifier(): string {
        return this._documentUniqueIdentifier;
    }

    public get properties(): DocumentProperties {
        return this._properties;
    }

    public async putProperty(
        key: DocumentPropertyKey,
        value: DocumentPropertyValue<IMBRICATE_PROPERTY_TYPE>,
    ): Promise<DocumentEditRecord[]> {

        return await this.putProperties({
            ...this.properties,
            [key]: value,
        });
    }

    public async putProperties(
        properties: DocumentProperties,
    ): Promise<DocumentEditRecord[]> {

        const response = await axiosClient.put(joinUrl(
            this._basePath,
            "database",
            this._databaseUniqueIdentifier,
            "document",
            this._documentUniqueIdentifier,
        ), {
            properties,
        }, {
            headers: buildHeader(this._authentication),
        });

        return response.data.editRecords;
    }
}
