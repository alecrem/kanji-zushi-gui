// Kanji-zushi Game Data
// Defines the neta cards (left halves), shari cards (right halves), and valid kanji combinations

export const NETA_CARDS = [
  { id: 'neta_1', component: '亻', name: 'にんべん (person)' },
  { id: 'neta_2', component: '氵', name: 'さんずい (water)' },
  { id: 'neta_3', component: '彳', name: 'ぎょうにんべん (step)' },
  { id: 'neta_4', component: '土', name: 'つちへん (earth)' },
  { id: 'neta_5', component: '扌', name: 'てへん (hand)' },
  { id: 'neta_6', component: '木', name: 'きへん (tree)' },
  { id: 'neta_7', component: '日', name: 'ひへん (sun)' },
  { id: 'neta_8', component: '禾', name: 'のぎへん (grain)' },
  { id: 'neta_9', component: '糸', name: 'いとへん (thread)' },
  { id: 'neta_10', component: '言', name: 'ごんべん (speech)' }
];

// Valid kanji combinations: maps neta + shari to resulting kanji with stroke count
// Format: { kanji, neta_id, shari_id, strokes }
export const VALID_KANJI = [
  // 亻 (person) combinations
  { kanji: '休', neta: 'neta_1', shari: '木', strokes: 6 },
  { kanji: '何', neta: 'neta_1', shari: '可', strokes: 7 },
  { kanji: '作', neta: 'neta_1', shari: '乍', strokes: 7 },
  { kanji: '体', neta: 'neta_1', shari: '本', strokes: 7 },
  { kanji: '化', neta: 'neta_1', shari: '匕', strokes: 4 },
  { kanji: '他', neta: 'neta_1', shari: '也', strokes: 5 },
  { kanji: '侮', neta: 'neta_1', shari: '毎', strokes: 8 },
  { kanji: '侍', neta: 'neta_1', shari: '寺', strokes: 8 },
  { kanji: '仮', neta: 'neta_1', shari: '反', strokes: 6 },

  // 氵 (water) combinations
  { kanji: '池', neta: 'neta_2', shari: '也', strokes: 6 },
  { kanji: '汽', neta: 'neta_2', shari: '气', strokes: 7 },
  { kanji: '海', neta: 'neta_2', shari: '毎', strokes: 9 },
  { kanji: '活', neta: 'neta_2', shari: '舌', strokes: 9 },
  { kanji: '決', neta: 'neta_2', shari: '夬', strokes: 7 },
  { kanji: '河', neta: 'neta_2', shari: '可', strokes: 8 },
  { kanji: '没', neta: 'neta_2', shari: '殳', strokes: 7 },
  { kanji: '湯', neta: 'neta_2', shari: '昜', strokes: 12 },
  { kanji: '清', neta: 'neta_2', shari: '青', strokes: 11 },
  { kanji: '濯', neta: 'neta_2', shari: '翟', strokes: 17 },
  { kanji: '沙', neta: 'neta_2', shari: '少', strokes: 7 },
  { kanji: '汁', neta: 'neta_2', shari: '十', strokes: 5 },

  // 彳 (step) combinations
  { kanji: '行', neta: 'neta_3', shari: '亍', strokes: 6 },
  { kanji: '後', neta: 'neta_3', shari: '幺夂', strokes: 9 },
  { kanji: '役', neta: 'neta_3', shari: '殳', strokes: 7 },
  { kanji: '待', neta: 'neta_3', shari: '寺', strokes: 9 },

  // 土 (earth) combinations
  { kanji: '地', neta: 'neta_4', shari: '也', strokes: 6 },
  { kanji: '場', neta: 'neta_4', shari: '昜', strokes: 12 },
  { kanji: '坂', neta: 'neta_4', shari: '反', strokes: 7 },

  // 扌 (hand) combinations
  { kanji: '打', neta: 'neta_5', shari: '丁', strokes: 5 },
  { kanji: '投', neta: 'neta_5', shari: '殳', strokes: 7 },
  { kanji: '指', neta: 'neta_5', shari: '旨', strokes: 9 },
  { kanji: '持', neta: 'neta_5', shari: '寺', strokes: 9 },
  { kanji: '捨', neta: 'neta_5', shari: '舎', strokes: 11 },
  { kanji: '括', neta: 'neta_5', shari: '舌', strokes: 9 },
  { kanji: '揚', neta: 'neta_5', shari: '昜', strokes: 12 },
  { kanji: '抄', neta: 'neta_5', shari: '少', strokes: 7 },

  // 木 (tree) combinations
  { kanji: '村', neta: 'neta_6', shari: '寸', strokes: 7 },
  { kanji: '林', neta: 'neta_6', shari: '木', strokes: 8 },
  { kanji: '校', neta: 'neta_6', shari: '交', strokes: 10 },
  { kanji: '板', neta: 'neta_6', shari: '反', strokes: 8 },
  { kanji: '相', neta: 'neta_6', shari: '目', strokes: 9 },
  { kanji: '梅', neta: 'neta_6', shari: '毎', strokes: 10 },

  // 日 (sun) combinations
  { kanji: '明', neta: 'neta_7', shari: '月', strokes: 8 },
  { kanji: '時', neta: 'neta_7', shari: '寺', strokes: 10 },
  { kanji: '晴', neta: 'neta_7', shari: '青', strokes: 12 },
  { kanji: '曜', neta: 'neta_7', shari: '翟', strokes: 18 },
  { kanji: '暗', neta: 'neta_7', shari: '音', strokes: 13 },

  // 禾 (grain) combinations
  { kanji: '科', neta: 'neta_8', shari: '斗', strokes: 9 },
  { kanji: '秋', neta: 'neta_8', shari: '火', strokes: 9 },
  { kanji: '和', neta: 'neta_8', shari: '口', strokes: 8 },
  { kanji: '秒', neta: 'neta_8', shari: '少', strokes: 9 },
  { kanji: '租', neta: 'neta_8', shari: '且', strokes: 10 },

  // 糸 (thread) combinations
  { kanji: '紙', neta: 'neta_9', shari: '氏', strokes: 10 },
  { kanji: '細', neta: 'neta_9', shari: '田', strokes: 11 },
  { kanji: '組', neta: 'neta_9', shari: '且', strokes: 11 },
  { kanji: '絵', neta: 'neta_9', shari: '会', strokes: 12 },
  { kanji: '線', neta: 'neta_9', shari: '泉', strokes: 15 },
  { kanji: '絞', neta: 'neta_9', shari: '交', strokes: 12 },
  { kanji: '紀', neta: 'neta_9', shari: '己', strokes: 9 },
  { kanji: '続', neta: 'neta_9', shari: '売', strokes: 13 },

  // 言 (speech) combinations
  { kanji: '計', neta: 'neta_10', shari: '十', strokes: 9 },
  { kanji: '記', neta: 'neta_10', shari: '己', strokes: 10 },
  { kanji: '話', neta: 'neta_10', shari: '舌', strokes: 13 },
  { kanji: '語', neta: 'neta_10', shari: '吾', strokes: 14 },
  { kanji: '読', neta: 'neta_10', shari: '売', strokes: 14 },
  { kanji: '詐', neta: 'neta_10', shari: '乍', strokes: 12 },
  { kanji: '設', neta: 'neta_10', shari: '殳', strokes: 11 },
  { kanji: '詩', neta: 'neta_10', shari: '寺', strokes: 13 },
  { kanji: '訂', neta: 'neta_10', shari: '丁', strokes: 9 },
  { kanji: '詣', neta: 'neta_10', shari: '旨', strokes: 13 },
  { kanji: '請', neta: 'neta_10', shari: '青', strokes: 15 }
];

// Extract unique shari cards from valid kanji
export const SHARI_CARDS = [...new Set(VALID_KANJI.map(k => k.shari))].map((component, index) => ({
  id: `shari_${index + 1}`,
  component
}));

// Helper function to find kanji by neta and shari combination
export function findKanji(netaComponent, shariComponent) {
  return VALID_KANJI.find(k => {
    const neta = NETA_CARDS.find(n => n.id === k.neta);
    return neta && neta.component === netaComponent && k.shari === shariComponent;
  });
}

// Helper to get all possible kanji for a given neta card
export function getKanjiForNeta(netaId) {
  return VALID_KANJI.filter(k => k.neta === netaId);
}

// Helper to get all possible kanji for a given shari component
export function getKanjiForShari(shariComponent) {
  return VALID_KANJI.filter(k => k.shari === shariComponent);
}

console.log(`Loaded ${NETA_CARDS.length} neta cards and ${SHARI_CARDS.length} shari cards`);
console.log(`Total valid kanji combinations: ${VALID_KANJI.length}`);
