"use strict";
exports.__esModule = true;
var Core;
(function (Core) {
    function repeat(count, x) {
        if (count <= 0) {
            return [];
        }
        else {
            var res = [];
            for (var i = 0; i < count; i++) {
                res.push(x);
            }
            return res;
        }
    }
    function zero_vector(size) {
        return repeat(size, 0);
    }
    /**
     * Division and modulo.
     * @param x The dividend
     * @param y The divisor
     * @returns [The quotient, the remainder]
     */
    function divmod(x, y) {
        if (y === 0) {
            console.error("Divided by zero.");
            throw "Divided by zero";
        }
        else if (x === 0) {
            return [0, 0];
        }
        else if (x < y) {
            return [0, x];
        }
        else {
            var _a = divmod(x - y, y), quo = _a[0], rem = _a[1];
            return [quo + 1, rem];
        }
    }
    function convert_binary_vector_to_decimal(b) {
        var n = b.length - 1;
        return b.reduce(function (acc, x, idx) { return acc + x * Math.pow(2, (n - idx)); }, 0);
    }
    function convert_decimal_to_binary_vector(d) {
        if (d < 0) {
            // We have no need for converting a negative number
            convert_decimal_to_binary_vector(-d);
        }
        else if (d === 0 || d === 1) {
            return [d];
        }
        else {
            var _a = divmod(d, 2), quo = _a[0], rem = _a[1];
            var next = convert_decimal_to_binary_vector(quo);
            next.push(rem);
            return next;
        }
    }
    function expand_binary_vector(b, size) {
        if (b.length >= size) {
            return b;
        }
        else {
            return repeat(size - b.length, 0).concat(b);
        }
    }
    var Automata = /** @class */ (function () {
        /**
         * @param size          An integer specify the number of cells of the machine,
         *                      or an array of integer directly provide all the values of cells.
         * @param rules_matrix  A pair of an integer and an array of integer, in which the former
         *                      specifies how many cells each rule needs for input, and the latter
         *                      contains every result for each rule. It is equavilent to an m*(n+1)
         *                      mapping matrix.
         *
         * Example: [[0, 0, 0],
         *           [0, 1, 1],
         *           [1, 0, 1],
         *           [1, 1, 0]] can be represented in [2, [0, 1, 1, 0]].
         */
        function Automata(size, rules_matrix, mode) {
            this.mode = 'belt';
            // Type guard
            // Like case..of in Cool, but typeof doesn't support user-defined types
            // Far from reaching "Guards" in Haskell, but type guard isn't aimed to solve the same problem
            // But if I want to implement arithmetic data types like in Haskell, I'll fail to do the same using union type in Typescript
            if (typeof size === 'number') {
                this.cells = zero_vector(size);
            }
            else {
                this.cells = size;
            }
            this.rules_matrix = rules_matrix;
            if (mode !== undefined) {
                this.mode = mode;
            }
        }
        Automata.prototype.from_array = function (array) {
            this.cells = array;
        };
        Automata.prototype.rule_funtion = function (basis) {
            var x = convert_binary_vector_to_decimal(basis);
            return this.rules_matrix[1][x];
        };
        Automata.prototype.next_generation = function () {
            var _this = this;
            this.cells = this.cells.map(function (_, idx) {
                var basis_size = _this.rules_matrix[0];
                var space_size = _this.cells.length;
                if (_this.mode === 'belt') {
                    if (idx < basis_size / 2 - 1) {
                        var border = repeat(Math.floor((basis_size + 1) / 2) - idx - 1, 0);
                        border = border.concat(_this.cells.slice(0, Math.ceil(basis_size / 2)));
                        return _this.rule_funtion(border);
                    }
                    else if (idx > space_size - Math.ceil(basis_size / 2)) {
                        var border = _this.cells.slice(space_size - Math.ceil(basis_size / 2));
                        border = border.concat(repeat(Math.ceil(basis_size / 2) + idx - space_size, 0));
                        return _this.rule_funtion(border);
                    }
                    else {
                        return _this.rule_funtion(_this.cells.slice(idx + 1 - Math.ceil(basis_size / 2), idx + 1 + Math.floor(basis_size / 2)));
                    }
                }
                else {
                    var basis = [];
                    for (var i = -Math.ceil(basis_size / 2); i < Math.floor(basis_size / 2); i++) {
                        var j = (idx + i + 1 + space_size) % space_size;
                        basis.push(_this.cells[j]);
                    }
                    return _this.rule_funtion(basis);
                }
            });
        };
        return Automata;
    }());
    Core.Automata = Automata;
})(Core = exports.Core || (exports.Core = {}));
