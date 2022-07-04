const City = require("../model/cityModel")

//add city
const CityCreate = async (req, res) => {
    try {
        const { CityName, countryId, latitude, color } = req.body;
        const CityObj = {
            CityName,
            countryId,
            latitude,
            color
        };
        const cities = new City(CityObj);
        cities.save()
        res.status(200).json(cities);

    } catch (error) {
        console.log(error);
        res.status(401).send(error);
    }
}

//get cities
const getCity = async (req, res) => {
    try {
        const data = await City.find({}).populate(
            "countryId",
            "CounteryName"
        )
        res.json(data);
    }
    catch (error) {
        res.json(error);
    }
};

//update city
const CityUpdate = async (req, res) => {
    try {
        const data = {
            CityName: req.body.CityName,
            color: req.body.color,
            latitude: req.body.latitude,
        };

        const updateCity = await City.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            data,
            { new: true }
        );
        res.json(updateCity);
    } catch (error) {
        res.status(401).send(error);
    }
};



module.exports = {
    CityCreate,
    getCity,
    CityUpdate
}