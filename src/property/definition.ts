/**
 * @namespace Property
 * @description Definition
 */

import { IMBRICATE_PROPERTY_TYPE, ImbricatePropertyKey, ImbricatePropertyValueObject } from "@imbricate/core";

export type InstanceProperty = {

    readonly key: string;
    readonly type: IMBRICATE_PROPERTY_TYPE;
    readonly value: ImbricatePropertyValueObject<IMBRICATE_PROPERTY_TYPE>;
};

export type InstancePropertyRecord = Record<ImbricatePropertyKey, InstanceProperty>;
