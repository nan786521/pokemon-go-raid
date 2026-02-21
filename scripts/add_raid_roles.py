#!/usr/bin/env python3
"""
Add role assignments to all raid boss counters.
Each raid boss gets exactly 6 counters: 4 attackers + 1 tank + 1 healer (Blissey).
Tank selection is based on boss type resistance.
"""
import re

FILE = 'src/data/bosses.ts'

# ── Tank line templates (pre-built with role: 'tank') ──────────────────────
TANK_LINES = {
    376: "      { pokemon_id: 376, name: { 'zh-TW': '巨金怪', en: 'Metagross', ja: 'メタグロス' }, types: ['steel', 'psychic'], fast_move: { name: '子彈拳', type: 'steel' }, charged_move: { name: '彗星拳', type: 'steel' }, dps: 15.0, accessibility: 'common', is_shadow: false, is_mega: false, elite_tm_required: false, community_day_move: true, role: 'tank' },",
    306: "      { pokemon_id: 306, name: { 'zh-TW': '波士可多拉', en: 'Aggron', ja: 'ボスゴドラ' }, types: ['steel', 'rock'], fast_move: { name: '鐵尾', type: 'steel' }, charged_move: { name: '加農光砲', type: 'steel' }, dps: 13.0, accessibility: 'common', is_shadow: false, is_mega: false, elite_tm_required: false, community_day_move: false, role: 'tank' },",
    208: "      { pokemon_id: 208, name: { 'zh-TW': '大鋼蛇', en: 'Steelix', ja: 'ハガネール' }, types: ['steel', 'ground'], fast_move: { name: '鐵尾', type: 'steel' }, charged_move: { name: '大地之力', type: 'ground' }, dps: 12.0, accessibility: 'common', is_shadow: false, is_mega: false, elite_tm_required: false, community_day_move: false, role: 'tank' },",
    464: "      { pokemon_id: 464, name: { 'zh-TW': '超甲狂犀', en: 'Rhyperior', ja: 'ドサイドン' }, types: ['ground', 'rock'], fast_move: { name: '泥巴射擊', type: 'ground' }, charged_move: { name: '岩石炮', type: 'rock' }, dps: 14.0, accessibility: 'common', is_shadow: false, is_mega: false, elite_tm_required: false, community_day_move: true, role: 'tank' },",
    227: "      { pokemon_id: 227, name: { 'zh-TW': '盔甲鳥', en: 'Skarmory', ja: 'エアームド' }, types: ['steel', 'flying'], fast_move: { name: '翅膀攻擊', type: 'flying' }, charged_move: { name: '勇鳥猛攻', type: 'flying' }, dps: 11.0, accessibility: 'common', is_shadow: false, is_mega: false, elite_tm_required: false, community_day_move: false, role: 'tank' },",
    143: "      { pokemon_id: 143, name: { 'zh-TW': '卡比獸', en: 'Snorlax', ja: 'カビゴン' }, types: ['normal'], fast_move: { name: '舌舔', type: 'ghost' }, charged_move: { name: '破壞光線', type: 'normal' }, dps: 10.0, accessibility: 'common', is_shadow: false, is_mega: false, elite_tm_required: false, community_day_move: false, role: 'tank' },",
    468: "      { pokemon_id: 468, name: { 'zh-TW': '波克基斯', en: 'Togekiss', ja: 'トゲキッス' }, types: ['fairy', 'flying'], fast_move: { name: '迷人', type: 'fairy' }, charged_move: { name: '魔法閃耀', type: 'fairy' }, dps: 12.0, accessibility: 'common', is_shadow: false, is_mega: false, elite_tm_required: false, community_day_move: false, role: 'tank' },",
}

BLISSEY_LINE = "      { pokemon_id: 242, name: { 'zh-TW': '幸福蛋', en: 'Blissey', ja: 'ハピナス' }, types: ['normal'], fast_move: { name: '拍擊', type: 'normal' }, charged_move: { name: '破壞光線', type: 'normal' }, dps: 8.0, accessibility: 'common', is_shadow: false, is_mega: false, elite_tm_required: false, community_day_move: false, role: 'healer' },"

