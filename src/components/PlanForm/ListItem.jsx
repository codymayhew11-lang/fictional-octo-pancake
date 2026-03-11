import Button from '../ui/Button';

export default function ListItem({ item, onChange, onRemove, showRemove, placeholder }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={item.value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
      />
      {showRemove && (
        <Button variant="danger" onClick={onRemove} className="shrink-0 no-print px-2 py-2 text-xs">
          ✕
        </Button>
      )}
    </div>
  );
}
