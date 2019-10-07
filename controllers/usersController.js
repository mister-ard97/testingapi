const mysql_conn = require('../database')
const Crypto = require('crypto');
const fs = require('fs');

const { uploader } = require('../helpers/uploader');
const { createJWTToken, createForgotPasswordToken } = require('../helpers/jwtoken');

const transporter = require('../helpers/mailer');

module.exports = {
    register: (req, res) => {
        try {

            let path = `/users/images`; //file save path
            const upload = uploader(path, 'MaCommerce').fields([{ name: 'imageUser' }]); //uploader(path, 'default prefix')

            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }

                console.log(req.body.data)
                const data = JSON.parse(req.body.data);

                let {
                    password,
                    email,
                    name,
                } = data

                let sql = `SELECT * FROM users WHERE email='${email}'`
                mysql_conn.query(sql, (err, resultsEmail) => {
                    if (err) {
                        return res.status(500).send({ status: 'error', err })
                    }

                    /* if (resultsUsername.length > 0 && resultsEmail.length > 0) {
                        return res.status(500).send({ status: 'error', message: 'Username & Email been taken by another user!. Try another Username & Email' });
                    }

                    if (resultsUsername.length > 0) {
                        return res.status(500).send({ status: 'error', message: 'Username has been taken by another user!. Try another username' });
                    } */

                    if (resultsEmail.length > 0) {
                        return res.status(500).send({ status: 'error', message: 'Email has been registered. Try another Email' });
                    }

                    let hashPassword = Crypto.createHmac('sha256', 'macommerce_api')
                        .update(password).digest('hex');


                    // Upload User Data

                    let dataUser = {
                        password: hashPassword,
                        email,
                        name,
                        status: 'Unverified',
                        LastLogin: new Date(),
                        role: 'User'
                    }

                    const { imageUser } = req.files;
                    console.log(imageUser)
                    const imagePath = imageUser ? path + '/' + imageUser[0].filename : '/defaultPhoto/defaultUser.png';
                    console.log(imagePath)

                    console.log(data)
                    dataUser.UserImage = imagePath;

                    sql = 'INSERT INTO users SET ?';
                    mysql_conn.query(sql, dataUser, (err, results) => {
                        if (err) {
                            console.log(err.message)
                            fs.unlinkSync('./public' + imagePath);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }

                        sql = `select * from users where email='${email}' and role='User' and googleId IS NULL`
                        mysql_conn.query(sql, (err, results) => {
                            if (err) {
                                return res.status(500).send({ status: 'error', err })
                            }

                            const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })

                            let linkVerifikasi = `http://localhost:3000/verified/${tokenJwt}`;
                            //untuk live
                            //let linkVerifikasi = `https://testingui4.herokuapp.com/verified/${tokenJwt}`
                           
                            let mailOptions = {
                                from: 'TestingUi Admin <rezardiansyah1997@gmail.com>',
                                to: email,
                                subject: 'Verifikasi Email for TestingUi',
                                html: `
                                        <div>
                                            <img src='https://i.ibb.co/L8SgW3n/logo-Macommerce.png' /><span>Online Shop ter-update dalam fashion</span>
                                            <hr />
                                            <h4>Link Verification</h4>
                                            <p>This is a link verification for Email: <span style='font-weight:bold'>${results[0].email}</span>.</p>
                                            <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                                            <hr />
                                        </div>`
                            }

                            transporter.sendMail(mailOptions, (err1, res1) => {
                                if (err1) {
                                    return res.status(500).send({ status: 'error', err: err1 })
                                }

                                return res.status(200).send({
                                    name: results[0].name,
                                    email: results[0].email,
                                    token: tokenJwt,
                                    status: results[0].status,
                                    UserImage: results[0].UserImage,
                                    role: results[0].role
                                });

                            })
                        })
                    })
                })   
            })
        } catch (err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    }, 

    userLoginWithGoogle: (req, res) => {
        let sql = `select * from users where email = '${req.body.data.email}'`
        mysql_conn.query(sql, (err, resultsEmail) => {
            if(err) {
                return res.status(500).send({ status: 'error', err })
            }

            let encryptGoogleId = Crypto.createHmac('sha256', 'macommerce_api')
                .update(req.body.data.googleId).digest('hex')

            let sql = `select * from users where googleId = '${encryptGoogleId}'`

            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                if (results.length === 0) {
                    // Apabila belum pernah login menggunakan gmail
                    sql = `insert into users set ?`

                    req.body.data.googleId = encryptGoogleId
                    req.body.data.role = 'User'
                    req.body.data.status = 'Unverified'
                    req.body.data.UserImage = '/defaultPhoto/defaultUser.png'
                    req.body.data.LastLogin = new Date();

                    mysql_conn.query(sql, req.body.data, (err, results1) => {
                        if (err) {
                            return res.status(500).send({ status: 'error', err })
                        }

                        sql = `select * from users where id = ${results1.insertId}`
                        mysql_conn.query(sql, (err, results) => {
                            if (err) {
                                return res.status(500).send({ status: 'error', err })
                            }

                            const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })

                            return res.status(200).send({
                                name: results[0].name,
                                email: results[0].email,
                                token: tokenJwt,
                                status: results[0].status,
                                UserImage: results[0].UserImage,
                                role: results[0].role
                            });
                        })
                    })

                } else {

                    // Apabila telah login menggunakan google, maka data tidak akan di insert lagi
                    sql = `select * from users where googleId = '${encryptGoogleId}'`
                    mysql_conn.query(sql, (err, results) => {
                        if (err) {
                            return res.status(500).send({ status: 'error', err })
                        }

                        const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })

                        return res.status(200).send({
                            name: results[0].name,
                            email: results[0].email,
                            token: tokenJwt,
                            status: results[0].status,
                            UserImage: results[0].UserImage,
                            role: results[0].role,
                            address: results[0].address
                        });
                    })
                }
            })
        })
    },

    userLoginWithFacebook: (req, res) => {
        let sql = `select * from users where email = '${req.body.data.email}'`
        mysql_conn.query(sql, (err, resultsEmail) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            let encryptFacebookId = Crypto.createHmac('sha256', 'macommerce_api')
                .update(req.body.data.facebookId).digest('hex')

            let sql = `select * from users where facebookId = '${encryptFacebookId}'`

            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                if (results.length === 0) {
                    // Apabila belum pernah login menggunakan facebook
                    sql = `insert into users set ?`

                    req.body.data.facebookId = encryptFacebookId
                    req.body.data.role = 'User'
                    req.body.data.status = 'Unverified'
                    req.body.data.UserImage = '/defaultPhoto/defaultUser.png'
                    req.body.data.LastLogin = new Date();

                    mysql_conn.query(sql, req.body.data, (err, results1) => {
                        if (err) {
                            return res.status(500).send({ status: 'error', err })
                        }

                        sql = `select * from users where id = ${results1.insertId}`
                        mysql_conn.query(sql, (err, results) => {
                            if (err) {
                                return res.status(500).send({ status: 'error', err })
                            }

                            const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })

                            return res.status(200).send({
                                name: results[0].name,
                                email: results[0].email,
                                token: tokenJwt,
                                status: results[0].status,
                                UserImage: results[0].UserImage,
                                role: results[0].role
                            });
                        })
                    })

                } else {

                    // Apabila telah login menggunakan facebook, maka data tidak akan di insert lagi
                    sql = `select * from users where facebookId = '${encryptFacebookId}'`
                    mysql_conn.query(sql, (err, results) => {
                        if (err) {
                            return res.status(500).send({ status: 'error', err })
                        }

                        const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })

                        return res.status(200).send({
                            name: results[0].name,
                            email: results[0].email,
                            token: tokenJwt,
                            status: results[0].status,
                            UserImage: results[0].UserImage,
                            role: results[0].role,
                        });
                    })
                }
            })
        })
    },

    emailVerification: (req, res) => {
        let sql = `select * from users where id = ${req.user.userId} and role='User'`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if(results.length === 0) {
                return res.status(500).send({ status: 'error', message: 'User not found' });
            }

            const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })

            sql = `Update users Set status='Verified' where id = ${req.user.userId}`
            mysql_conn.query(sql, (err, results1) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                sql = `Select * From users where id=${req.user.userId}`;

                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        return res.status(500).send({ status: 'error', err })
                    }

                    return res.status(200).send({
                        name: results[0].name,
                        email: results[0].email,
                        token: tokenJwt,
                        status: results[0].status,
                        UserImage: results[0].UserImage,
                        role: results[0].role,
                    });
                })
            })
        })
    },

    resendEmailVerification: (req, res) => {
        let { email } = req.body;

        let sql = `Select id, email, status From users where email='${email}'`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }
            
            if (results.length === 0) {
                return res.status(500).send({ status: 'error', err: 'User Not Found!' })
            }

            const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })

            let linkVerifikasi = `http://localhost:3000/verified/${tokenJwt}`;
            
            //untuk live
            //let linkVerifikasi = `https://testingui4.herokuapp.com/verified/${tokenJwt}`

            let mailOptions = {
                from: 'TestingUi Admin <rezardiansyah1997@gmail.com>',
                to: email,
                subject: 'Verifikasi Email for TestingUi',
                html: `
                                    <div>
                                        <img src='https://i.ibb.co/L8SgW3n/logo-Macommerce.png' /><span>Online Shop ter-update dalam fashion</span>
                                        <hr />
                                        <h4>Link Verification</h4>
                                        <p>This is a link verification for Email: <span style='font-weight:bold'>${results[0].email}</span>.</p>
                                        <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                                        <hr />
                                    </div>`
            }

            transporter.sendMail(mailOptions, (err1, res1) => {
                if (err1) {
                    return res.status(500).send({ status: 'error', err: err1 })
                }

                return res.status(200).send({
                    name: results[0].name,
                    email: results[0].email,
                    token: tokenJwt,
                    status: results[0].status,
                    UserImage: results[0].UserImage,
                    role: results[0].role,
                });
            })
        })
    },

    keepLoginUser: (req, res) => {
        let sql = `select * from users where id = ${req.user.userId} and email = '${req.user.email}'`;
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if (results.length === 0) {
                return res.status(500).send({ status: 'error', err: 'User Not Found!' })
            }

            const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })
            
            return res.status(200).send({
                name: results[0].name,
                email: results[0].email,
                token: tokenJwt,
                status: results[0].status,
                UserImage: results[0].UserImage,
                role: results[0].role,
            });  
        })
    },

    userLogin: (req, res) => {
        let { email, password} = req.body;
        let hashPassword = Crypto.createHmac('sha256', 'macommerce_api')
            .update(password).digest('hex');
        
        let sql = `Select * from users where email = '${email}'`
        mysql_conn.query(sql, (err, resultsEmail) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if (resultsEmail.length === 0) {
                return res.status(500).send({ status: 'error', message: 'Email belum terdaftar di webiste kami.' });
            }

            let sql = `Select * from users where email='${email}' and password='${hashPassword}' and role='User'`;
            mysql_conn.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                if (results.length === 0) {
                    return res.status(500).send({ status: 'error', message: 'Email or Password is wrong.!' });
                }

                const tokenJwt = createJWTToken({ userId: results[0].id, email: results[0].email })

                sql = `Select * From users where email='${email}' and role='User'`;

                mysql_conn.query(sql, (err, results) => {
                    if (err) {
                        return res.status(500).send({ status: 'error', err })
                    }

                    if (results.length === 0) {
                        return res.status(500).send({ status: 'error', err: 'User Not Found!' })
                    }

                    return res.status(200).send({
                        name: results[0].name,
                        email: results[0].email,
                        token: tokenJwt,
                        status: results[0].status,
                        UserImage: results[0].UserImage,
                        role: results[0].role,
                    });
                })
            })
        })
    },

    userForgotPassword: (req, res) => {
        let sql = `select * from users where email = '${req.body.email}'`
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if (results.length === 0) {
                return res.status(500).send({ status: 'notFoundEmail', message: 'Email belum terdaftar, harap Register terlebih dahulu' })
            }
            if (results[0].googleId && !results[0].password) {
                return res.status(500).send({ status: 'gmailTrue', message: `Silahkan Login with Gmail dengan Email = ${req.body.email}` })
            }

            if (results[0].facebookId && !results[0].password) {
                return res.status(500).send({ status: 'facebookTrue', message: `Silahkan Login with Facebook dengan Email = ${req.body.email}` })
            }

            const tokenPassword = createForgotPasswordToken({ userId: results[0].id, email: results[0].email })

            let linkVerifikasi = `http://localhost:3000/verifiedReset?token=${tokenPassword}`;
            //untuk live
            //let linkVerifikasi = `https://testingui4.herokuapp.com/verifiedReset?token=${tokenPassword}`

            let mailOptions = {
                from: 'TestingUi Admin <rezardiansyah1997@gmail.com>',
                to: req.body.email,
                subject: `Reset Password for ${req.body.email}`,
                html: `
                    <div>
                        <img src='https://i.ibb.co/L8SgW3n/logo-Macommerce.png' /><span>Berbagi itu hal yang sangat indah</span>
                        <hr />
                        <h4>Reset Password</h4>
                        <p>This is a link reset password for Email: <span style='font-weight:bold'>${req.body.email}</span>.</p>
                        <p>This link will expire in 5 minutes</p>
                        <p>To reset your account password <a href='${linkVerifikasi}'>Click Here!</a></p>
                        <hr />
                    </div>`
            }

            transporter.sendMail(mailOptions, (err1, res1) => {
                if (err1) {
                    return res.status(500).send({ status: 'error', err: err1 })
                }

                return res.status(200).send({
                    token: tokenPassword
                });

            })
        })
    },

    userResetPassword: (req, res) => {

        let hashPassword = Crypto.createHmac('sha256', 'macommerce_api')
            .update(req.body.data.password).digest('hex');
        let sql = `update users set password = '${hashPassword}' where email = '${req.body.data.email}'`
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            return res.status(200).send(results)
        })
    },

    userGetWishlist: (req, res) => {
        let sql = `select 
        p.coverImage, 
        p.name as productName, 
        p.id as productId,
        p.price
        from wishlist as w join product as p on w.productId = p.id where w.userId = ${req.user.userId} and p.is_deleted = 0`
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            return res.status(200).send({ allWishlistUser: results })
        })
    },

    userWishlistProduct : (req, res) => {
        let sql = `select * from wishlist where productId = ${req.params.id} and userId = ${req.user.userId}`
        mysql_conn.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            return res.status(200).send({wishlistUser: results.length})
        })
    },
    
    userToggleWishlistProduct: (req, res) => {
        let sql = `select * from wishlist where productId = ${req.params.id} and userId = ${req.user.userId}`
        mysql_conn.query(sql, (err, wishlistUser) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            if (wishlistUser.length === 0) {
               sql = `insert into wishlist (productId, userId) values (${req.params.id}, ${req.user.userId})`;
           } else {
               sql = `delete from wishlist where productId = ${req.params.id} and userId = ${req.user.userId}`
           }

           mysql_conn.query(sql, (err, toggleWishlist) => {
               if (err) {
                   return res.status(500).send({ status: 'error', err })
               }

               sql = `select * from wishlist where productId = ${req.params.id} and userId = ${req.user.userId}`
               mysql_conn.query(sql, (err, updateUserWishlist) => {
                   if (err) {
                       return res.status(500).send({ status: 'error', err })
                   }

                   sql = `select * from product where id = ${req.params.id}`
                   mysql_conn.query(sql, (err, dataProduct) => {
                       if (err) {
                           return res.status(500).send({ status: 'error', err })
                       }

                       if (wishlistUser.length === 0) {
                           sql = `update product set popularCount = ${dataProduct[0].popularCount + 1} where id = ${req.params.id}`
                       } else {
                           sql = `update product set popularCount = ${dataProduct[0].popularCount - 1} where id = ${req.params.id}`
                       }

                       mysql_conn.query(sql, (err, updateCount) => {
                           if (err) {
                               return res.status(500).send({ status: 'error', err })
                           }

                           return res.status(200).send({ wishlistUser: updateUserWishlist.length })
                       })
                   })
               })
           })
        }) 
    },

     userChangeAddress: (req, res) => {
        // let sql = `update users set ? where id = ${req.user.userId}`
        // mysql_conn.query(sql, req.body.data, (err, results) => {
        //     if (err) {
        //         return res.status(500).send({ status: 'error', err })
        //     }
        //     console.log(results)

        //     sql = `select FirstName, LastName, address from users where id = ${req.user.userId} and email = '${req.user.email}'`
        //     mysql_conn.query(sql, (err, updateData) => {
        //         if (err) {
        //             return res.status(500).send({ status: 'error', err })
        //         }

        //         return res.status(200).send({
        //             FirstName: updateData[0].FirstName,
        //             LastName: updateData[0].LastName,
        //             address: updateData[0].address
        //         })
        //     })
        // })
    }, 

    commentOnProduct: (req, res) => {
        console.log(req.body.dataComment)
        req.body.dataComment.userId = req.user.userId
        req.body.dataComment.date_created = new Date();
        console.log(req.body.dataComment)
        let sql = `insert into comment set ?`
        mysql_conn.query(sql, req.body.dataComment, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            let dataNotification = {
                userId: req.user.userId,
                productId: req.body.dataComment.productId,
                commentId: results.insertId
            }

            sql = `insert into notification set ?`
            mysql_conn.query(sql, dataNotification, (err, results1) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                sql = `select c.id,
                        c.comment,
                        c.commentId,
                        c.date_created,
                        c.is_edited,
                        u.username,
                        u.UserImage,
                        u.role
                    from comment as c join users as u
                    on c.userId = u.id where c.productId = ${req.body.dataComment.productId} order by c.date_created desc`
                mysql_conn.query(sql, (err, commentResults) => {
                    if (err) {
                        return res.status(500).send({ status: 'error', err })
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
                            join users as u on rc.userId = u.id where rc.productId = ${req.body.dataComment.productId} order by rc.date_created asc`
                    
                    mysql_conn.query(sql, (err, dataReply) => {
                        if (err) {
                            return res.status(500).send({ status: 'error', err })
                        }

                        return res.status(200).send({ 
                            dataComment : commentResults,
                            dataReply
                        })
                    })
                })
            })
        })
    },

    userCheckResetToken: (req, res) => {
        let email = req.resetToken.email

        return res.status(200).send(email)
    },

    replyCommentProduct: (req, res) => {
        req.body.dataReply.userId = req.user.userId
        req.body.dataReply.date_created = new Date();

        let sql = `insert into comment set ?`
        mysql_conn.query(sql, req.body.dataReply, (err, results) => {
            if (err) {
                return res.status(500).send({ status: 'error', err })
            }

            let dataNotification = {
                userId: req.user.userId,
                productId: req.body.dataReply.productId,
                commentId: req.body.dataReply.commentId
            }

            sql = `insert into notification set ?`
            mysql_conn.query(sql, dataNotification, (err, results) => {
                if (err) {
                    return res.status(500).send({ status: 'error', err })
                }

                sql = `select c.id,
                            c.comment,
                            c.commentId,
                            c.date_created,
                            c.is_edited,
                            u.username,
                            u.UserImage,
                            u.role
                        from comment as c 
                        join users as u on c.userId = u.id 
                        where c.productId = ${req.body.dataReply.productId} order by c.date_created desc;`
                mysql_conn.query(sql, (err, commentResults) => {
                    if (err) {
                        return res.status(500).send({ status: 'error', err })
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
                            join users as u on rc.userId = u.id where rc.productId = ${req.body.dataReply.productId} order by rc.date_created asc`

                    mysql_conn.query(sql, (err, dataReply) => {
                        if (err) {
                            return res.status(500).send({ status: 'error', err })
                        }

                        return res.status(200).send({
                            dataComment: commentResults,
                            dataReply
                        })
                    })
                })
            })
        })

    }
}
