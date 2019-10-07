const mysql_conn=require('../database')
const { uploader } = require('../helpers/uploader'); 

module.exports={
    postCampaign(req,res){
        const {userid}=req.params
        try {
            let path = '/campaignimage';
            const upload = uploader(path, 'CAMP').fields([{ name: 'CampaignImage' }]);

            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }

                console.log(req.body.data)
                const { CampaignImage } = req.files
                console.log(CampaignImage)
                const imagePath = CampaignImage ? path + '/' + CampaignImage[0].filename : null
                console.log(imagePath)
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.campaign_image=imagePath

                var sql=`INSERT into campaign_post set ?`
                mysql_conn.query(sql,data,(err,result)=>{
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    sql = ` select * from campign_post cp join campaigner_data cd on cp.campaigner_id=cd.id join receiver_data rd on cp.receiver_id=rd.id
                            where cd.userid=${userid}`
                    mysql_conn.query(sql,(err,result1)=>{
                        if(err) {
                            console.log(err.message)
                            fs.unlinkSync('./public' + imagePath);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        return res.status(200).send(result1)
                    })
                })
                
            })
        } catch (err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    getCampaign(req,res){
        const {userid}=req.params

        var sql = ` select * from campign_post cp join campaigner_data cd on cp.campaigner_id=cd.id join receiver_data rd on cp.receiver_id=rd.id
                            where cd.userid=${userid}`
        mysql_conn.query(sql,(err,result)=>{
            if(err) {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            return res.status(200).send(result)
        })
    }
}