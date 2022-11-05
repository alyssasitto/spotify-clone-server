const app = require("express")();

require("dotenv/config");
require("./config")(app);

const spotifyRoutes = require("./routes/spotify.routes");
app.use("/", spotifyRoutes);

module.exports = app;
