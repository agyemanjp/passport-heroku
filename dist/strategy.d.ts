import { default as OAuth2Strategy, StrategyOptions, VerifyFunction } from 'passport-oauth2';
import { Profile } from './profile';
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
export declare class Strategy extends OAuth2Strategy {
    private _userProfileURL;
    constructor(options: StrategyOptions & {
        userAgent?: string;
        userProfileURL?: string;
    }, verify: VerifyFunction);
    /** Retrieve user profile from Heroku and return it as a normalized profile */
    userProfile(accessToken: string, done: (err: Error | null, result?: Profile) => void): void;
}
