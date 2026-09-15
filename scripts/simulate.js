'use strict';
// 봇끼리 뱅을 빠르게 돌려 규칙 엔진을 검사한다: node scripts/simulate.js [판수]
const Game = require('../server/game');

const GAMES = Number(process.argv[2]) || 60;
Game.setPace(0);

function runOne(i) {
  const n = 4 + (i % 4);
  return new Promise((resolve, reject) => {
    let g;
    let lastTurn = 0;
    const seats = Array.from({ length: n }, (_, k) => ({ pid: `bot${k}`, name: `봇${k}`, isBot: true }));
    const hooks = {
      isOnline: () => true,
      changed: () => {
        if (!g) return;
        const a = g.cardAudit();
        if (a.total !== 80 || a.unique !== 80) return reject(new Error(`카드 수 이상: ${a.total}장 / 고유 ${a.unique}`));
        for (const p of g.players) {
          if (p.hp > p.maxHp) return reject(new Error(`${p.name} 체력 초과`));
          if (!p.alive && (p.hand.length || p.equip.length)) return reject(new Error(`${p.name} 죽었는데 카드 보유`));
          const types = p.equip.map((c) => c.type);
          if (new Set(types).size !== types.length) return reject(new Error(`${p.name} 같은 장비 중복`));
        }
        for (const p of g.players) {
          const v = g.viewFor(p.pid);
          for (const q of v.players) if (q.pid !== p.pid && q.alive && q.role && q.role !== 'sheriff' && !v.over) return reject(new Error('남의 역할이 노출됨'));
          if (v.prompt && v.prompt.type === 'kit' && v.prompt.pid !== p.pid && v.prompt.data.cards) return reject(new Error('킷의 카드가 노출됨'));
        }
        if (g.turnNo !== lastTurn) lastTurn = g.turnNo;
        if (g.over) {
          clearInterval(watch);
          resolve({ n, turns: g.turnNo, winners: g.over.winners.join('+') });
        }
      },
    };
    const watch = setInterval(() => {
      if (g && g.turnNo > 400) {
        clearInterval(watch);
        g.destroy();
        reject(new Error(`${n}인 게임이 400턴을 넘어도 끝나지 않음`));
      }
    }, 20);
    g = new Game(seats, hooks);
  });
}

(async () => {
  const stats = {};
  const turns = [];
  for (let i = 0; i < GAMES; i++) {
    const r = await runOne(i);
    stats[r.winners] = (stats[r.winners] || 0) + 1;
    turns.push(r.turns);
  }
  turns.sort((a, b) => a - b);
  console.log(`${GAMES}판 완료 (4~7인 번갈아)`);
  console.log('승리 진영:', stats);
  console.log(`턴 수: 최소 ${turns[0]} / 중앙 ${turns[Math.floor(turns.length / 2)]} / 최대 ${turns[turns.length - 1]}`);
  setTimeout(() => process.exit(0), 50);
})().catch((e) => {
  console.error('실패:', e.message);
  setTimeout(() => process.exit(1), 50);
});
