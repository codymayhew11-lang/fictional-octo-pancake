import { formatDisplayDate } from '../../utils/dateHelpers';
import { getCompanyName } from '../../utils/storage';

export default function PrintHeader({ date }) {
  const company = getCompanyName();
  return (
    <div className="hidden print:block mb-4 border-b-2 border-gray-800 pb-3">
      {company && (
        <p className="text-lg font-bold text-gray-900 uppercase tracking-wide">{company}</p>
      )}
      <p className="text-2xl font-extrabold text-gray-900">Plan of the Day</p>
      {date && (
        <p className="text-base text-gray-700 mt-0.5">{formatDisplayDate(date)}</p>
      )}
    </div>
  );
}
