$(function () {
    //сохраним элементы DOM в переменные
    let container = $('#container'),
        bird = $('#bird'),
        pole = $('.pole'),
        pole_1 = $('#pole_1'),
        pole_2 = $('#pole_2'),
        score = $('#score'),
        speed_span = $('#speed'),
        restart_btn = $('#restart_btn'),
    //сохраним начальные настройки
        container_width = parseInt(container.width()),
        container_height = parseInt(container.height()),
        pole_initial_position = parseInt(pole.css('right')),
        pole_initial_height = parseInt(pole.css('height')),
        bird_left = parseInt(bird.css('left')),
        bird_height = parseInt(bird.height()),
        speed = 5,
    //другие настройки
        go_up = false,
        score_updated = false,
        game_over = false,
        anim_id;
    let the_game =  () => {
        if (collision(bird, pole_1) || collision(bird, pole_2) || parseInt(bird.css('top')) <= 0 || parseInt(bird.css('top')) > container_height - bird_height) {
            stop_the_game();
        }
        else {
            let pole_current_position = parseInt(pole.css('right'));
            //обновляем очки когда птица успешно пролетела препятствие
            if (pole_current_position > container_width - bird_left) {
                if (score_updated === false) {
                    score.text(parseInt(score.text()) + 1);
                    score_updated = true;
                }
            }
            //проверяем когда препятствия выходят из контейнера
            if (pole_current_position > container_width) {
                let new_height = parseInt(Math.random() * 100);
                //change the pole's height
                pole_1.css('height', pole_initial_height + new_height);
                pole_2.css('height', pole_initial_height - new_height);
                //increase speed
                speed = speed + 1;
                speed_span.text(speed);
                score_updated = false;
                pole_current_position = pole_initial_position;
            }
            //двигаем препядствия
            pole.css('right', pole_current_position + speed);
            if (go_up === false) {
                go_down();
            }
        }
        anim_id = requestAnimationFrame(the_game);
    };
    anim_id = requestAnimationFrame(the_game);
    // Для декстопа
    $(document).on('keydown', function (e) {
        let key = e.keyCode;
        if (key === 32 && go_up === false && game_over === false) {
            go_up = requestAnimationFrame(up);
        }
    });
    $(document).on('keyup', function (e) {
         let key = e.keyCode;
         if (key === 32) {
                cancelAnimationFrame(go_up);
                go_up = false;
         }
    });
    // Для планшетов и мобильных устройств
    $(document).on('vclick', () => { 
        if (go_up === false && game_over === false) {
            go_up = requestAnimationFrame(up);
            setTimeout(() => {
                cancelAnimationFrame(go_up); 
                go_up = false;
            }, 80);
        }  
    });

    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 3);
    };

    function up() {
        bird.css('top', parseInt(bird.css('top')) - 6);
        go_up = requestAnimationFrame(up);
    };

    function stop_the_game() {
        cancelAnimationFrame(anim_id);
        game_over = true;
        restart_btn.slideDown();
    };
    restart_btn.click(function () {
        location.reload();
    });

    function collision($div1, $div2) {
        let x1 = $div1.offset().left,
            y1 = $div1.offset().top,
            h1 = $div1.outerHeight(true),
            w1 = $div1.outerWidth(true),
            b1 = y1 + h1,
            r1 = x1 + w1,
            x2 = $div2.offset().left,
            y2 = $div2.offset().top,
            h2 = $div2.outerHeight(true),
            w2 = $div2.outerWidth(true),
            b2 = y2 + h2,
            r2 = x2 + w2;
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    };
});