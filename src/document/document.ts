/**
 * @author WMXPY
 * @namespace Document
 * @description Document
 */

import { DocumentAnnotationValue, DocumentAnnotations, DocumentEditRecord, IImbricateDocument, IMBRICATE_DOCUMENT_FEATURE, ImbricateDocumentAddEditRecordsOutcome, ImbricateDocumentDeleteAnnotationOutcome, ImbricateDocumentFullFeatureBase, ImbricateDocumentGetEditRecordsOutcome, ImbricateDocumentGetPropertiesOutcome, ImbricateDocumentGetPropertyOutcome, ImbricateDocumentPutAnnotationOutcome, ImbricateDocumentPutPropertyOutcome, ImbricatePropertiesDrafter, ImbricatePropertyKey, ImbricatePropertyRecord, S_Document_GetProperty_NotFound, rebuildImbricateDocumentDeleteAnnotationSymbol, rebuildImbricateDocumentGetEditRecordsSymbol, rebuildImbricateDocumentPutAnnotationSymbol, rebuildImbricateDocumentPutPropertySymbol } from "@imbricate/core";
import { ImbricateStackAPIAuthentication } from "../definition";
import { axiosClient } from "../util/client";
import { getAxiosErrorSymbol } from "../util/error";
import { buildHeader } from "../util/header";
import { joinUrl } from "../util/path-joiner";
import { draftImbricateProperties } from "../property/draft";
import { propertyRecordToInstanceRecord } from "../property/parse";

export class ImbricateStackAPIDocument extends ImbricateDocumentFullFeatureBase implements IImbricateDocument {

    public static create(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        documentVersion: string,
        supportedFeatures: IMBRICATE_DOCUMENT_FEATURE[],
        properties: ImbricatePropertyRecord,
        annotations: DocumentAnnotations,
    ): ImbricateStackAPIDocument {

        return new ImbricateStackAPIDocument(
            basePath,
            authentication,
            databaseUniqueIdentifier,
            documentUniqueIdentifier,
            supportedFeatures,
            documentVersion,
            properties,
            annotations,
        );
    }

    private readonly _basePath: string;
    private readonly _authentication: ImbricateStackAPIAuthentication;
    private readonly _databaseUniqueIdentifier: string;
    private readonly _documentUniqueIdentifier: string;

    private _documentVersion: string;

    private _properties: ImbricatePropertyRecord;
    private _annotations: DocumentAnnotations;

    public readonly supportedFeatures: IMBRICATE_DOCUMENT_FEATURE[];

    private constructor(
        basePath: string,
        authentication: ImbricateStackAPIAuthentication,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        supportedFeatures: IMBRICATE_DOCUMENT_FEATURE[],
        documentVersion: string,
        properties: ImbricatePropertyRecord,
        annotations: DocumentAnnotations,
    ) {

        super();

        this._basePath = basePath;
        this._authentication = authentication;
        this._databaseUniqueIdentifier = databaseUniqueIdentifier;
        this._documentUniqueIdentifier = documentUniqueIdentifier;

        this._documentVersion = documentVersion;

        this._properties = properties;
        this._annotations = annotations;

        this.supportedFeatures = supportedFeatures;
    }

    public get uniqueIdentifier(): string {
        return this._documentUniqueIdentifier;
    }

    public get documentVersion(): string {
        return this._documentVersion;
    }

    public get annotations(): DocumentAnnotations {
        return this._annotations;
    }

    public getProperty(key: ImbricatePropertyKey): ImbricateDocumentGetPropertyOutcome {

        const property = this._properties[key];

        if (!property) {
            return S_Document_GetProperty_NotFound;
        }

        return {
            property,
        };
    }

    public getProperties(): ImbricateDocumentGetPropertiesOutcome {

        return {
            properties: this._properties,
        };
    }

    public async mergeProperties(
        propertiesDrafter: ImbricatePropertiesDrafter,
    ): Promise<ImbricateDocumentPutPropertyOutcome> {

        const properties = draftImbricateProperties(propertiesDrafter);

        try {

            const response = await axiosClient.post(joinUrl(
                this._basePath,
                "database",
                this._databaseUniqueIdentifier,
                "document",
                this._documentUniqueIdentifier,
                "merge",
            ), {
                properties: propertyRecordToInstanceRecord(properties),
            }, {
                headers: buildHeader(this._authentication),
            });

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDocumentPutPropertySymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async replaceProperties(
        propertiesDrafter: ImbricatePropertiesDrafter,
    ): Promise<ImbricateDocumentPutPropertyOutcome> {

        const properties = draftImbricateProperties(propertiesDrafter);

        try {

            const response = await axiosClient.put(joinUrl(
                this._basePath,
                "database",
                this._databaseUniqueIdentifier,
                "document",
                this._documentUniqueIdentifier,
            ), {
                properties: propertyRecordToInstanceRecord(properties),
            }, {
                headers: buildHeader(this._authentication),
            });

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDocumentPutPropertySymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async addEditRecords(
        _editRecords: DocumentEditRecord[],
    ): Promise<ImbricateDocumentAddEditRecordsOutcome> {

        throw new Error("Method not implemented.");
    }

    public async getEditRecords(): Promise<ImbricateDocumentGetEditRecordsOutcome> {

        try {

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

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDocumentGetEditRecordsSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async putAnnotation(
        namespace: string,
        identifier: string,
        value: DocumentAnnotationValue,
    ): Promise<ImbricateDocumentPutAnnotationOutcome> {

        try {

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

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDocumentPutAnnotationSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }

    public async deleteAnnotation(
        namespace: string,
        identifier: string,
    ): Promise<ImbricateDocumentDeleteAnnotationOutcome> {

        try {

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

            return {
                editRecords: response.data.editRecords,
            };
        } catch (error) {

            return rebuildImbricateDocumentDeleteAnnotationSymbol(
                getAxiosErrorSymbol(error),
            );
        }
    }
}
