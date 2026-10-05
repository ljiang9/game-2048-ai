// test_2048.mjs — 从 index.html 提取 2048 纯函数并 Node 断言。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "index.html"), "utf-8");
const m = html.match(/\/\/ ===== 纯函数：2048 核心[\s\S]*?\/\/ ===== GAME_LOGIC_END =====/);
assert.ok(m, "未找到 2048 纯函数标记");
const f = new Function(`${m[0]}\nreturn { slideLeft, moveGrid, bestMove };`)();

// 合并规则：[2,2,0,0] -> [4,0,0,0]，得分 4
let r = f.slideLeft([2,2,0,0]);
assert.deepStrictEqual(r.row, [4,0,0,0]);
assert.strictEqual(r.gained, 4);

// 三连不重复合并：[2,2,2,0] -> [4,2,0,0]（只合并一次相邻）
r = f.slideLeft([2,2,2,0]);
assert.deepStrictEqual(r.row, [4,2,0,0]);

// [2,2,2,2] -> [4,4,0,0]
r = f.slideLeft([2,2,2,2]);
assert.deepStrictEqual(r.row, [4,4,0,0]);

// 无变化
r = f.slideLeft([2,4,8,16]);
assert.strictEqual(r.moved, false);

// 垂直移动：up 把列 [2,0,2,0] -> [4,0,0,0]
const g = [[2,0,0,0],[0,0,0,0],[2,0,0,0],[0,0,0,0]];
const up = f.moveGrid(g, "up");
assert.strictEqual(up.grid[0][0], 4);
assert.strictEqual(up.gained, 4);

// bestMove 返回一个合法可移动方向
const start = [[2,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,2]];
const d = f.bestMove(start);
assert.ok(["left","right","up","down"].includes(d), "应返回一个方向");

console.log("OK: game-2048-ai 全部用例通过");