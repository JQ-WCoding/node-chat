const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const socket = require('socket.io');
const http = require('http');
const fs = require('fs');
const server = http.createServer(app);

const io = socket(server);

app.use('/stylesheets', express.static('./public/stylesheets'));
app.use('/javascripts', express.static('./public/javascripts'));

/* Get 방식 경로 접속시 */
app.get('/', (request, response) => {
    // console.log('유저 접속');
    // response.send('Hello,  Chat Server');
    fs.readFile('./public/index.html', (err, data) => {
        if (err) {
            response.send('Error');
        } else {
            response.writeHead(200, {'Content-type': 'text/html'});
            response.write(data);
            response.end();
        }
    });
});

io.sockets.on('connection', (socket) => {
    console.log('User connected');

    socket.on('newUser', (name) => {
        console.log(`${ name } 님 접속`);

        socket.name = name;

        io.sockets.emit('update', {
            type: 'connect',
            name: 'SERVER',
            message: `${ name } 님이 접속하였습니다.`
        });
    });

    socket.on('message', (data) => {
        data.name = socket.name;

        console.log(data);

        socket.broadcast.emit('update', data);
    });

    socket.on('send', (data) => {
        console.log(`전달 메세지 : ${ data }`);
    });

    /* 접속 종료 */
    socket.on('disconnect', () => {
        console.log(`${ socket.name } 님이 나가셨습니다.`);

        socket.broadcast.emit('update', {
            type   : 'disconnect',
            name   : 'SERVER',
            message: `${ socket.name } 님이 나가셨습니다`,
        });
    });
});

/* 80 port */
server.listen(80, () => {
    console.log('80 Running');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
