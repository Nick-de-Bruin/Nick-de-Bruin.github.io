export default {};

(function() {
    const canvas = document.getElementById('canvas');  
    const ctx = canvas.getContext("2d");

    const cell_size = 20;

    var game_set = new Set()

    resizeCanvas();

    for (let x = 0; x < canvas.width / cell_size; x++) {
        for (let y = 0; y < canvas.height / cell_size; y++) {
            if (Math.random() * 2 > 1) {
                game_set.add(x + "," + y);
            }
        }
    }

    window.addEventListener('resize', resizeCanvas, false);
    window.setInterval(gameLoop, 1000);
          
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        draw(); 
    }
    
    resizeCanvas();
          
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = game_set.values(), item = undefined; item = i.next().value;) {
            let items = item.split(',');
            let x = items[0];
            let y = items[1];

            ctx.fillStyle = "rgb(82 82 82)";
            ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
        }
    }

    function gameLoop() {
        var updated_set = new Set();
        var potential = {};

        for (var i = game_set.values(), item = undefined; item = i.next().value;) {
            let items = item.split(',');
            let x = parseInt(items[0]);
            let y = parseInt(items[1]);

            if (x < 0 || x > canvas.width / cell_size || y < 0 || y > canvas.height / cell_size) { 
                continue;
            }

            let neighbors = [
                (x - 1) + "," + (y - 1),
                x + "," + (y - 1),
                (x + 1) + "," + (y - 1),
                (x - 1) + "," + (y),
                (x + 1) + "," + (y),
                (x - 1) + "," + (y + 1),
                x + "," + (y + 1),
                (x + 1) + "," + (y + 1),
            ];

            let surrounding = 0;
            for (let neighbor of neighbors) {
                if (game_set.has(neighbor)) {
                    surrounding++;
                } else {
                    if (potential.hasOwnProperty(neighbor)) {
                        potential[neighbor] = potential[neighbor] + 1;
                    } else {
                        potential[neighbor] = 1;
                    }
                }
            }

            if (surrounding === 2 || surrounding === 3) {
                updated_set.add(item);
            }
        }

        for (var key of Object.keys(potential)) {
            if (potential[key] === 3) {
                updated_set.add(key);
            }
        }

        game_set = updated_set;

        draw();
    }
})();
