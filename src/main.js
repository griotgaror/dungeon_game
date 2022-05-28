"use strict";

const get_cell_pos = function(array, screen, map, color) {
    const grid = new Map();

    array.forEach((row, y) => {
        row.forEach((value, x) => {

            let cell_pos_x = 0 + map.cell_size * x;
            let cell_pos_y = 0 + map.cell_size * y;

            if (value != 0) {
                screen.ctx.fillStyle = color;
                screen.ctx.fillRect(cell_pos_x, cell_pos_y, map.cell_size - 2, map.cell_size - 2)
                grid.set("pos_x", cell_pos_x);
                grid.set("pos_y", cell_pos_y);
                grid.set("size", map.cell_size);
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
    
    map.render = function() {
        screen.ctx.drawImage(map.sprite, 0, 0, map.width, map.height);
        map.collisions = get_cell_pos(map.collision_2d, screen, map, "rgba(150, 0, 0, .3)");
    };

    return map;
};

const Sprite = function(screen) {
    const sprite = {};

    sprite.update = function() {
        screen.ctx.fillStyle = sprite.color
        screen.ctx.fillRect(sprite.pos_x, sprite.pos_y, sprite.width, sprite.height);
    };
    return sprite;
};

const Player = function(screen, map) {
    const player = new Sprite(screen);
    player.position_data = cast_to_2d(player_positions_data);
    player.data = get_cell_pos(player.position_data, screen, map);
    player.width = player.height = player.data.get("size");
    player.pos_x = player.data.get("pos_x");
    player.pos_y = player.data.get("pos_y");
    player.color = "rgba(200, 200, 200, .5)";

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
    console.log(player.pos_x);

    const update = function() {
        screen.ctx.clearRect(0, 0, screen.width, screen.height);
        
        map.render();
        player.update();
        
        window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
};

window.onload = game();