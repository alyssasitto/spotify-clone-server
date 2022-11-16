const router = require("express").Router();
const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");

// route for getting top items
router.get("/top-items", (req, res) => {
	const token = req.headers.token;

	axios
		.get("https://api.spotify.com/v1/me/top/tracks?limit=50", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			console.log("TOP ITEMS", response);
			res.status(200).json(response.data);
		})
		.catch((err) => {
			console.log(err);
		});
});

// route for getting most recent songs
router.get("/recents", (req, res) => {
	const token = req.headers.token;

	axios
		.get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
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
});

// route for getting albums by their id
router.get("/albums", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	spotifyApi
		.getAlbums([req.headers.albums])
		.then((response) => {
			console.log("ALBUMS", response);
			res.status(200).json(response.body);
		})
		.catch((err) => {
			console.log(err);
		});
});

// route for getting featured playlists
router.get("/featured-playlists", (req, res) => {
	const token = req.headers.token;

	axios
		.get("https://api.spotify.com/v1/browse/featured-playlists?limit=50", {
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
});

// route for getting new releases
router.get("/new-releases", (req, res) => {
	const token = req.headers.token;

	axios
		.get("https://api.spotify.com/v1/browse/new-releases?limit=50", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			res.status(200).json(response.data);
			console.log("NEW RELEASES", response);
		})
		.catch((err) => {
			console.log(err);
		});
});

// route for getting categories
router.get("/categories", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	console.log("THIS IS THE TOKENNN ======>", req.headers.token);

	spotifyApi
		.getCategories({
			limit: 50,
			country: "US",
		})
		.then((response) => {
			res.status(200).json(response.body);
		})
		.catch((err) => {
			console.log(err);
		});
});

// route for getting recent playlists
router.get("/playlists", (req, res) => {
	console.log("TOKENNNN ====>", req.headers.token);

	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	spotifyApi
		.getUserPlaylists({
			limit: 50,
		})
		.then((response) => {
			res.status(200).json(response.body);
		})
		.catch((err) => {
			console.log(err);
		});
});

// route for getting single playlist
router.get("/playlist/:id", (req, res) => {
	const id = req.params.id;
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	spotifyApi
		.getPlaylist(id)
		.then((response) => {
			res.status(200).json(response.body);
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;

// .then((response) => {
// 	return axios.get("https://api.spotify.com/v1/browse/new-releases", {
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 		},
// 	});
// })
// .then((response) => {
// 	console.log(response);
// 	res.status(200).json(response.data);
// })
