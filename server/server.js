const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Boom = require('express-boom');

const exphbs = require('express-handlebars');
const cors = require('cors');
const path = require('path');

require('./config/env').config(__dirname + '/.env');
const { passport } = require('./config');
const mongoose = require('./config/db/connection');
const { mainRoute, userRoute, authRoute } = require('./routes');

const app = express();
const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: {
        selector(selected, options) {
            return options.fn(this)
                .replace(
                    `value="${selected}"`, 
                    `value="${selected}" selected`
                );
        },
        isAdmin: user => (user ? '/admins/dashboard' : '/users/dashboard')
    },
    defaultLayout: 'main',
    partialsDir: 'views/partials/'
});

// set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.engine('.hbs', hbs.engine);

// load middlewares
app.use('/src', express.static(path.join(__dirname, '../client/src')));
app.use('/scripts', express.static(path.join(__dirname, '../client/node_modules')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(Boom());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// load routes
app.use('/', mainRoute);
app.use('/auth', authRoute);
app.use('/users', userRoute);

app.disable('x-powered-by');


app.listen(
    process.env.PORT || 3000,
    () => console.log('Listening...')
);

