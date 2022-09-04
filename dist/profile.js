"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
/* eslint-disable camelcase */
/** Parse profile. */
function parse(json) {
    if ('string' == typeof json) {
        json = JSON.parse(json);
    }
    const profile = {};
    // Normalized profile bits
    profile.id = String(json.id);
    profile.displayName = json.name;
    if (json.email) {
        profile.emails = [{ value: json.email }];
    }
    // Heroku-specific profile bits
    profile.heroku = {
        beta: json.beta,
        verified: json.verified,
    };
    if (json.default_organization) {
        profile.heroku.default_organization = json.default_organization;
    }
    return profile;
}
exports.parse = parse;
