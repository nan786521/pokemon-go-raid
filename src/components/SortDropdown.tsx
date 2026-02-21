import { memo } from 'react';

export type SortKey = 'recommend' | 'cp-desc' | 'cp-asc' | 'name' | 'tier-desc';

interface Props {
  value: SortKey;
  onChange: (key: SortKey) => void;
}

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recommend', label: '推薦度' },
  { key: 'cp-desc',   label: 'CP 高→低' },
  { key: 'cp-asc',    label: 'CP 低→高' },
  { key: 'tier-desc', label: '星級高→低' },
  { key: 'name',      label: '名稱 A→Z' },
];

export const SortDropdown = memo(function SortDropdown({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor="sort-select" className="shrink-0 text-xs text-gray-400">排序</label>
      <select
        id="sort-select"
        value={value}
        onChange={e => onChange(e.target.value as SortKey)}
        className="rounded-lg border border-gray-600 bg-gray-800 px-2 py-1.5 text-xs text-gray-200 outline-none focus:border-red-400"
      >
        {OPTIONS.map(o => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
    </div>
  );
});
