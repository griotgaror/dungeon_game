"use strict";

const get_cell_pos = function(array, screen, map) {
    const grid = [];

    array.forEach((row, y) => {
        row.forEach((value, x) => {

            let cell_pos_x = 0 + map.cell_size * x;
            let cell_pos_y = 0 + map.cell_size * y;

            if (value != 0) {
                grid.push({"pos_x": cell_pos_x, "pos_y": cell_pos_y, "size": map.cell_size});
            };
        });
    });
    return grid;
};

const cast_to_2d = function(array) {
    const grid = [];

    let count = 0;
    let row;

    for (let idx = 0; idx < array.length; idx++) {
        if (count < 1 || count == 60) {
            count = 0;
            row = [];
            grid.push(row);
        };

        row.push(array[idx]);
        count += 1;
    };
    return grid;
};

const Game_map = function(screen, map_data) {
    const map = {};
    map.sprite = new Image();
    map.sprite.src = map_data.sprite;

    map.scale = 2;
    map.cell_size = 32 / map.scale;
    
    map.width = map_data.width / map.scale;
    map.height = map_data.height / map.scale;

    map.collision_2d = cast_to_2d(map_data.collisions);
    map.collisions = get_cell_pos(map.collision_2d, screen, map);
    console.log(map.collisions);
    
    map.render = function() {
        screen.ctx.drawImage(map.sprite, 0, 0, map.width, map.height);

        map.collisions.forEach(cell => {
            screen.ctx.fillStyle = "rgba(200, 0, 0, .3)"
            screen.ctx.fillRect(cell.pos_x, cell.pos_y, cell.size - 2, cell.size - 2)
        })
    };

    return map;
};

const Sprite = function(screen, map) {
    const sprite = {};
    sprite.direction = new Map();
    sprite.resize = 4;

    sprite.collisions_detection = function(cell) {
        let border_right = sprite.pos_x + sprite.width - sprite.right >= cell.pos_x;
        let border_left  = sprite.pos_x + sprite.left <= cell.pos_x + cell.size;
        let border_down  = sprite.pos_y + sprite.height - sprite.down >= cell.pos_y;
        let border_up    = sprite.pos_y + sprite.up <= cell.pos_y + cell.size; 

        return (border_right && border_left && border_down && border_up);
    };

    sprite.check_collision = function() {
        map.collisions.forEach(cell => {

            if (sprite.collisions_detection(cell)) { 
                console.log("collide");
                sprite.collide = true;   
            }; 
        });

        return sprite.collide
    };
    
    sprite.update = function() {
        if (sprite.direction.get("right")) {
            sprite.collide = false;
            sprite.right = 0; sprite.left = sprite.down = sprite.up = sprite.resize; 
            sprite.check_collision();
            if (!sprite.collide) { sprite.pos_x += sprite.speed; };
        }
        else if (sprite.direction.get("left")) {
            sprite.collide = false;
            sprite.left = 0; sprite.right = sprite.down = sprite.up = sprite.resize;
            sprite.check_collision();
            if (!sprite.collide) { sprite.pos_x -= sprite.speed; };
        }
        else if (sprite.direction.get("down")) {
            sprite.collide = false;
            sprite.down = 0; sprite.right = sprite.left = sprite.up = sprite.resize;
            sprite.check_collision();
            if (!sprite.collide) { sprite.pos_y += sprite.speed; };
        }     
        else if (sprite.direction.get("up")) {
            sprite.collide = false;
            sprite.up = 0; sprite.right = sprite.left = sprite.down = sprite.resize;
            sprite.check_collision();
            if (!sprite.collide) { sprite.pos_y -= sprite.speed; };
        };

        screen.ctx.fillStyle = sprite.color
        screen.ctx.fillRect(sprite.pos_x, sprite.pos_y, sprite.width, sprite.height);
    };
    return sprite;
};

const Player = function(screen, map) {
    const player = new Sprite(screen, map);
    player.position_data = cast_to_2d(player_positions_data);
    player.data = get_cell_pos(player.position_data, screen, map);

    player.data.forEach(data => {
        player.width = player.height = data.size
        player.pos_x = data.pos_x;
        player.pos_y = data.pos_y;
    });

    player.speed = 3;
    player.color = "rgba(200, 200, 200, .4)";

    addEventListener("keydown", key => { player.user_input(key.keyCode, true) });
    addEventListener("keyup", key => { player.user_input(key.keyCode, false) });

    player.user_input = function(key, value) {
        if (key == 68) { player.direction.set("right", value) };
        if (key == 65) { player.direction.set("left", value)};
        if (key == 83) { player.direction.set("down", value)};
        if (key == 87) { player.direction.set("up", value)};
    };

    return player;
};

const game = function() {
    const screen = {};
    screen.canvas = document.querySelector(".screen");
    screen.ctx = screen.canvas.getContext("2d");
    screen.height = screen.canvas.height = window.innerHeight - 10;
    screen.width = screen.canvas.width = window.innerWidth - 10;

    const map = new Game_map(screen, first_map);
    const player = new Player(screen, map);

    const update = function() {
        screen.ctx.clearRect(0, 0, screen.width, screen.height);
        
        map.render();
        player.update();
        
        window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
};

window.onload = game();