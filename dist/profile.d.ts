/// <reference types="node" />
/** Parse profile. */
export declare function parse(json: {
    id: string;
    name: string;
    email: string;
} & Profile["heroku"]): Profile;
export declare type Profile = {
    provider: `heroku`;
    /** the user's Heroku ID */
    id: string;
    /** the user's full name */
    displayName: string;
    /** the user's email addresses */
    emails: {
        value: string;
    }[];
    /** Heroku-specific fields */
    heroku: {
        beta: any;
        verified: any;
        default_organization?: string;
    };
    _raw?: string | Buffer;
    _json: any;
};
