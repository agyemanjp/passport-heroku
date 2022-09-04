import { Strategy as PassportStrategy } from 'passport'
import { Strategy as OAuth2Strategy, StrategyOptions, InternalOAuthError } from 'passport-oauth2'
import { parse, Profile } from './profile'


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
export class Strategy extends OAuth2Strategy implements PassportStrategy {
	private _userProfileURL: string

	constructor(options: StrategyOptions & { userAgent?: string; userProfileURL?: string }, verify: VerifyFn) {
		options = options || {}
		options.authorizationURL = options.authorizationURL || 'https://id.heroku.com/oauth/authorize'
		options.tokenURL = options.tokenURL || 'https://id.heroku.com/oauth/token'
		options.scopeSeparator = options.scopeSeparator || ','
		options.customHeaders = options.customHeaders || {}

		if (!options.customHeaders['User-Agent']) {
			options.customHeaders['User-Agent'] = options.userAgent || 'passport-heroku'
		}
		if (!options.customHeaders['Accept']) {
			options.customHeaders['Accept'] = "application/vnd.heroku+json; version=3"
		}

		super(options, verify)

		this.name = 'heroku'
		this._userProfileURL = options.userProfileURL || 'https://api.heroku.com/account'
		this._oauth2.useAuthorizationHeaderforGET(true)
	}

	name = super.name

	authenticate = super.authenticate

	/** Retrieve user profile from Heroku and return it as a normalized profile */
	public userProfile(accessToken: string, done: (err: Error | null, result?: Profile) => void) {
		this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
			let json = undefined as undefined | ArgsType<typeof parse>[0]

			if (err) {
				return done(new InternalOAuthError('Failed to fetch user profile', err))
			}

			if (!body) {
				return done(new Error('User profile fetch response empty', err))
			}

			try {
				json = JSON.parse(body.toString())
				if (!json) {
					return done(new Error('Could not parse user profile JSON', err))
				}

				const profile = parse(json)
				profile.provider = 'heroku'
				profile._raw = body
				profile._json = json

				done(null, profile)
			}
			catch (ex) {
				return done(new Error('Failed to parse user profile'))
			}
		})
	}
}

type ArgsType<F extends (...x: any[]) => any> = F extends (...x: infer A) => any ? A : never

export type VerifyFunction =
	((accessToken: string, refreshToken: string, profile: any, verified: VerifyCallback) => void) |
	((accessToken: string, refreshToken: string, results: any, profile: any, verified: VerifyCallback) => void);

type VerifyCallback = (err?: Error | null, user?: Express.User, info?: object) => void;
