import SectionHeader from './SectionHeader';
import { WEATHER_OPTIONS } from '../../constants/weatherOptions';

export default function DateWeatherRow({ date, weather, setField }) {
  return (
    <div className="plan-section mb-6">
      <SectionHeader>Date &amp; Weather</SectionHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="plan-date" className="text-sm font-semibold text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="plan-date"
            type="date"
            value={date}
            onChange={e => setField('date', e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="plan-weather" className="text-sm font-semibold text-gray-700">Weather</label>
          <select
            id="plan-weather"
            value={weather}
            onChange={e => setField('weather', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
          >
            {WEATHER_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt || '— Select weather —'}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
