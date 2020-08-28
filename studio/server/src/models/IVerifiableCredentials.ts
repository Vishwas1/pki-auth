export default interface IVerifiableCredential{
    id: string;
    subject: string; // did
    issuer: string; // did
    schemaId: string; //
    dataHash: string; // sha3
    appId: string; // organization
    // type: Array<string>; //AlumniCredential | BirthCertificates etc.
}

