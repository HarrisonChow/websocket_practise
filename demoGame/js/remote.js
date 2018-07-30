var Remote = function(socket) {
    var game;

    var bindEvents= function() {
        socket.on('init', function(data) {
            start(data.type, data.dir);
        });

        socket.on('next', function(data) {
            game.performNext(data.type, data.dir);
        });

        socket.on('rotate', function(data) {
            game.rotate();
        });

        socket.on('moveDown', function(data) {
            game.moveDown();
        });

        socket.on('moveLeft', function(data) {
            game.moveLeft();
        });

        socket.on('moveRight', function(data) {
            game.moveRight();
        });

        socket.on('fall', function(data) {
            game.fall();
        });

        socket.on('squareFixed', function(data) {
            game.squareFixed();
        });

        socket.on('line', function(data) {
            game.checkRemove();
            game.addScore(data)
        });

        socket.on('time', function(data) {
            game.setTime(data);
        });

        socket.on('lose', function(data) {
            game.gameOver(false);
        });

        socket.on('addTailLines', function(data) {
            game.addTailLines(data);
        });


    }

    var start = function(type, dir) {
        var doms = {
            gameDiv: document.getElementById('remote_game'),
            nextDiv: document.getElementById('remote_next'),
            timeDiv: document.getElementById('remote_time'),
            scoreDiv: document.getElementById('remote_score'),
            resultDiv: document.getElementById('remote_gameover')
        }
        game= new Game();
        game.init(doms, type, dir);
    }

    bindEvents();
}
