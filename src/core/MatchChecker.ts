import Board from "./Board";
import Gem from "../entities/Gem";

export default class MatchChecker {
    private board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    findMatches(): Gem[][] {
        const matches: Gem[][] = [];

        // Проверка строк
        for (let row = 0; row < this.board.rows; row++) {
            let run: Gem[] = [];
            for (let col = 0; col < this.board.cols; col++) {
                const gem = this.board.grid[row][col];
                if (run.length === 0 || gem.type === run[0].type) {
                    run.push(gem);
                } else {
                    if (run.length >= 3) matches.push([...run]);
                    run = [gem];
                }
            }
            if (run.length >= 3) matches.push([...run]);
        }

        // Проверка колонок
        for (let col = 0; col < this.board.cols; col++) {
            let run: Gem[] = [];
            for (let row = 0; row < this.board.rows; row++) {
                const gem = this.board.grid[row][col];
                if (run.length === 0 || gem.type === run[0].type) {
                    run.push(gem);
                } else {
                    if (run.length >= 3) matches.push([...run]);
                    run = [gem];
                }
            }
            if (run.length >= 3) matches.push([...run]);
        }

        return matches;
    }
}
