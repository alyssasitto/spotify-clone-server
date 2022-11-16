const router = require("express").Router();
const axios = require("axios");
const queryString = require("query-string");

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uri = process.env.redirect_uri;

const generateRandomString = function (length) {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const stateKey = "spotify_auth_state";

router.get("/login", (req, res) => {
	const state = generateRandomString(16);
	res.cookie(stateKey, state);

	const scope =
		"user-read-private user-read-email user-read-playback-state user-read-currently-playing  user-modify-playback-state playlist-read-private playlist-read-collaborative user-read-recently-played user-read-currently-playing user-library-read user-top-read ";
	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			queryString.stringify({
				response_type: "code",
				client_id: client_id,
				scope: scope,
				redirect_uri: redirect_uri,
				show_dialog: true,
				state: state,
			})
	);
});

//accounts.spotify.com/en/authorize?client_id=41c19b4a67134bd3a741fb8d3d43e20a&redirect_uri=http%3A%2F%2Flocalhost%3A5005%2Fcallback%2F&response_type=code&scope=user-read-private%20user-read-email&show_dialog=true&state=M37i9VxNO3ufPEez

router.get("/callback", (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;

	console.log("THE CODE", code);
	console.log("THE STATE", state);
	console.log("THE STOREDSTATE", storedState);

	if (state === null || state !== storedState) {
		res.redirect(
			"/#" +
				queryString.stringify({
					error: "state_mismatch",
				})
		);
	} else {
		axios({
			method: "post",
			url: "https://accounts.spotify.com/api/token",
			data: queryString.stringify({
				grant_type: "authorization_code",
				code: code,
				redirect_uri: redirect_uri,
			}),
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${new Buffer.from(
					`${client_id}:${client_secret}`
				).toString("base64")}`,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					const { access_token, refresh_token, expires_in } = response.data;

					res.redirect(
						`http://localhost:3000/?` +
							queryString.stringify({
								access_token,
								refresh_token,
								expires_in,
							})
					);
				} else {
					res.redirect(
						`/?${queryString.stringify({ error: "invalid token" })}`
					);
				}
			})
			.catch((err) => {
				res.send(err);
			});
	}
});

router.get("/refresh_token", (req, res) => {
	const { refresh_token } = req.query;

	axios({
		method: "post",
		url: "https://accounts.spotify.com/api/token",
		data: queryString.stringify({
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		}),
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${new Buffer.from(
				`${client_id}:${client_secret}`
			).toString("base64")}`,
		},
	})
		.then((response) => {
			res.send(response.data);
		})
		.catch((err) => {
			res.send(err);
		});
});

module.exports = router;
