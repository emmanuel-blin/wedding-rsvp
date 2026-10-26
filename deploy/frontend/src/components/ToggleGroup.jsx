// Multi-select buttons (meal options, allergens)
export default function ToggleGroup({ options, selected, onToggle, getLabel = (option) => option }) {
    return (
        <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
            <button
                key={option}
                type="button"
                onClick={() => onToggle(option)}
                aria-pressed={isSelected}
                className={`py-3 border rounded-sm transition-all flex items-center justify-center gap-2 ${
                isSelected
                    ? 'border-secondary bg-accent/10 text-secondary'
                    : 'border-gray-300 text-gray-600 hover:border-secondary'
                }`}
            >
                {isSelected && <span aria-hidden="true">✓</span>}
                {getLabel(option)}
            </button>
            );
        })}
        </div>
    );
}
