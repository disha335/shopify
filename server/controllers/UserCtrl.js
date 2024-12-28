
const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserCtrl = {
    register: async(req, res) => {
        try{
            const {name, email, password} = req.body;

            const user = await Users.findOne({email})
            
            if(user){
                return res.status(400).json({msg: "Email already registered"})
            }
            if(password<6){
                return res.status(400).json({msg: "Password should atleast be 6 characters long"})
            }
            

            // password encryption
            const passwordHash = await bcrypt.hash(password, 10)


            const newUser = new Users({
                name, email, password:passwordHash
            })
            
            // save to mongodb database
            await newUser.save()

            // create jwt(json web token) to authenticate
            const accessToken = createAccessToken({id: newUser._id})
            const refreshToken = createRefreshToken({id: newUser._id})

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({accessToken})
            
        }catch(err){
            res.status(500).json({msg: err.message});
        }
    },

    refreshToken: async(req, res) => {
        try{
            const rf_token = req.cookies.refreshToken

            if(!rf_token){
            return res.status(400).json({msg: "Please login or registers"})
            }

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please login or Register"})    
                const accessToken = createAccessToken({id: user.id})
            res.json({user, accessToken})
            })
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    login: async(req, res) => {
        try{
        const {email, password} = req.body;
        const user = await Users.findOne({email})

        if(!user){
            return res.status(400).json({msg: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({msg: "Incorrect password"})
        }

        const accessToken = createAccessToken({id: user._id})
        const refreshToken = createRefreshToken({id: user._id})

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/user/refresh_token'
        })

        res.json({accessToken})
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    logout: async(req, res) => {
        try{
            res.clearCookie('refreshToken', {
                path: '/user/refresh_token'
            })
            return res.json({msg: "Logged out"})
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    getUser: async(req, res) => {
        try{
            const user = await Users.findById(req.user.id).select('-password')

            if(!user) return res.status(400).json({msg: "User not found"});

            res.json(user)
        }
        catch(err){

        }
    }

}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'})
}

module.exports = UserCtrl;