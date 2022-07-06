const socket = io();

/* 접속 되었을 때 실행 */
socket.on('connect', () => {
    let name = prompt('반갑습니다!', '');

    if (!name) {
        name = '익명';
    }

    socket.emit('newUser', name);
});

/* 서버로부터 데이터 받은 경우 */
socket.on('update', (data) => {
    let chat = document.getElementById('chat');

    let message = document.createElement('div');
    let node = document.createTextNode(`${ data.name }: ${ data.message }`);
    let className = '';

    switch (data.type) {
        case 'message':
            className = 'other';
            break;

        case 'connect':
            className = 'connect';
            break;

        case 'disconnect':
            className = 'disconnect';
            break;
    }

    message.classList.add(className);
    message.appendChild(node);
    chat.appendChild(message);
});

/* 메시지 전송 함수 */
function send() {
    let message = document.getElementById('test').value;

    document.getElementById('test').value = '';

    let chat = document.getElementById('chat');
    let msg = document.createElement('div');
    let node = document.createTextNode(message);
    msg.classList.add('me');
    msg.appendChild(node);
    chat.appendChild(msg);

    socket.emit('message', {type: 'message', message: message});
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('test').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            send();
        }
    });
});
