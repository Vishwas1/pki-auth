export default interface ISchema{
    id: string;
    credentialName: string;
    attributes: string; // JSON.stringyfy(Array<String>);
    version: string;   
    owner: string; // did
}