const router = require("express").Router();
const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");
const { response } = require("../app");

// route for getting top items
router.get("/top-items/:token", (req, res) => {
	const token = req.params.token;
	const spotifyApi = new SpotifyWebApi({ accessToken: token });

	axios
		.get("https://api.spotify.com/v1/me/top/tracks", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			res.status(200).json(response.data);
		})
		.catch((err) => {
			console.log(err);
		});

	console.log("THIS IS THE TOKEN", token);
});

router.get("/albums", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	console.log(req.headers.albums);

	spotifyApi
		.getAlbums([req.headers.albums])
		.then((response) => {
			console.log(response);
			res.status(200).json(response.body);
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
