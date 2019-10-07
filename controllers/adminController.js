const mysql_conn = require('../database')
const Crypto = require('crypto');
const fs = require('fs');

const { uploader } = require('../helpers/uploader');
const { createJWTToken } = require('../helpers/jwtoken');
const transporter = require('../helpers/mailer');

module.exports = {
    adminRegister: (req, res) => {
        let {
            username,
            password,
            email,
            FirstName,
            LastName,
            address,
        } = req.body

        let sql = `SELECT * FROM users WHERE username='${username}'`
        mysql_conn.query(sql, (err, resultsUsername) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            sql = `SELECT * FROM users WHERE email='${email}'`
            mysql_conn.query(sql, (err, resultsEmail) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                if (resultsUsername.length > 0 && resultsEmail.length > 0) {
                    return res.status(500).send({ status: 'error', message: 'Username & Email been taken by another user!. Try another Username & Email' });
                }

                if (resultsUsername.length > 0) {
                    return res.status(500).send({ status: 'error', message: 'Username has been taken by another user!. Try another username' });
                }

                if (resultsEmail.length > 0) {
                    return res.status(500).send({ status: 'error', message: 'Email has been used by another user!. Try another Email' });
                }

                let hashPassword = Crypto.createHmac('sha256', 'macommerce_api_admin')
                    .update(password).digest('hex');


                // Upload User Data

                let dataUser = {
                    username,
                    password: hashPassword,
                    email,
                    FirstName,
                    LastName,
                    address,
                    status: 'Unverified',
                    LastLogin: new Date(),
                    role: 'Admin'
                }

                sql = 'INSERT INTO users SET ?';
                mysql_conn.query(sql, dataUser, (err, results) => {
                    if (err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }

                    sql = `select * from users where username='${username}'`
                    mysql_conn.query(sql, (err, results) => {
                        if (err) {
                            return res.status(500).send({ status: 'error', err })
                        }

                        const tokenJwt = createJWTToken({ userId: results[0].id, username: results[0].username })

                        let linkVerifikasi = `http://localhost:3000/adminVerified/${tokenJwt}`;
                        let mailOptions = {
                            from: 'MaCommerce Admin <rezardiansyah1997@gmail.com>',
                            to: email,
                            subject: 'Verifikasi Admin Account for MaCommerce Admin',
                            html: `
                                        <div>
                                            <img src='https://i.ibb.co/L8SgW3n/logo-Macommerce.png' /><span>Online Shop ter-update dalam fashion</span>
                                            <hr />
                                            <h4>Link Verification</h4>
                                            <p>This is a link verification for admin account with name: <span style='font-weight:bold'>${results[0].username}</span>.</p>
                                            <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                                            <hr />
                                        </div>`
                        }

                        transporter.sendMail(mailOptions, (err1, res1) => {
                            if (err1) {
                                return res.status(500).send({ status: 'error', err: err1 })
                            }

                            return res.status(200).send({
                                FirstName: results[0].FirstName,
                                LastName: results[0].LastName,
                                username: results[0].username,
                                email: results[0].email,
                                token: tokenJwt,
                                status: results[0].status,
                                role: results[0].role
                            });

                        })
                    })
                })
            })
        }) 
    },

    resendAdminEmailVerification: (req, res) => {
        let { username, email} = req.body;

        let sql = `Select id, username, email, status From users where username='${username}' and email='${email}'`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if (results.length === 0) {
                return res.status(500).send({ status: 'error', err: 'User Not Found!' })
            }

            const tokenJwt = createJWTToken({ userId: results[0].id, username: results[0].username })

            let linkVerifikasi = `http://localhost:3000/adminVerified/${tokenJwt}`;
            let mailOptions = {
                from: 'MaCommerce Admin <rezardiansyah1997@gmail.com>',
                to: email,
                subject: 'Verifikasi Admin Account for MaCommerce Admin',
                html: `
                    <div>
                        <img src='https://i.ibb.co/L8SgW3n/logo-Macommerce.png' /><span>Online Shop ter-update dalam fashion</span>
                        <hr />
                        <h4>Link Verification</h4>
                        <p>This is a link verification for admin account with name: <span style='font-weight:bold'>${results[0].username}</span>.</p>
                        <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                        <hr />
                    </div>`
            }

            transporter.sendMail(mailOptions, (err1, res1) => {
                if (err1) {
                    return res.status(500).send({ status: 'error', err: err1 })
                }

                return res.status(200).send({
                    FirstName: results[0].FirstName,
                    LastName: results[0].LastName,
                    username: results[0].username,
                    email: results[0].email,
                    token: tokenJwt,
                    status: results[0].status,
                    role: results[0].role
                });

            })
        })
    },

    adminLogin: (req, res) => {
        let { username, password } = req.body;
        let hashPassword = Crypto.createHmac('sha256', 'macommerce_api_admin')
            .update(password).digest('hex');

        let sql = `Select * from users where username='${username}' and password='${hashPassword}' and role='Admin'`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if (results.length === 0) {
                return res.status(500).send({ status: 'error', message: 'Username or Password is wrong.!' });
            }

            if (results.length === 0) {
                return res.status(500).send({ status: 'error', err: 'User Not Found!' })
            }
            
            const tokenJwt = createJWTToken({ userId: results[0].id, username: results[0].username })

            return res.status(200).send({
                FirstName: results[0].FirstName,
                LastName: results[0].LastName,
                username: results[0].username,
                email: results[0].email,
                token: tokenJwt,
                status: results[0].status,
                UserImage: results[0].UserImage,
                role: results[0].role
            });
        })
    },

    emailAdminVerification: (req, res) => {

        let sql = `select * from users where id = ${req.user.userId} and username = '${req.user.username}'`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if (results.length === 0) {
                return res.status(500).send({ status: 'error', message: 'User not found' });
            }

            sql = `Update users Set status='Verified' where id = ${req.user.userId}`
            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                sql = `select * from users where id = ${req.user.userId}`
                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        return res.status(500).send({ status: 'error', err })
                    }

                    const tokenJwt = createJWTToken({ userId: results[0].id, username: results[0].username })

                    return res.status(200).send({
                        FirstName: results[0].FirstName,
                        LastName: results[0].LastName,
                        username: results[0].username,
                        email: results[0].email,
                        token: tokenJwt,
                        status: results[0].status,
                        UserImage: results[0].UserImage,
                        role: results[0].role
                    });
                })
            })
          
        })
    },

    getCategory: (req, res) => {
        let sql = `select id, name, categoryImage from category where parentId IS NULL;`
        
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            return res.status(200).send(results)
        })
    },

    addCategory: (req, res) => {
        try {

            let path = `/category`; //file save path
            const upload = uploader(path, 'MaCommerce').fields([{ name: 'categoryImage' }]); //uploader(path, 'default prefix')

            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err });
                }

                console.log(req.body.dataCategory)
                const dataCategory = JSON.parse(req.body.dataCategory);

                let {
                    categoryName,
                } = dataCategory

                const { categoryImage } = req.files;
                const imagePath = categoryImage ? path + '/' + categoryImage[0].filename : '/defaultPhoto/defaultCategory.png';

                dataCategory.categoryImage = imagePath

                let sql = `select * from category where name = '${categoryName}'`
                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).send({ status: 'error', err })
                    }

                    if (results.length !== 0) {
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).send({ status: 'Duplicate Data', message: `Category dengan name '${categoryName}' sudah ada` })
                    }

                    let sql = `insert into category values(null, '${categoryName}', null, '${imagePath}')`;
                    mysql_conn.query(sql, (err, results) => {
                        if (err) {
                            fs.unlinkSync('./public' + imagePath);
                            return res.status(500).send({ status: 'error', message: err })
                        }

                        sql = `select id, name, categoryImage from category where parentId IS NULL`;
                        mysql_conn.query(sql, (err, results) => {
                            if (err) {
                                fs.unlinkSync('./public' + imagePath);
                                return res.status(500).send({ status: 'error', message: err })
                            }

                            console.log(results)
                            return res.status(200).send({ categoryParent: results })
                        })
                    })
                })
            })
        } catch (err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err});
        }
    },

    addSubCategory: (req, res) => {
        let { parentCategoryId, subCategoryName } = req.body
        console.log(req.body)
        let sql = `select * from category where name = '${subCategoryName}' and parentId = ${parentCategoryId}`
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if (results.length !== 0) {
                return res.status(500).send({ status: 'ERROR INPUT', message: `Nama '${subCategoryName}' sudah ada` })
            }

            sql = `select * from category where id = ${parentCategoryId}`
            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                if (results.length === 0) {
                    return res.status(500).send({ status: 'ERROR INPUT', message: `Category harus dipilih terlebih dahulu` })
                }

                let sql = `insert into category values(null, '${subCategoryName}', ${results[0].id}, null)`;
                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        return res.status(500).send({ status: 'error', err })
                    }
                    
                    sql = `select 
                            c.id as parentId, 
                            c2.id as idsubcategory, 
                            c2.name as subcategory 
                            from category as c join category as c2 on c2.parentId = ${parentCategoryId}`;

                    mysql_conn.query(sql, (err, results) => {
                        if (err) {
                            return res.status(500).send({ status: 'error', err })
                        }

                        return res.status(200).send({ subCategory: results})
                    })
                })
            })
        })
    },

    editCategory: (req, res) => {
        let categoryId = req.params.id;
        let sql = `select * from category where id = ${categoryId}`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            if(results.length > 0) {
                let path = `/category`; //file save path
                const upload = uploader(path, 'MaCommerce').fields([{ name: 'categoryImage' }]); //uploader(path, 'default prefix')

                upload(req, res, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Upload post picture failed !', error: err });
                    }

                    const dataCategory = JSON.parse(req.body.dataCategory);

                    if(dataCategory.categoryName === '') {
                        dataCategory.categoryName = results[0].name
                    }

                    let dataEdit = {
                        name: dataCategory.categoryName,
                    }
                    
                    const categoryId = dataCategory.categoryId
                    delete dataCategory.categoryId

                    const { categoryImage } = req.files;
                    const imagePath = categoryImage ? path + '/' + categoryImage[0].filename : results[0].categoryImage;

                    try {
                        if(imagePath) {
                            dataEdit.categoryImage = imagePath
                        }

                        sql = `update category set ? where id=${categoryId}`
                        mysql_conn.query(sql, dataEdit, (err, results1) => {
                            if (err) {
                                if (imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }

                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                            }

                            if (imagePath !== results[0].categoryImage) {
                                if (imagePath) {
                                    fs.unlinkSync('./public' + results[0].categoryImage);
                                }
                            }

                            sql = `select id, name, categoryImage from category where parentId IS NULL`
                            mysql_conn.query(sql, (err, lastResults) => {
                                if (err) {
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err});
                                }

                                return res.status(200).send({categoryParent: lastResults})

                            })
                        })
                    }
                    catch {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                    }
                })
            }
        })
    },

    editSubCategory: (req, res) => {
        let { subCategoryName, parentCategoryId} = req.body
        let sql = `select * from category where id = ${req.params.id}`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ message: `There's an error on the server. Please contact the administrator.`, error: err });
            }

            if (results.length === 0) {
                return res.status(500).send({ status: 'error', message: 'Sub Category Not Found' });
            }

            if(subCategoryName === '') {
                subCategoryName = results[0].name
            }

            sql = `update category set name = '${subCategoryName}' where id = ${results[0].id}`
            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send({ message: `There's an error on the server. Please contact the administrator.`, error: err });
                }

                sql = `select 
                            c.id as parentId, 
                            c2.id as idsubcategory, 
                            c2.name as subcategory 
                            from category as c join category as c2 on c2.parentId = ${parentCategoryId}`

                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        return res.status(500).send({ message: `There's an error on the server. Please contact the administrator.`, error: err });
                    }

                    return res.status(200).send({ subCategory: results })
                })
            })
        })
    },

    deleteCategory: (req, res) => {
        let sql = `select * from category where name='${req.params.categoryName}'`;
        mysql_conn.query(sql, (err, firstResults) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            if(firstResults.length > 0) {
                sql = `delete from category where name='${req.params.categoryName}'`
                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                    }

                    fs.unlinkSync('./public' + firstResults[0].categoryImage);

                    sql = `update product set is_deleted = 1 where categoryId = ${firstResults[0].id}`
                    mysql_conn.query(sql, (err, deleteResults) => {
                        if (err) {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                        }

                        sql = `select id, name, categoryImage from category where parentId IS NULL`
                        mysql_conn.query(sql, (err, results) => {
                            if (err) {
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                            }

                            return res.status(200).send({ categoryParent: results })
                        })
                    })
                })
            }
        })
    },

    deleteSubCategory: (req, res) => {
        let sql = `select * from category where name='${req.params.subCategory}'`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            let parentId = results[0].parentId;
            sql = `delete from category where name='${req.params.subCategory}'`;
            mysql_conn.query(sql, (err, deleteResults) => {
                if (err) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                }

                sql = `update product set is_deleted = 1 where subcategoryId = ${results[0].id}`
                mysql_conn.query(sql, (err, updateResult) => {
                    if (err) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                    }

                    sql = `select 
                            c.id as parentId, 
                            c2.id as idsubcategory, 
                            c2.name as subcategory 
                            from category as c join category as c2 on c2.parentId = ${parentId}`;
                    mysql_conn.query(sql, (err, results) => {
                        if (err) {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                        }

                        return res.status(200).send({ subCategory: results })
                    })
                })
            })
        })
    },


    addProduct: (req, res) => {
        // append with same key and looping ter upload process (?)
        try {

            let path = `/product`; //file save path
            const upload = uploader(path, 'MaCommerceProduct').fields([{ name: 'productImage' }]); //uploader(path, 'default prefix')

            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err });
                }

                console.log(req.body.dataProduct)
                const dataProduct = JSON.parse(req.body.dataProduct);

                let {
                    productName,
                    productCategory,
                    productSubCategory,
                    productPrice,
                    sizeS,
                    sizeM,
                    sizeL,
                    sizeXL,
                    productDescription,
                    categoryName, 
                    subCategoryName
                } = dataProduct

                //console.log(dataProduct)
                const { productImage } = req.files;
                // console.log(req.files)
               
                //console.log(productImage)
                //console.log(productImage.length)

                
                let sql = `select * from product where name='${productName}' and categoryId=${productCategory} and subcategoryId = ${productSubCategory}`;
                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        for (let i = 0; i <= productImage.length - 1; i++) {
                            fs.unlinkSync('./public' + path + '/' + productImage[i].filename);
                        }
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                    }

                    if(results.length > 0) {
                        for (let i = 0; i <= productImage.length - 1; i++) {
                            fs.unlinkSync('./public' + path + '/' + productImage[i].filename);
                        }
                        return res.status(500).send({ 
                            status: 'Duplicate Data', 
                            message: `Product dengan nama '${productName}' yang memiliki Category = '${categoryName}' dan Sub Category = ${subCategoryName} telah ada di database` })
                    }

                   
                    let arrayProductImage = []
                    
                    for (let i = 1; i <= productImage.length - 1; i++) {
                        if (productImage[i]) {
                            arrayProductImage.push(path + '/' + productImage[i].filename)
                        } else {
                            arrayProductImage.push('/defaultPhoto/defaultCategory.png')
                        }
                    }

                    let dataDBProduct = {
                        name: productName,
                        categoryId: productCategory,
                        subcategoryId: productSubCategory,
                        price: productPrice,
                        description: productDescription,
                        coverImage: path + '/' + productImage[0].filename,
                        popularCount: 0,
                        date_created: new Date(),
                        is_deleted: 0
                    }

                    sql = `insert into product set ?`
                    mysql_conn.query(sql, dataDBProduct, (err, results) => {
                        if (err) {
                            fs.unlinkSync('./public' + productImage[0].filename);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                        }

                        sql = `select id from product where coverImage = '${path + '/' + productImage[0].filename}'`;
                        mysql_conn.query(sql, (err, results) => {
                            if (err) {
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                            }

                            let values = []

                            for (let i = 0; i <= arrayProductImage.length - 1; i++) {
                                values.push([arrayProductImage[i], results[0].id])
                            }

                            sql = `insert into product_image (imagePath, productId) values ?`
                            mysql_conn.query(sql, [values], (err, results1) => {
                                if (err) {

                                    for (let i = 0; i <= arrayProductImage.length - 1; i++) {
                                        fs.unlinkSync('./public' + arrayProductImage[0]);
                                    }

                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                                }

                                let dataStockProduct = {
                                    small: sizeS,
                                    medium: sizeM,
                                    large: sizeL,
                                    xlarge: sizeXL,
                                    productId: results[0].id
                                }
                                sql = `insert into stockproduct set ?`
                                mysql_conn.query(sql, dataStockProduct, (err, results) => {
                                    if (err) {
                                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                                    }

                                    return res.status(200).send({ success: 'Product telah ditambahkan' })
                                })
                            })
                        })
                    })
                })
            })
        } catch (err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
        }
    },

    editProduct: (req, res) => {
        try {

            let path = `/product`; //file save path
            const upload = uploader(path, 'MaCommerceProduct').fields([{ name: 'productImage' }]); //uploader(path, 'default prefix')

            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err });
                }

                console.log(req.body.dataProduct)
                const dataProduct = JSON.parse(req.body.dataProduct);

                let {
                    productName,
                    productCategory,
                    productSubCategory,
                    productPrice,
                    sizeS,
                    sizeM,
                    sizeL,
                    sizeXL,
                    productDescription,
                    popularCount,
                    productCoverImageDB,
                    productImage1DB,
                    productImage2DB,
                } = dataProduct

                //console.log(dataProduct)
                const { productImage } = req.files;

                // Kalo productImage bukan berbentuk object File, maka akan di bilang undefined

                console.log(productImage)
                console.log(productCoverImageDB);
                console.log(productImage1DB);
                console.log(productImage2DB);

                console.log(typeof (productCoverImageDB) === 'string')
                console.log(typeof (productImage1DB) === 'object')

                let arrayProductImage = []
                let index = 0;
                //console.log(req.files)

                let sql = `select * from product where name='${productName}' and categoryId=${productCategory} and subcategoryId = ${productSubCategory}`;
                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        if(productImage) {
                            for (let i = 0; i <= productImage.length - 1; i++) {
                                fs.unlinkSync('./public' + path + '/' + productImage[i].filename);
                            }
                        }

                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                    }

                    // if(results.length > 0) {
                    //     if (productImage) {
                    //         for (let i = 0; i <= productImage.length - 1; i++) {
                    //             fs.unlinkSync('./public' + path + '/' + productImage[i].filename);
                    //         }
                    //     }

                    //     return res.status(500).send({
                    //         status: 'Duplicate Data',
                    //         message: `Product dengan nama '${productName}' dengan Category dan Sub Category telah terdaftar di database`
                    //     })
                    // }

                    sql = `select * from product where id = ${req.params.id}`;
                    mysql_conn.query(sql, (err, hasilProductQuery) => {
                        if (err) {
                            if (productImage) {
                                for (let i = 0; 0 <= productImage.length - 1; i++) {
                                    fs.unlinkSync('./public' + path + '/' + productImage[i].filename);
                                }
                            }

                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                        }

                        if (hasilProductQuery.length > 0) {
                            let dataDBProduct = {
                                name: productName,
                                categoryId: productCategory,
                                subcategoryId: productSubCategory,
                                price: productPrice,
                                description: productDescription,
                                popularCount: popularCount,
                                date_created: new Date(),
                                is_deleted: 0
                            }

                            if(productImage) {
                                if (typeof (productCoverImageDB) === 'string') {
                                    dataDBProduct.coverImage = hasilProductQuery[0].coverImage
                                } else {
                                    dataDBProduct.coverImage = path + ' /' + productImage[0].filename
                                }
                            
                            } else if(!productCoverImageDB) {
                                // Kalo Cover Product Kosong
                                dataDBProduct.coverImage = '/defaultPhoto/defaultCategory.png'
                            }

                            

                            sql = `update product set ? where id = ${req.params.id}`

                            mysql_conn.query(sql, dataDBProduct, (err, resultsUpdate) => {
                                if (err) {
                                    if (productImage) {
                                        for (let i = 1; 0 <= productImage.length - 1; i++) {
                                            fs.unlinkSync('./public' + path + '/' + productImage[i].filename);
                                        }
                                    }

                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                                }

                                sql = `select * from product_image where productId = ${req.params.id}`
                                mysql_conn.query(sql, (err, hasilProductImage) => {
                                    if (err) {
                                        if (productImage) {
                                            for (let i = 0; 0 <= productImage.length - 1; i++) {
                                                fs.unlinkSync('./public' + path + '/' + productImage[i].filename);
                                            }
                                        }

                                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                                    }

                                    // hapus cover Image
                                    if (typeof (productCoverImageDB) === 'object' || !productCoverImageDB) {
                                        fs.unlinkSync('./public' + hasilProductQuery[0].coverImage);
                                    }

                                    if (productImage) {
                                        if (typeof (productCoverImageDB) === 'object') {
                                            index = 1
                                        } else {
                                            index = 0
                                        }

                                        console.log(productImage1DB.filename)
                                        console.log(productImage2DB.filename)


                                        if (typeof (productImage1DB) === 'string') {
                                            arrayProductImage.push(productImage1DB)
                                        } else {
                                            fs.unlinkSync('./public' + hasilProductImage[0].imagePath);
                                        }

                                        if (typeof (productImage2DB) === 'string') {
                                            arrayProductImage.push(productImage2DB)
                                        } else {
                                            fs.unlinkSync('./public' + hasilProductImage[1].imagePath);
                                        }

                                        if (typeof (productImage1DB) !== 'string' || typeof (productImage2DB) !== 'string') {
                                            for (; index <= productImage.length - 1; index++) {
                                                if (productImage[index]) {
                                                    arrayProductImage.push(path + '/' + productImage[index].filename)
                                                }
                                            }
                                        }

                                    } else {
                                        // Kalo product Image Kosong
                                        if (typeof (productImage1DB) === 'string' || typeof (productImage2DB) === 'string') {
                                            if (productImage1DB) {
                                                arrayProductImage.push(productImage1DB)
                                            } else {
                                                productImage1DB = '/defaultPhoto/defaultCategory.png'
                                                arrayProductImage.push(productImage1DB)
                                                fs.unlinkSync('./public' + hasilProductImage[0].imagePath);
                                            }

                                            if (productImage2DB) {
                                                arrayProductImage.push(productImage2DB)
                                            } else {
                                                productImage2DB = '/defaultPhoto/defaultCategory.png'
                                                arrayProductImage.push(productImage2DB)
                                                fs.unlinkSync('./public' + hasilProductImage[1].imagePath);
                                            }
                                        }
                                    }


                                    sql = ''
                                    for (let i = 0; i <= arrayProductImage.length - 1; i++) {
                                        console.log(arrayProductImage[i])
                                        sql += `update product_image set imagePath = '${arrayProductImage[i]}' where productId = ${req.params.id};`
                                    }

                                    mysql_conn.query(sql, (err, resultsProductImage) => {
                                        if (err) {
                                            if (productImage) {
                                                for (let i = 1; i <= productImage.length - 1; i++) {
                                                    fs.unlinkSync('./public' + path + '/' + productImage[i].filename);
                                                }
                                            }

                                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                                        }

                                        let dataStockProduct = {
                                            small: sizeS,
                                            medium: sizeM,
                                            large: sizeL,
                                            xlarge: sizeXL,
                                            productId: req.params.id
                                        }

                                        sql = `update stockproduct set ? where productId = ${req.params.id}`
                                        mysql_conn.query(sql, dataStockProduct, (err, results) => {
                                            if (err) {

                                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
                                            }

                                            return res.status(200).send({ success: 'Product telah diupdate' })
                                        })
                                    })
                                })
                            })
                        }
                    })
                })
            })
        } catch (err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
        }
    }, 

    deteleProduct: (req, res) => {
        let sql = `update product set is_deleted = 1 where id = ${req.params.id}`
        mysql_conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err });
            }

            console.log(results)

            return res.status(200).send({success: 'Product berhasil didelete'})
        })
    }
}