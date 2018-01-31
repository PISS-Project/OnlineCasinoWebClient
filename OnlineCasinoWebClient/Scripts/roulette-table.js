

(function ($) {

    // table
    (function () {
        "use strict"

        function getButtonCells(btn) {
            var cells = btn.data('cells');
            if (!cells || !cells.length) {
                cells = [];
                switch (btn.data('type')) {
                    case 'sector':
                        var nums = sectors[btn.data('sector')];
                        for (var i = 0, len = nums.length; i < len; i++) {
                            cells.push(table_nums[nums[i]]);
                        }
                        return cells;
                        break;
                    case 'num':
                    default:
                        var nums = String(btn.data('num')).split(',');
                        for (var i = 0, len = nums.length; i < len; i++) {
                            cells.push(table_nums[nums[i]]);
                        }
                        btn.data('cells', cells)
                        return btn.data('cells');
                        break;
                }
            }
            return cells;
        };

        // props
        var active = true,
            selectors = {
                roulette: '.roulette',
                num: '.tnum',
                sector: '.sector',
                table_btns: '.controlls .tbtn'
            },
            classes = {
                red: 'red',
                black: 'black',
                green: 'green',
                hover: 'hover'
            },
            numbers = {
                red: [],
                black: [],
                green: []
            },
            sectors = {
                '1': [], // 1st row
                '2': [], // 2nd row
                '3': [], // 3rd row
                '4': [], // 1st 12
                '5': [], // 2nd 12
                '6': [], // 3rd 12
                '7': [], // 1 to 18
                '8': [], // odd
                '9': [], // RED
                '10': [], // BLACK
                '11': [], // even
                '12': [], // 19 to 36
            },
            table_nums = {},
            table_sectors = {};

        // init
        $(selectors.num).each(function () {
            var $this = $(this),
                color,
                num = Number($this.text());
            // add to instances array
            table_nums[num] = $this;
            // add to colors array
            for (var color in numbers) {
                if ($this.hasClass(classes[color])) {
                    numbers[color].push(num);
                    $this.data('color', color);
                }
            }
        })

        $(selectors.sector).each(function () {
            var $this = $(this),
                color;
            if ($this.hasClass(classes.red)) {
                color = 'red';
            } else if ($this.hasClass(classes.black)) {
                color = 'black';
            } else {
                color = 'sector';
            }
            $this.data('color', color);
            table_sectors[$this.data('sector')] = $this;
        });

        // sort numbers
        for (var color in numbers) {
            numbers[color].sort(function (a, b) { return a - b; });
        }

        // populate sectors
        for (var i = 1; i <= 36; i++) {
            // 1st row, 2nd row, 3rd row
            switch (i % 3) {
                case 0:
                    sectors['1'].push(i);
                    break;
                case 1:
                    sectors['3'].push(i);
                    break;
                case 2:
                    sectors['2'].push(i);
                    break;
            }

            // 1st 12, 2nd 12, 3rd 12
            if (i <= 12) {
                sectors['4'].push(i);
            } else if (i <= 24) {
                sectors['5'].push(i);
            } else {
                sectors['6'].push(i);
            }

            // 1 to 18, 19 to 36
            if (i <= 18) {
                sectors['7'].push(i);
            } else {
                sectors['12'].push(i);
            }

            // ODD, EVEN
            if (i % 2) {
                sectors['11'].push(i);
            } else {
                sectors['8'].push(i);
            }

            if (numbers.red.indexOf(i) != -1) {
                sectors['9'].push(i);
            } else if (numbers.black.indexOf(i) != -1) {
                sectors['10'].push(i);
            }
        }

        // buttons
        var table_btns = $(selectors.table_btns).hover(
            function () {
                if (active) {
                    var $this = $(this),
                        cells = getButtonCells($this);
                    for (var i = 0, len = cells.length; i < len; i++) {
                        cells[i].addClass(classes.hover);
                    }
                    var sector = $this.data('sector');
                    if (sector) {
                        table_sectors[sector].addClass(classes.hover);
                    }
                }
            },
            function () {
                var $this = $(this),
                    cells = getButtonCells($this);
                for (var i = 0, len = cells.length; i < len; i++) {
                    cells[i].removeClass(classes.hover);
                }
                var sector = $this.data('sector');
                if (sector) {
                    table_sectors[sector].removeClass(classes.hover);
                }
            }
        ).click(function () {
            if (typeof $(this).data('num') != 'undefined') {
                makeInactive();
                makeActive(String($(this).data('num')).split(','));
            }
            else {
                var sectorIndex = $(this).data('sector');
                makeInactive();
                makeActive(String(sectors[sectorIndex]).split(','));
                $('.sector[data-sector="' + sectorIndex + '"]').addClass("active");
            }

        });

        function makeActive(elements) {
            Array.from($(selectors.num)).forEach(function (item) {
                if (elements.indexOf(item.innerText.trim()) > -1) {
                    $(item).addClass("active");
                }
            });
        }

        function makeInactive() {
            Array.from($(selectors.sector)).forEach(function (item) {
                $(item).removeClass("active");
            });
            Array.from($(selectors.num)).forEach(function (item) {
                $(item).removeClass("active");
            });
        }
        /*console.log('1st row: ' + sectors['1']);
        console.log('2nd row: ' + sectors['2']);
        console.log('3rd row: ' + sectors['3']);
        console.log('1st 12: ' + sectors['4']);
        console.log('2nd 12: ' + sectors['5']);
        console.log('3rd 12: ' + sectors['6']);
        console.log('1-18: ' + sectors['7']);
        console.log('even: ' + sectors['8']);
        console.log('red: ' + sectors['9']);
        console.log('black: ' + sectors['10']);
        console.log('odd: ' + sectors['11']);
        console.log('19-36: ' + sectors['12']);
        console.log('numbers.green: ' + numbers.green);
        console.log('numbers.red: ' + numbers.red);
        console.log('numbers.black: ' + numbers.black);*/
    })();

})(jQuery);
