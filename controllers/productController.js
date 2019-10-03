const mysql_conn = require('../database');

module.exports = {
    getAllProducts: (req, res) => {
        
        let offset = 0;
        // 2.2.2

        if(!req.query.page) {
            req.query.page = 1
        } 
        
        if(req.query.page > 1){
            // Menampilkan 4 data setiap halamannya.
            offset = (req.query.page - 1) * 4
        }

        let sql = `select 
                        p.id as productId,
                        p.name,
                        p.coverImage,
                        p.price,
                        p.popularCount,
                        c.name as category_product, 
                        subcat.name as sub_category 
                    from product as p 
                    join category as c on p.categoryId = c.id
                    join category as subcat on p.subcategoryId = subcat.id where p.is_deleted = 0
                    limit ${offset}, 4`

        mysql_conn.query(sql, (err, resultsProduct) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            if(resultsProduct.length === 0) {
                return res.status(500).json({ status: 'No Product available', message: 'There are no product in database' });
            }

            sql = `select count(*) as totalProduct from product where is_deleted = 0`;
            mysql_conn.query(sql, (err, totalProducts) => {
                if (err) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                }

                return res.status(200).send({
                    page: parseInt(req.query.page),
                    totalProduct: totalProducts[0].totalProduct,
                    total_pages: Math.ceil(totalProducts[0].totalProduct / 4),
                    dataProduct: resultsProduct
                })
            })
        })
    },

    getFilterProduct: (req, res) => {
        console.log(req.query)

        let offset = 0;

        if (!req.query.page) {
            req.query.page = 1
        }

        if (req.query.page > 1) {
            // munculin dari data ke berapa data di tampil.
            offset = (req.query.page - 1) * 4
        }

        let sql = `select 
                        p.id as productId,
                        p.name,
                        p.coverImage,
                        p.price,
                        p.popularCount,
                        c.name as category_product, 
                        subcat.name as sub_category 
                    from product as p 
                    join category as c on p.categoryId = c.id
                    join category as subcat on p.subcategoryId = subcat.id where p.is_deleted = 0`

        if (req.query.product) {
            sql += ` and c.name = '${req.query.product}'`
        }

        if (req.query.productName) {
            sql += ` and p.name like '${req.query.productName}%'`
        } 

        if (req.query.categoryId) {
            sql += ` and c.id = ${req.query.categoryId}`
        }

        if (req.query.subCategoryId) {
            sql += ` and subcat.id = ${req.query.subCategoryId}`
        }

        if (!req.query.showData) {
            req.query.showData = 4
        }

        sql += ` limit ${offset}, ${req.query.showData}`

        mysql_conn.query(sql, (err, firstResults) => {
            if (err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            if (firstResults.length === 0) {
                return res.status(500).json({ status: 'No Product available', message: 'There are no product in database' });
            }

            let category = 0

            if(req.query.categoryId) {
                category = req.query.categoryId
            } else {
                category = 9999
            }

            sql = `select name as categoryName from category where id = ${category}`

            mysql_conn.query(sql, (err, categoryName) => {
                if (err) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                }

                let subcategory = 0

                if (req.query.subCategoryId) {
                    subcategory = req.query.subCategoryId
                } else {
                    subcategory = 9999
                }

                sql = `select name as subCategoryName from category where id = ${subcategory}`

                mysql_conn.query(sql, (err, subCategoryName) => {
                    if (err) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                    }

                    return res.status(200).send({
                        page: parseInt(req.query.page),
                        totalProduct: parseInt(firstResults.length),
                        total_pages: Math.ceil(parseInt(firstResults.length) / 4),
                        categoryName: categoryName.length !== 0 ? categoryName[0].categoryName : null,
                        subCategoryName: subCategoryName.length !== 0 ? subCategoryName[0].subCategoryName : null,
                        dataProduct: firstResults
                    })
                })
            })
        })
    },

    getProductDetailById: (req, res) => {
        let sql = `select
            p.*, 
            stk.small, 
            stk.medium, 
            stk.large, 
            stk.xlarge,
            c.name as category_name, 
            subcat.id as id_sub_category,
            subcat.name as sub_category_name
        from product as p join category as c on p.categoryId = c.id 
        join category as subcat on p.subcategoryId = subcat.id join stockproduct as stk on stk.productId = p.id where p.is_deleted = 0 and p.id = ${req.params.id}`

        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }
            console.log(results)
            console.log(req.params.id)

            sql = `select imagePath from product_image where productId = ${req.params.id}`
            mysql_conn.query(sql, (err, linkImageProduct) => {
                if (err) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                }

                return res.status(200).send({
                    dataProductDetail: results,
                    linkImageProduct
                })
            })
        })
    },

    getAllProductUI: (req, res) => {
        
        let sql = `select 
                        p.id as productId,
                        p.name,
                        p.coverImage,
                        p.price,
                        p.popularCount,
                        c.name as category_product, 
                        subcat.name as sub_category 
                    from product as p 
                    join category as c on p.categoryId = c.id
                    join category as subcat on p.subcategoryId = subcat.id where p.is_deleted = 0 and p.popularCount >= 1 order by p.popularCount desc limit 0, ${req.query.limit}`

        mysql_conn.query(sql, (err, resultsProduct) => {
            if (err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            if (resultsProduct.length === 0) {
                return res.status(500).json({ status: 'No Product available', message: 'There are no product in database' });
            }

            return res.status(200).send({               
                dataProduct: resultsProduct
            })
        })
    },

    getCommentProduct: (req, res) => {
        let sql = `select c.id,
                        c.comment,
                        c.commentId,
                        c.date_created,
                        c.is_edited,
                        u.username,
                        u.UserImage,
                        u.role
                    from comment as c join users as u
                    on c.userId = u.id where c.productId = ${req.params.id} order by c.date_created desc`
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            sql = `select 
                    rc.comment, 
                    rc.commentId,
                    rc.date_created,
                    rc.is_edited,
                    u.username,
                    u.UserImage,
                    u.role
                    from comment as rc 
                    join comment as c on rc.commentId = c.id
                    join users as u on rc.userId = u.id where rc.productId = ${req.params.id} order by rc.date_created asc`
            
            mysql_conn.query(sql, (err, replyResults) => {
                if (err) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                }

                return res.status(200).send({
                    dataComment: results,
                    dataReply: replyResults
                })
            })
        })
    }

}