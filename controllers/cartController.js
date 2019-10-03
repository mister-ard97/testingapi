const mysql_conn = require('../database');

module.exports = {
    addToCart: (req, res) => {
        let {
            productId,
            price,
            stockSelected,
            Qty,
        } = req.body.data
        console.log(req.body.data)
        let sql = `select * from cart where userId = ${req.user.userId} and productId = ${productId} and is_deleted = 0 and move_to_transaction = 0`
        mysql_conn.query(sql, (err, cartResults) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            sql = ''

            let dataDBCart = {}
            console.log(cartResults)

            if(cartResults.length === 0 ) {
                dataDBCart = {
                    productId,
                    price,
                    is_deleted: 0,
                    total_price: price * Qty,
                    userId: req.user.userId,
                    move_to_transaction: 0
                }

                if(stockSelected === 'small') {
                    dataDBCart.small = Qty
                }

                if (stockSelected === 'medium') {
                    dataDBCart.medium = Qty
                }

                if (stockSelected === 'large') {
                    dataDBCart.large = Qty
                }

                if (stockSelected === 'xlarge') {
                    dataDBCart.xlarge = Qty
                }

                sql = `insert into cart set ?`

            } else {
                dataDBCart = {
                    total_price: cartResults[0].total_price + (Qty * cartResults[0].price)
                }

                if (stockSelected === 'small') {
                    dataDBCart.small = Qty + cartResults[0].small
                    
                }

                if (stockSelected === 'medium') {
                    dataDBCart.medium = Qty + cartResults[0].medium
                }

                if (stockSelected === 'large') {
                    dataDBCart.large = Qty + cartResults[0].large
                }

                if (stockSelected === 'xlarge') {
                    dataDBCart.xlarge = Qty + cartResults[0].xlarge
                }

                sql = `update cart set ? where productId = ${productId} and userId = ${req.user.userId} and is_deleted = 0 and move_to_transaction = 0`
                
            }

            mysql_conn.query(sql, dataDBCart, (err, results) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                sql = `select cart.*, p.name as productName, p.coverImage from cart join product as p on cart.productId = p.id where cart.userId = ${req.user.userId} and cart.is_deleted = 0 and cart.move_to_transaction = 0;`
                mysql_conn.query(sql, (err, cartUser) => {
                    if (err) {
                        return res.status(500).send({ status: 'error', err })
                    }

                    console.log(cartUser)

                    return res.status(200).send({
                        dataCart: cartUser,
                        cartCount: cartUser.length
                    })
                })
            })
        })
    },

    showCart: (req, res) => {
        let sql = `select cart.*, p.name as productName, p.coverImage from cart join product as p on cart.productId = p.id where cart.userId = ${req.user.userId} and cart.is_deleted = 0 and cart.move_to_transaction = 0;`
        mysql_conn.query(sql, (err, cartUser) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            console.log(cartUser)

            return res.status(200).send({
                dataCart: cartUser,
                cartCount: cartUser.length
            })
        })
    },

    deleteCart: (req, res) => {
        let sql = `update cart set is_deleted = 1 where userId = ${req.user.userId} and productId = ${req.params.id}`
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }
            console.log(results)

            sql = `select cart.*, p.name as productName, p.coverImage from cart join product as p on cart.productId = p.id where cart.userId = ${req.user.userId} and cart.is_deleted = 0 and cart.move_to_transaction = 0;`
            mysql_conn.query(sql, (err, cartUser) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                return res.status(200).send({
                    dataCart: cartUser,
                    cartCount: cartUser.length
                })
            })
        })
    }
}