/**
 * @author WMXPY
 * @namespace Document
 * @description Document
 */

import { DocumentAnnotationValue, DocumentAnnotations, DocumentEditRecord, DocumentProperties, DocumentPropertyKey, DocumentPropertyValue, IImbricateDocument, IMBRICATE_PROPERTY_TYPE } from "@imbricate/core";
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
        properties: DocumentProperties,
        annotations: DocumentAnnotations,
    ): ImbricateStackAPIDocument {

        return new ImbricateStackAPIDocument(
            basePath,
            authentication,
            databaseUniqueIdentifier,
            documentUniqueIdentifier,
            properties,
            annotations,
        );
    }

    private readonly _basePath: string;
    private readonly _authentication: ImbricateStackAPIAuthentication;
    private readonly _databaseUniqueIdentifier: string;
    private readonly _documentUniqueIdentifier: string;

    private _properties: DocumentProperties;
    private _annotations: DocumentAnnotations;

    private constructor(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        properties: DocumentProperties,
        annotations: DocumentAnnotations,
    ) {

        this._basePath = basePath;
        this._authentication = authentication;
        this._databaseUniqueIdentifier = databaseUniqueIdentifier;
        this._documentUniqueIdentifier = documentUniqueIdentifier;

        this._properties = properties;
        this._annotations = annotations;
    }

    public get uniqueIdentifier(): string {
        return this._documentUniqueIdentifier;
    }

    public get properties(): DocumentProperties {
        return this._properties;
    }

    public get annotations(): DocumentAnnotations {
        return this._annotations;
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

    public async getEditRecords(): Promise<DocumentEditRecord[]> {

        const response = await axiosClient.get(joinUrl(
            this._basePath,
            "database",
            this._databaseUniqueIdentifier,
            "document",
            this._documentUniqueIdentifier,
            "edit-records",
        ), {
            headers: buildHeader(this._authentication),
        });

        return response.data.editRecords;
    }

    public async putAnnotation(
        namespace: string,
        identifier: string,
        value: DocumentAnnotationValue,
    ): Promise<DocumentEditRecord[]> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "database",
            this._databaseUniqueIdentifier,
            "document",
            this._documentUniqueIdentifier,
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
    ): Promise<DocumentEditRecord[]> {

        const response = await axiosClient.post(joinUrl(
            this._basePath,
            "database",
            this._databaseUniqueIdentifier,
            "document",
            this._documentUniqueIdentifier,
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
