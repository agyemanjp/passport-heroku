/* eslint-disable camelcase */
/** Parse profile. */
export function parse(json: { id: string, name: string, email: string } & Profile["heroku"]) {
	if ('string' == typeof json) {
		json = JSON.parse(json)
	}

	const profile = {} as Profile
	// Normalized profile bits
	profile.id = String(json.id)
	profile.displayName = json.name
	if (json.email) {
		profile.emails = [{ value: json.email }]
	}
	// Heroku-specific profile bits
	profile.heroku = {
		beta: json.beta,
		verified: json.verified,
	}

	if (json.default_organization) {
		profile.heroku.default_organization = json.default_organization
	}

	return profile
}

export type Profile = {
	provider: `heroku`;

	/** the user's Heroku ID */
	id: string;

	/** the user's full name */
	displayName: string;

	/** the user's email addresses */
	emails: { value: string }[];

	/** Heroku-specific fields */
	heroku: {
		beta: any;
		verified: any;
		default_organization?: string
	};

	_raw?: string | Buffer;
	_json: any;
}
