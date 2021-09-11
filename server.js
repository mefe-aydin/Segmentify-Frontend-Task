const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5005;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("app"));
app.use("/css", express.static(__dirname + "app/src/styles"));
app.use("/js", express.static(__dirname + "app/src"));
app.use("/images", express.static(__dirname + "app/src/assets/img"));

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "app/index.html"));
});
app.listen(PORT, () =>
    console.log("Server listening on http://localhost:5005")
);