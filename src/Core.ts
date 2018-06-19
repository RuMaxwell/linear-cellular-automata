export namespace Core {
    function repeat(count: number, x: any): any[] {
        if (count <= 0) {
            return [];
        }
        else {
            let res = [];
            for (let i = 0; i < count; i++) {
                res.push(x);
            }
            return res;
        }
    }

    function zero_vector(size: number): number[] {
        return repeat(size, 0);
    }

    /**
     * Division and modulo.
     * @param x The dividend
     * @param y The divisor
     * @returns [The quotient, the remainder]
     */
    function divmod(x: number, y: number): [number, number] {
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
            let [quo, rem] = divmod(x - y, y);
            return [quo + 1, rem];
        }
    }

    function convert_binary_vector_to_decimal(b: number[]): number {
        let n = b.length - 1;
        return b.reduce((acc, x, idx) => acc + x * Math.pow(2, (n - idx)), 0);
    }

    function convert_decimal_to_binary_vector(d: number): number[] {
        if (d < 0) {
            // We have no need for converting a negative number
            convert_decimal_to_binary_vector(-d);
        }
        else if (d === 0 || d === 1) {
            return [d];
        }
        else {
            let [quo, rem] = divmod(d, 2);
            let next = convert_decimal_to_binary_vector(quo);
            next.push(rem);
            return next;
        }
    }

    function expand_binary_vector(b: number[], size: number): number[] {
        if (b.length >= size) {
            return b;
        }
        else {
            return repeat(size - b.length, 0).concat(b);
        }
    }

    export class Automata {
        cells: number[];
        rules_matrix: [number, number[]];
        mode: 'belt' | 'ring' = 'belt';

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
        constructor ( size: number | number[]
                    , rules_matrix: [number, Array<number>]
                    , mode?: 'belt' | 'ring') {
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

        from_array (array: number[]): void {
            this.cells = array;
        }

        rule_funtion (basis: number[]): number {
            let x = convert_binary_vector_to_decimal(basis);
            return this.rules_matrix[1][x];
        }

        next_generation (): void {
            this.cells = this.cells.map((_, idx) => {
                let basis_size = this.rules_matrix[0];
                let space_size = this.cells.length;
                if (this.mode === 'belt') {
                    if (idx < basis_size / 2 - 1) {
                        let border = repeat(Math.floor((basis_size + 1) / 2) - idx - 1, 0);
                        border = border.concat(this.cells.slice(0, Math.ceil(basis_size / 2)));
                        return this.rule_funtion(border);
                    }
                    else if (idx > space_size - Math.ceil(basis_size / 2)) {
                        let border = this.cells.slice(space_size - Math.ceil(basis_size / 2));
                        border = border.concat(repeat(Math.ceil(basis_size / 2) + idx - space_size, 0));
                        return this.rule_funtion(border);
                    }
                    else {
                        return this.rule_funtion(this.cells.slice(
                            idx + 1 - Math.ceil(basis_size / 2),
                            idx + 1 + Math.floor(basis_size / 2)
                        ));
                    }
                }
                else {
                    let basis = [];
                    for (let i = -Math.ceil(basis_size / 2); i < Math.floor(basis_size / 2); i++) {
                        let j = (idx + i + 1 + space_size) % space_size;
                        basis.push(this.cells[j]);
                    }
                    return this.rule_funtion(basis);
                }
            });
        }
    }
}
