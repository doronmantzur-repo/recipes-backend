const express = require("express");
const app = express();
const port = 8080;
const recipeRouter = require("./routes/recipeRoutes.js");
const authRouter = require("./routes/authRoutes.js");
const logger = require("./middlewares/logger.js");

const cors = require("cors");

app.use(logger);
app.use(express.static("public/")); //exposes public folder

//by cors I can define the domains that are allowed to access the API (this is a browser protection)
//for example
// app.use(cors({
//   origin: 'http://localhost:3000'
// }));
//Execute middleware over all routes
app.use(cors());

//middleware that parse JSON every route
app.use(express.json());
app.use("/recipes", recipeRouter);
app.use("/auth", authRouter);

//error handling middleware - has to be the last middleware
//Usually it is implemented inline
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: true,
    message: err.message,
    statusCode: err.status || 500,
  });
});

recipeRouter.get("/", (req, res) => {
  res.send("Hello World!");
});


// app.get("/demo", (req, res) => {
//     console.log("Headers:", req.headers);
//     console.log("Query:", req.query);
//     console.log("Body:", req.body);
//     console.log("Params:", req.params);
//     console.log("Cookies:", req.cookies);
//     console.log("Signed Cookies:", req.signedCookies);
//     console.log("Files:", req.files);
//     console.log("URL:", req.url);
//     console.log("Method:", req.method);
//     console.log("Path:", req.path);
//     console.log("Protocol:", req.protocol);
//     console.log("Secure:", req.secure);
//     console.log("Subdomains:", req.subdomains);
//     console.log("Hostname:", req.hostname);
//     console.log("IP:", req.ip);
//     console.log("IPs:", req.ips);
//     console.log("Original URL:", req.originalUrl);
//     console.log("Route:", req.route);
//     console.log("Signed:", req.signed);
//     console.log("Fresh:", req.fresh);
//     console.log("Stale:", req.stale);
//     res.send("Hello World!");
// });

// app.get("/demo2", (req, res) => {
//     res.send("Hello World!");
//     res.json({
//         message: "Hello World!",
//     });
//     res.status(404).send("Not Found");
//     res.status(500).send("Internal Server Error");
//     res.status(200).send("OK");
//     res.status(201).send("Created");
//     res.status(202).send("Accepted");
//     res.status(203).send("Non-Authoritative Information");
//     res.status(204).send("No Content");
//     res.status(205).send("Reset Content");
//     res.status(206).send("Partial Content");
//     res.status(207).send("Multi-Status");
//     res.status(208).send("Already Reported");
//     res.status(226).send("IM Used");
//     res.redirect("https://www.google.com");
//     res.redirect(301, "https://www.google.com");

// });

// app.get("/demo3", (req, res) => {
//     res.send("Hello World");
// });

// app.get("*", (req, res) => {
//     res.status(404).send("page not found");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
