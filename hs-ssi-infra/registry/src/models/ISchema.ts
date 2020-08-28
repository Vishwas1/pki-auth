export interface ISchema {
    id: string;
    credentialName: string;
    attributes: string; // JSON.stringyfy(Array<String>);
    version: string;
    owner: string; // did
    raw: string;
    description: string;
}


export interface ISchemaTemplate_Schema{
    $schema: string;
    description: string;
    type: string;
    properties: {};
    required: Array<string>;
    additionalProperties: boolean
}



export interface ISchemaTemplate {
    type: string;
    modelVersion: string;
    id: string;
    name: string;
    author: string;
    authored: string;
    schema: ISchemaTemplate_Schema
        
}

export interface IAttribute{
    name: string;
    type: string;
}