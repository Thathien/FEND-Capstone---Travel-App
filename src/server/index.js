var path = require("path");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log("Example app listening on port 8080!");
});

// POST request
const postRequest = async (req, res) => {
    const dataReq = {
        nameLocal: req.body.nameLocal,
        tripNote: req.body.tripNote,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        dateCount: req.body.dateCount,
    };

    console.log(dataReq);

    try {
        // fetch data from geonames
        const geonamesUrl = `http://api.geonames.org/searchJSON?name=${encodeURIComponent(
            dataReq.nameLocal
        )}&maxRows=1&username=${process.env.API_GEONAMES_KEY}`;

        console.log(geonamesUrl);
        const geonamesResponse = await axios.get(geonamesUrl);
        console.log("response geonames", geonamesResponse.data);

        if (geonamesResponse.data.geonames.length <= 0) {
            res.status(200).json({
                error: "location",
                message: "Invalid location name.",
            });
            return;
        }

        // fetch data from weatherbit
        const geoname = geonamesResponse.data.geonames[0];
        const weatherbitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${geoname.lat}&lon=${geoname.lng}&days=${dataReq.dateCount}&key=${process.env.API_WEATHER_KEY}`;
        console.log(weatherbitUrl);
        const weatherResponse = await axios.get(weatherbitUrl);
        console.log("response weather", weatherResponse.data);

        // fetch data from pixabay
        const pixabayUrl = `https://pixabay.com/api/?key=${
            process.env.API_PIXABAY_KEY
        }&q=${encodeURIComponent(
            dataReq.nameLocal
        )}&image_type=photo&editors_choice=true`;
        const pixabayResponse = await axios.get(pixabayUrl);
        console.log("response pixabay", pixabayResponse.data);

        const dataRes = {
            geonames: geonamesResponse.data,
            weatherbit: weatherResponse.data,
            pixabay: pixabayResponse.data,
        };

        res.status(200).json({ dataReq, dataRes });
    } catch (error) {
        console.error("API call error:", error.message);
        res.status(500).json({
            error: "API error",
            message: "Failed to fetch data from APIs.",
        });
    }
};

app.post("/api", postRequest);

// Index - Home
app.get("/", function (req, res) {
    res.sendFile("dist/index.html");
});
