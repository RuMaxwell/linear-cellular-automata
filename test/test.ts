import { Core } from "../src/Core";

function Bi2DecTest() {
    // let x = [[0,0,0],[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0],[1,1,1]];
    // x.forEach((x) => console.log(Core.convert_binary_vector_to_decimal(x)));
    // let y = [[0, 3], [2, 5], [5, 2], [16, 4], [556, 36]];
    // y.forEach(([a, b]) => console.log(Core.divmod(a, b)));
    // let z = [0, 1, 6, 19, 25, 63];
    // z.forEach((d) => console.log(Core.convert_decimal_to_binary_vector(d)));
    // z = Core.convert_decimal_to_binary_vector(6);
    // z = Core.expand_binary_vector(z, 5);
    // console.log(z);
}

function AutomataTest() {
    let rule110_rules: [number, number[]] = [3, [0, 1, 1, 1, 0, 1, 1, 0]];
    let rule110 = new Core.Automata(10, rule110_rules);
    let x = [[0,0,0],[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0],[1,1,1]];
    x.forEach((x) => console.log(rule110.rule_funtion(x)));

    let init_state = [0, 1, 1, 0, 0, 0, 0, 0, 1, 0];
    rule110 = new Core.Automata(init_state, rule110_rules);
    for (let i = 0; i < 10; i++) {
        console.log("Generation " + i.toString() + ": " + rule110.cells.toString());
        rule110.next_generation();
    }
}

function main() {
    AutomataTest();
}

main();
