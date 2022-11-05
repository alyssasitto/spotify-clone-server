const router = require("express").Router();

router.get("/spotify", (req, res) => {
	console.log("request made");

	res.status(200).json({ message: "the request went through" });
});

module.exports = router;
