const express = require('express');
const { Campaigncontroller } = require('../controllers');


const router = express.Router();

router.post('/postCampaign',Campaigncontroller.postCampaign)
router.get('/getCampaign',Campaigncontroller.getCampaign)

module.exports=router