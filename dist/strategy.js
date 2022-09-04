"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const passport_oauth2_1 = __importStar(require("passport-oauth2"));
const profile_1 = require("./profile");
/** `Strategy` constructor.
 *
 * The Heroku authentication strategy authenticates requests by delegating to Heroku using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Heroku application's Client ID
 *   - `clientSecret`  your Heroku application's Client Secret
 *   - `callbackURL`   URL to which Heroku will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'global', 'identity', 'read', 'write', 'read-protected', 'write-protected', or none.
 *                     (see https://devcenter.heroku.com/articles/oauth#scopes for more info)
 *
 * Examples:
 *
 *     passport.use(new HerokuStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/github/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
class Strategy extends passport_oauth2_1.default {
    constructor(options, verify) {
        options = options || {};
        options.authorizationURL = options.authorizationURL || 'https://id.heroku.com/oauth/authorize';
        options.tokenURL = options.tokenURL || 'https://id.heroku.com/oauth/token';
        options.scopeSeparator = options.scopeSeparator || ',';
        options.customHeaders = options.customHeaders || {};
        if (!options.customHeaders['User-Agent']) {
            options.customHeaders['User-Agent'] = options.userAgent || 'passport-heroku';
        }
        if (!options.customHeaders['Accept']) {
            options.customHeaders['Accept'] = "application/vnd.heroku+json; version=3";
        }
        super(options, verify);
        this.name = 'heroku';
        this._userProfileURL = options.userProfileURL || 'https://api.heroku.com/account';
        this._oauth2.useAuthorizationHeaderforGET(true);
    }
    // /** Inherit from `OAuth2Strategy`. */
    // util.inherits(Strategy, OAuth2Strategy);
    /** Retrieve user profile from Heroku and return it as a normalized profile */
    userProfile(accessToken, done) {
        this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
            let json = undefined;
            if (err) {
                return done(new passport_oauth2_1.InternalOAuthError('Failed to fetch user profile', err));
            }
            if (!body) {
                return done(new Error('User profile fetch response empty', err));
            }
            try {
                json = JSON.parse(body.toString());
                if (!json) {
                    return done(new Error('Could not parse user profile JSON', err));
                }
                const profile = (0, profile_1.parse)(json);
                profile.provider = 'heroku';
                profile._raw = body;
                profile._json = json;
                done(null, profile);
            }
            catch (ex) {
                return done(new Error('Failed to parse user profile'));
            }
        });
    }
}
exports.Strategy = Strategy;
