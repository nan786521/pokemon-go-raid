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
    <div className="flex gap-1.5">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
          selected === null
            ? 'bg-red-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        全部
      </button>
      {tiers.map(t => (
        <button
          key={t}
          onClick={() => onChange(selected === t ? null : t)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            selected === t
              ? 'bg-yellow-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {'★'.repeat(t)}
        </button>
      ))}
    </div>
  );
}
