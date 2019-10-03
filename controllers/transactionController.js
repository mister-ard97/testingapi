const mysql_conn = require('../database');
const moment = require('moment')
const fs = require('fs');
const midtransClient = require('midtrans-client');

const { uploader } = require('../helpers/uploader'); 

module.exports = {
    // User
    addTransaction: (req, res) => {
        let { firstName,
            lastName,
            total_price,
            address } = req.body.dataUser 

        let dataTransaction = {
            kodeTransaksi: 'MaCommerce' + Date.now(),
            firstName,
            lastName,
            total_price,
            addressUser: address,
            userId: req.user.userId,
            status: 10,
            date_created: new Date(),
            is_deleted: 0
        }

        let sql = `insert into transaction set ?`
        mysql_conn.query(sql, dataTransaction, (err, results) => {
            if (err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            sql = ''

            req.body.data.forEach((val) => {
                sql += `update cart set move_to_transaction = 1 where userId = ${val.userId} and is_deleted = 0 and move_to_transaction = 0;`
            })

            mysql_conn.query(sql, (err, moveToTransaction) => {
                if (err) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                }

                sql = ''

                let values = []

                req.body.data.forEach((val) => {
                    values.push([val.productId, val.small, val.medium, val.large, val.xlarge, val.price, val.total_price, results.insertId, val.userId, 0])
                })

                sql = `insert into transaction_detail (productId, small, medium, large, xlarge, price, total_price, transactionId, userId, is_deleted) values ?`
                mysql_conn.query(sql, [values], (err, insertStatus) => {
                    if (err) {
                        return res.status(500).json({ err });
                    }

                    sql = `select t.*, u.username from transaction as t join users as u on t.userId = u.id where t.id = ${results.insertId} and t.userId = ${req.user.userId}`
                    mysql_conn.query(sql, (err, dataTransactionUI) => {
                        if (err) {
                            return res.status(500).json({ err });
                        }

                        sql = `select 
                                        td.*, 
                                        p.name as productName
                                    from transaction_detail as td 
                                    join product as p on td.productId = p.id
                                    where td.transactionId = ${results.insertId}`

                        mysql_conn.query(sql, (err, dataTransactionDetailUI) => {
                            if (err) {
                                return res.status(500).json({ err });
                            }
                            console.log('Data Transaction Detail UI')
                            console.log(dataTransactionDetailUI)

                            return res.status(200).send({
                                dataTransactionUI,
                                dataTransactionDetailUI
                            })
                        })
                    })
                })
            })
        })
    },

    getTransaction: (req, res) => {
        let sql = `select * from transaction where userId = ${req.user.userId} order by date_created desc`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ err });
            }

            if(results.length === 0) {
                return res.status(500).send({status: 'Empty Transaction', message: 'There is not transaction in this user'})
            }

            return res.status(200).send({
                dataTransactionUI: results
            })
        })
    },

    getTransactionDetail: (req, res) => {
        let sql = `select t.*, u.username from transaction as t join users as u on t.userId = u.id where t.id = ${req.params.id} and t.userId = ${req.user.userId}`
        mysql_conn.query(sql ,(err, firstResults) => {
            if (err) {
                return res.status(500).json({ err });
            }

            sql = `select 
            td.*, 
            p.name as productName 
            from transaction_detail as td 
            join product as p on td.productId = p.id 
            where td.transactionId = ${req.params.id}`

            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).json({ err });
                }

                if (results.length === 0) {
                    return res.status(500).send({ status: 'Empty Transaction Detail', message: `There isn't Transaction detail` })
                }

                return res.status(200).send({
                    dataTransactionUI: firstResults,
                    dataTransactionDetailUI: results
                })
            })
        })
    },

    uploadPaymentUser: (req, res) => {
        try {
            let path = '/payment';
            const upload = uploader(path, 'MaCommerce').fields([{ name: 'paymentImage' }]);

            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }

                console.log(req.body.data)
                const { paymentImage } = req.files
                console.log(paymentImage)
                const imagePath = paymentImage ? path + '/' + paymentImage[0].filename : null
                console.log(imagePath)
                
                let sql = `update transaction set transactionImage = '${imagePath}', status = 1 where id = ${req.params.id}`
                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }

                    sql = `select t.*, u.username from transaction as t join users as u on t.userId = u.id where t.id = ${req.params.id} and t.userId = ${req.user.userId}`
                    mysql_conn.query(sql, (err, TransactionSelected) => {
                        if (err) {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }

                        sql = `select 
                                        td.*, 
                                        p.name as productName
                                    from transaction_detail as td 
                                    join product as p on td.productId = p.id
                                    where td.transactionId = ${req.params.id}`
                        
                        mysql_conn.query(sql, (err, TransactionDetail) => {
                            if (err) {
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                            } 

                            return res.status(200).send({
                                dataTransactionUI: TransactionSelected,
                                dataTransactionDetailUI: TransactionDetail
                            })
                        })
                    }) 
                })
            })
        } catch (err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },

    // Admin
    getAllTransaction: (req, res) => {
        let sql = `select t.*, u.username from transaction as t join users as u on t.userId = u.id order by t.date_created desc`
        mysql_conn.query(sql, (err, AllTransaction) => {
            if (err) {
                return res.status(500).json({ err });
            }

            if (AllTransaction.length === 0) {
                return res.status(500).send({ status: 'Empty Transaction', message: 'There is not transaction in this user' })
            }

            return res.status(200).send({
                dataTransactionUI: AllTransaction
            })
        })
    },

    getTransactionAdminDetail: (req, res) => {
        let sql = `select t.*, u.username from transaction as t join users as u on t.userId = u.id where t.id = ${req.params.id}`
        mysql_conn.query(sql, (err, firstResults) => {
            if (err) {
                return res.status(500).json({ err });
            }

            sql = `select 
            td.*, 
            p.name as productName 
            from transaction_detail as td 
            join product as p on td.productId = p.id 
            where td.transactionId = ${req.params.id}`

            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).json({ err });
                }

                if (results.length === 0) {
                    return res.status(500).send({ status: 'Empty Transaction Detail', message: `There isn't Transaction detail` })
                }

                return res.status(200).send({
                    dataTransactionUI: firstResults,
                    dataTransactionDetailUI: results
                })
            })
        })
    },

    refuseTransaction: (req, res) => {
        let sql = `update transaction set status = 11 where id = ${req.params.id}`;
        mysql_conn.query(sql, (err, updateTransaction) => {
            if (err) {
                return res.status(500).json({ err });
            }

            sql = `select * from transaction_detail where transactionId = ${req.params.id}`
            mysql_conn.query(sql, (err, refuseTransactionDetail) => {
                if (err) {
                    return res.status(500).json({ err });
                }

                sql = ''

                refuseTransactionDetail.forEach((val) => {
                    sql += `update cart set is_deleted = 1 where userId = ${val.userId} and is_deleted = 0 and move_to_transaction = 1;`
                })

                mysql_conn.query(sql, (err, updateRefuseTransction) => {
                    if (err) {
                        return res.status(500).json({ err });
                    }

                    return res.status(200).send(updateRefuseTransction)
                })
            })
        })
    },

    acceptTransaction: (req, res) => {
        let sql = `update transaction set status = 0 where id = ${req.params.id}`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ err });
            }

            sql = `select * from transaction_detail where transactionId = ${req.params.id}`
            mysql_conn.query(sql, (err, dataTransactionDetail) => {
                if (err) {
                    return res.status(500).json({ err });
                }

                sql = 'select * from stockproduct where productId in ('

                dataTransactionDetail.forEach((val, id) => {
                    if (id !== dataTransactionDetail.length - 1) {
                        sql += val.productId + ', '
                    } else {
                        sql += val.productId
                    }
                })

                sql += ')'
                mysql_conn.query(sql, (err, listStockProduct) => {
                    if (err) {
                        return res.status(500).json({ err });
                    }

                    sql = ''

                    listStockProduct.forEach((val) => {
                        sql += `update stockproduct set `
                        dataTransactionDetail.forEach((dataCart) => {
                            if (val.productId === dataCart.productId) {
                                val.small -= dataCart.small
                                sql += `small = ${val.small}, `

                                val.medium -= dataCart.medium
                                sql += `medium = ${val.medium}, `

                                val.large -= dataCart.large
                                sql += `large = ${val.large}, `

                                val.xlarge -= dataCart.xlarge
                                sql += `xlarge = ${val.xlarge}`

                                sql += ` where productId = ${dataCart.productId};`
                            }
                        })
                    })

                    mysql_conn.query(sql, (err, results) => {
                        if (err) {
                            return res.status(500).json({ err });
                        }

                        sql = ''

                        dataTransactionDetail.forEach((val) => {
                            sql += `delete from cart where userId = ${val.userId} and is_deleted = 0 and move_to_transaction = 1;`
                        })

                        mysql_conn.query(sql, (err, deleteCart) => {
                            if (err) {
                                return res.status(500).json({ err });
                            }

                            sql = `select t.*, u.username from transaction as t join users as u on t.userId = u.id where t.id = ${req.params.id} and t.userId = ${req.user.userId}`
                            mysql_conn.query(sql, (err, dataTransactionUI) => {
                                if (err) {
                                    return res.status(500).json({ err });
                                }

                                sql = `select 
                                        td.*, 
                                        p.name as productName
                                    from transaction_detail as td 
                                    join product as p on td.productId = p.id
                                    where td.transactionId = ${req.params.id}`
                                
                                mysql_conn.query(sql, (err, dataTransactionDetailUI) => {
                                    if (err) {
                                        return res.status(500).json({ err });
                                    }

                                    return res.status(200).send({
                                        dataTransactionUI,
                                        dataTransactionDetailUI
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    },


    refusePaymentSlipFromUser: (req, res) => {
        let sql = `select * from transaction where id = ${req.params.id}`;
        mysql_conn.query(sql, (err, transactionUser) => {
            if (err) {
                return res.status(500).json({ err });
            }

            if (transactionUser.length === 0) {
                return res.status(500).send({ status: 'Wrong transaction id', message: 'There is not transaction data with this id' })
            }

            fs.unlinkSync('./public' + transactionUser[0].transactionImage);

            sql = `update transaction set transactionImage = null, status = 9 where id = ${req.params.id}`;
            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).json({ err });
                }

                return res.status(200).send(results)
            })
        })
    },

    acceptPaymentSlipFromUser: (req, res) => {
        let sql = `update transaction set status = 2 where id = ${req.params.id}`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ err });
            }

            return res.status(200).send(results)
        })
    },

    sendProductToUser: (req, res) => {
        let sql = `update transaction set status = 3 where id = ${req.params.id}`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ err });
            }

            return res.status(200).send(results)
        })
    },

    confirmProduct: (req, res) => {
        let sql = `update transaction set status = 4 where id = ${req.params.id}`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ err });
            }

            return res.status(200).send(results)
        })
    },

    sendNotification: (req, res) => {
        let sql = `update transaction set status = 8 where id = ${req.params.id}`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ err });
            }

            return res.status(200).send(results)
        })
    },


    // Tes midtrans
    simpleCheckOutMidTrans: (req, res) => {
        console.log('Testtttt')
        console.log(req.body.total_price)
        // initialize snap client object
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: 'SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA',
            clientKey: 'SB-Mid-client-61XuGAwQ8Bj8LxSS'
        });
        let parameter = {
            "transaction_details": {
                "order_id": "order-id-node-" + Math.round((new Date()).getTime() / 1000),
                "gross_amount": req.body.total_price
            }, "credit_card": {
                "secure": true
            },
            "enabled_payments": [
                "gopay"
            ]
        };
        console.log(parameter)
        // create snap transaction token
        snap.createTransactionToken(parameter)
            .then((transactionToken) => {
                // pass transaction token to frontend
                res.status(200).send({
                    token: transactionToken
                })
            })
    }
}
