const express = require('express');
const app = express();
const PORT = 8080;
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const helmet = require('helmet');
const cakesRoutes = require('./Routes/cakes');
require('dotenv').config();
const knex = require('knex')(require('./knexfile'));
app.use(express.json());
app.use(cors());
app.use(express.static('./Public/images'))
app.use(express.urlencoded({extended: false}));


                                  //Auth code starts here


// const jwt = require('jsonwebtoken');
// const users = {
//     anvit: {
//         name: 'Anvit',
//         password: 'test'
//     },
//     umair: {
//         name: 'Umair Khan',
//         password: 'test'
//     }
// };
// const authorize = (req, res, next) => {
//     if (!req.headers.authorization) {
//         return res.status(401).json({ message: 'No token found' })
//     }
//     const authTokenArray = req.headers.authorization.split(' ');
//     if (authTokenArray[0].toLowerCase() !== 'bearer' && authTokenArray.length !== 2) {
//         return res.status(401).json({ message: 'Invalid token' });
//     }

//     jwt.verify(authTokenArray[1], process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'The token is expired or invalid' });
//         }
//         req.jwtPayload = decoded;
//         next();
//     });
// };
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     console.log(req.body.username)

//     const user = users[username];
//     console.log(user)

//     if (!user) {
//         return res.status(403).json({ message: "This user doesn't exist. Please sign up!" });
//     }
//     if (user.password === password) {
//         // Generate a token and send it back
//         const token = jwt.sign({
//             name: user.name,
//             username: username,
//             loginTime: Date.now()
//         }, process.env.JWT_SECRET, { expiresIn: '3m' });
//         return res.status(200).json({ token });
//     } else {
//         return res.status(403).json({ message: "Invalid username or password" });
//     }
// });

// app.get('/profile', authorize, (req, res) => {
//     res.json({
//         tokenInfo: req.jwtPayload,
//         sensitiveInformation: {
//             secret: 'Old school RPGs, terrible terrible puns, Lo-fi beats to relax/study to'
//         }
//     });s
// })

                                //Auth code ends here


                                //passport code starts here

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const expressSession = require('express-session');
app.use(helmet());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        (_accessToken, _refreshToken, profile, done)=>{
            console.log('Google profile is:', profile);
            //  First let's check if we already have this user in our DB
            knex('users')
                .select('id')
                .where({ github_id: profile.id })
                .then((user) => {
                    if (user.length) {
                        // If user is found, pass the user object to serialize function
                        done(null, user[0]);
                        console.log('user object is:,', user)
                    } else {
                        // If user isn't found, we create a record
                        knex('users')
                            .insert({
                                github_id: profile.id,
                                avatar_url: profile._json.avatar_url,
                                username: profile.username,
                            })
                            .then((userId) => {
                                // Pass the user object to serialize function
                                done(null, { id: userId[0] });
                                console.log(userId)
                            })
                            .catch((err) => {
                                console.log('Error creating a user', err);
                            });
                    }
                })
                .catch((err) => {
                    console.log('Error fetching a user', err);
                });
    })
);
passport.serializeUser((user, done) => {
    console.log('serializeUser (user object):', user);
    done(null, user.id);
});
passport.deserializeUser((userId, done) => {
    console.log('deserializeUser (user id):', userId);

    // Query user information from the database for currently authenticated user
    knex('users')
        .where({ id: userId })
        .then((user) => {
            // Remember that knex will return an array of records, so we need to get a single record from it
            console.log('req.user:', user[0]);

            // The full user object will be attached to request object as `req.user`
            done(null, user[0]);
        })
        .catch((err) => {
            console.log('Error finding user', err);
        });
});

const authRoutes = require('./Routes/auth');
app.use('/auth', authRoutes);
                                //passport code ends here

app.use('/', cakesRoutes);

const cartRoutes = require('./Routes/cart');
app.use('/', cartRoutes);

app.listen(PORT, ()=>{
    console.log(`listening on http://localhost:${PORT}`)
});