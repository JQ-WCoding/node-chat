const socekt = io();

socekt.on('connect', () => {
    let input = document.getElementById('test');
    input.value = 'Connected';

    let name = prompt('반갑습니다!', '');

    if (!name) {
        name = 'Anonymous';
    }

    socekt.emit('newUser', name);
});

socekt.on('update', (data) => {
    console.log(`${ data.name }: ${ data.message }`);
});

function send() {
    let message = document.getElementById('test').value;

    document.getElementById('test').value = '';

    // socekt.emit('send', {msg: message});
    socekt.emit('message', {
        type   : 'message',
        message: message
    });
}