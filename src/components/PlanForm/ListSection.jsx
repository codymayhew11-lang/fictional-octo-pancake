import SectionHeader from './SectionHeader';
import ListItem from './ListItem';
import Button from '../ui/Button';

export default function ListSection({ title, items, handlers, placeholder }) {
  return (
    <div className="plan-section mb-6">
      <SectionHeader>{title}</SectionHeader>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            onChange={value => handlers.update(item.id, value)}
            onRemove={() => handlers.remove(item.id)}
            showRemove={items.length > 1}
            placeholder={placeholder}
          />
        ))}
        <div className="no-print mt-1">
          <Button variant="secondary" onClick={handlers.add}>
            + Add {title.replace(/s$/, '')}
          </Button>
        </div>
      </div>
    </div>
  );
}
