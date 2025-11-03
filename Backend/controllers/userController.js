const userModel = require("../models/userModel");

exports.storeUser = async (req, res, next) => {

  const data = req.body;
  console.log("Current_Data", data);

  try {

    const userData = await userModel.create(data);
    res.status(200).json({ success: true, userData })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })

  }
}

exports.getusers = async (req, res, next) => {
  try {
    const userDatas = await userModel.find();
    res.json({ success: true, userDatas })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}



exports.singleUser = async (req, res, next) => {
  const { email } = req.params;
  try {
    const userDatas = await userModel.find({ authEmail: email })
    res.json({ success: true, userDatas })
  } catch (err) {
    console.log("error");
    res.json({ success: false, message: err.message })

  }
}

exports.cancelAppointment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cancel =await userModel.findByIdAndDelete(id);
    console.log(id);
    
    res.json({ success: true, cancel })
  } catch (err) {
    res.json({ success: true, message:err.message })
  }

}