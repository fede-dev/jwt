const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

router.get('/', (req, res)=> {
    res.status(200).json({users: users})
    console.log(users)
})

const users = []

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

router.post('/registro', async(req, res)=> { 
   const user = req.body
   user.password = await bcryptjs.hash(user.password, 8)
   user.id = uuidv4()
   users.push(user)
   res.status(200).json({msg:"ok", users})
   
})

router.post('/login', async (req, res) => {
    const reqUser = req.body
    let userFind = users.find(user => user.email === reqUser.email)

    const userToken = { user: userFind.email, id: userFind.id }

    if (bcryptjs.compareSync(reqUser.password, userFind.password)) {
        jwt.sign({ user: userToken }, 'secreto', { expiresIn: '24h' }, (err, token) => {

            // res.cookie('token', token, {
            //     maxAge: 24 * 60 * 60 * 1000,// 24 hours
            //     httpOnly: false
            // });
            res.json({ token: token })
        })
    } else {
        res.status(400).json({ message: "Invalid user" })
    }
})

router.post('/crypt', async (req, res) => {
    const password = req.body.password
    if (password) {
        let passwordHash = await bcryptjs.hash(password, 8)
        res.status(200).json({ message: "Encrypt Password OK!", passwordHash: passwordHash })
    } else {
        res.status(403).json({ message: "Denegado" })
    }
})

router.get('/verify', (req, res)=> {
    jwt.verify(req.header("Authorization"),'secreto', (error, dataUser)=> {
        if(error) res.status(403).json({msg: "Ha ocurrido un Error"})
        else res.status(200).json({msg: "Acceso Autorizdo", dataUser: dataUser})
    })
})


module.exports = router