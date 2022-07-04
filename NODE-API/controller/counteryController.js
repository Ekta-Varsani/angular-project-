const Countery = require("../model/counteryModel");

//get all counteries
const CounteryAll = async (req, res) => {
  try {
    const data = await Countery.find();
    res.json(data);
  } catch (error) {
    res.json({ Error: error });
  }
};

// get country by id 
const getCountryById = async (req, res) => {
  try {
    const data = await Countery.findById({_id: req.params.id})
    res.json(data)
  } catch (error) {
    res.json(error)
  }
}

//add Countery
const CounteryCreate = async (req, res) => {

  const country = new Countery(req.body)
  try {
    await country.save()
    res.send(country)

  } catch (e) {
    if (e.code === 11000) {
      res.send('country already exists')
    }
  }


  // try {
  //   const { CounteryName, CounteryCode, CurrencyCode, CurrencySign } = req.body;
  //   const CounteryObj = {
  //     CounteryName,
  //     CounteryCode,
  //     CurrencyCode,
  //     CurrencySign
  //   };
  //   if(req.file){
  //     CounteryObj.Sign = "http://localhost:4000" + "/public/" + req.file.originalname
  //   }
  //   // const existsCountery = await Countery.find({ CounteryName });
  //   // if (existsCountery.length === 0) {
  //     const Counteries = new Countery(CounteryObj);
  //     const savedCountery = await Counteries.save();
  //     res.status(200).json({savedCountery});
  //   // } else {
  //   //   res.status(200).json({ messsgae: "Country already exists" });
  //   // }
  // } catch (error) {
  //   console.log(error);
  //   res.status(401).send(error);
  // }
};

//update Countery
const CounteryUpdate = async (req, res) => {
  const data = {
    CounteryName: req.body.CounteryName,
    CounteryCode: req.body.CounteryCode,
    CurrencyCode: req.body.CurrencyCode,
    CurrencySign: req.body.CurrencySign
  };
  if(req.file){
    data.Sign = "http://localhost:4000" + "/public/" + req.file.originalname
  }
  try {
    const updateCountery = await Countery.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      data,
      { new: true }
    );
    res.json(updateCountery);
  } catch (error) {
    res.status(401).send(error);
  }
};

//delete Countery
const CounteryDelete = async (req, res) => {
  try {
    const removeCountery = await Countery.findByIdAndDelete(req.params.id);
    res.json(removeCountery);
  } catch (error) {
    res.json({ Error: error });
  }
};

//search country
const search = async (req, res) => {
  try{
    const result = await Countery.find({
      CounteryNAme: {$regex: req.body.CounteryName}
    })
    res.json(result)
  }
  catch(error){
    res.json(error)
  }
}

module.exports = {
  CounteryAll,
  CounteryCreate,
  CounteryUpdate,
  CounteryDelete,
  search,
  getCountryById

};