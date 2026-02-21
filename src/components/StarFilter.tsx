interface Props {
  selected: number | null;
  onChange: (tier: number | null) => void;
  availableTiers: (number | string)[];
}

export function StarFilter({ selected, onChange, availableTiers }: Props) {
  const tiers = availableTiers
    .filter((t): t is number => typeof t === 'number')
    .sort((a, b) => b - a);

  if (tiers.length === 0) return null;

  return (
    <div className="flex gap-1.5" role="group" aria-label="星級篩選">
      <button
        onClick={() => onChange(null)}
        aria-pressed={selected === null}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          selected === null
            ? 'bg-red-500 text-white shadow-sm'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        全部
      </button>
      {tiers.map(t => (
        <button
          key={t}
          onClick={() => onChange(selected === t ? null : t)}
          aria-pressed={selected === t}
          aria-label={`${t}星`}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            selected === t
              ? 'bg-yellow-500 text-white shadow-sm'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {'★'.repeat(t)}
        </button>
      ))}
    </div>
  );
}
