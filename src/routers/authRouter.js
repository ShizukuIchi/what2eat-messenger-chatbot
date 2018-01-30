const router = require("express").Router();
// const controller = require("../controllers/authController.js");

function temp(req, res){
  return res.status(200).send('hi')    
}

router.get("/authorize", temp);
router.post("/authorize", temp);

module.exports = router;