# ── Tank selection by boss primary type ────────────────────────────────────
# Priority list: best resistance first, then fallbacks
# Based on type effectiveness analysis:
#   Steel resists: normal, flying, rock, steel, grass, psychic, ice, dragon, fairy, poison, bug
#   Ground immune: electric; Rock resists: fire
#   Flying immune: ground; Fairy resists: dark; Normal immune: ghost
TANK_MAP = {
    'normal':   [376, 306, 208],   # Metagross (0.5x), Aggron (0.5x)
    'fire':     [464, 306, 143],   # Rhyperior (0.5x via Rock), Aggron (1x)
    'water':    [376, 306, 143],   # Metagross (1x neutral, best bulk)
    'electric': [208, 464, 376],   # Steelix (immune), Rhyperior (immune)
    'grass':    [376, 306, 208],   # Steel resists grass (0.5x)
    'ice':      [376, 306, 208],   # Steel resists ice (0.5x)
    'fighting': [376, 468, 227],   # Metagross (0.25x), Togekiss (immune via Fairy? no, just NVE)
    'poison':   [376, 208, 306],   # Steel immune to poison
    'ground':   [227, 468, 143],   # Skarmory (immune), Togekiss (immune)
    'flying':   [376, 306, 208],   # Steel resists flying (0.5x)
    'psychic':  [376, 306, 208],   # Metagross (0.25x double resist)
    'bug':      [306, 208, 376],   # Aggron (0.5x), Steelix (0.5x)
    'rock':     [376, 208, 306],   # Steel resists rock (0.5x)
    'ghost':    [143, 306, 208],   # Snorlax (immune), others neutral
    'dragon':   [376, 306, 208],   # Steel resists dragon (0.5x)
    'dark':     [468, 306, 143],   # Togekiss (0.5x via Fairy), Aggron (1x)
    'steel':    [376, 306, 208],   # Steel resists steel (0.5x)
    'fairy':    [376, 306, 208],   # Steel resists fairy (0.5x)
}


def get_pid(line):
    """Extract pokemon_id from a counter line."""
    m = re.search(r'pokemon_id:\s*(\d+)', line)
    return int(m.group(1)) if m else None


def get_dps(line):
    """Extract dps from a counter line."""
    m = re.search(r'dps:\s*([\d.]+)', line)
    return float(m.group(1)) if m else 0


def add_role(line, role):
    """Add role: '...' before the closing } of a counter line."""
    return re.sub(
        r'(community_day_move:\s*(?:true|false))\s*\}',
        r"\1, role: '" + role + "' }",
        line
    )


def pick_tank(boss_types, boss_pid, used_pids):
    """Pick best tank for boss based on type, avoiding conflicts."""
    primary = boss_types[0] if boss_types else 'normal'
    candidates = TANK_MAP.get(primary, [376, 306, 208])

    for tid in candidates:
        if tid != boss_pid and tid not in used_pids:
            return tid

    # Ultimate fallback: any tank not in conflict
    for tid in [376, 306, 208, 464, 227, 143, 468]:
        if tid != boss_pid and tid not in used_pids:
            return tid
    return 376


def process_counters(counter_lines, boss_types, boss_pid, boss_id):
    """Restructure counters: top 6 attackers + 1 tank + 1 healer = 8."""
    # Parse and sort by DPS descending
    parsed = [(line, get_dps(line), get_pid(line)) for line in counter_lines]
    parsed.sort(key=lambda x: -x[1])

    # Take top 6 as attackers
    attackers = parsed[:6]
    used_pids = {pid for _, _, pid in attackers}

    result = []
    for line, dps, pid in attackers:
        result.append(add_role(line, 'attacker'))

    # Pick and add tank
    tank_id = pick_tank(boss_types, boss_pid, used_pids)
    used_pids.add(tank_id)
    result.append(TANK_LINES[tank_id])

    # Add Blissey healer
    result.append(BLISSEY_LINE)

    print(f"  {boss_id}: {len(counter_lines)} -> 8 counters "
          f"(6 atk + tank={tank_id} + Blissey)")
    return result


# ── Main ───────────────────────────────────────────────────────────────────
with open(FILE, 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

output = []
i = 0
in_raid = False
in_counters = False
boss_types = []
boss_pid = None
boss_id = ''
counter_lines = []
raid_count = 0

while i < len(lines):
    line = lines[i]

    # Detect raid boss category
    if "category: 'raid'" in line:
        in_raid = True

    # Detect boss id (for logging)
    if in_raid and not in_counters:
        m = re.match(r"    id: '(.*?)'", line)
        if m:
            boss_id = m.group(1)

    # Capture boss types (4-space indent, not inside counters)
    if in_raid and not in_counters:
        m = re.match(r"    types: \[(.*?)\]", line)
        if m:
            boss_types = re.findall(r"'(\w+)'", m.group(1))

    # Capture boss pokemon_id (4-space indent)
    if in_raid and not in_counters:
        m = re.match(r'    pokemon_id: (\d+)', line)
        if m:
            boss_pid = int(m.group(1))

    # Start of counters array
    if in_raid and re.match(r'    counters: \[', line) and not in_counters:
        in_counters = True
        counter_lines = []
        output.append(line)
        i += 1
        continue

    # Inside counters
    if in_counters:
        if line.strip() == '],':
            # End of counters — process and emit
            new_lines = process_counters(counter_lines, boss_types, boss_pid, boss_id)
            output.extend(new_lines)
            output.append(line)
            in_counters = False
            raid_count += 1
            i += 1
            continue
        else:
            counter_lines.append(line)
            i += 1
            continue

    # Detect end of boss block (2-space indent closing brace)
    if in_raid:
        stripped = line.strip()
        indent = len(line) - len(line.lstrip())
        if stripped in ('},', '}') and indent <= 2:
            in_raid = False
            boss_types = []
            boss_pid = None
            boss_id = ''

    output.append(line)
    i += 1

# Write result
with open(FILE, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print(f"\nDone! Processed {raid_count} raid bosses (each now has 6 counters with roles)")
