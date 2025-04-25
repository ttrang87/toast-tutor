import { useState } from "react";
import { trashIcon } from "../../assets/icon";

export const PriceRangeInputs = ({ initialRange, onRangeChange }) => {
  const [min, setMin] = useState(initialRange?.min?.toString() || '');
  const [max, setMax] = useState(initialRange?.max?.toString() || '');

  const handleMinChange = (e) => {
    setMin(e.target.value);
  };

  const handleMaxChange = (e) => {
    setMax(e.target.value);
  };

  const handleSubmit = () => {
    const minValue = min === '' ? undefined : parseInt(min);
    const maxValue = max === '' ? undefined : parseInt(max);
    onRangeChange({
      min: minValue ?? 0,
      max: maxValue ?? 200
    });
  };

  const handleReset = () => {
    setMin('');
    setMax('');
    onRangeChange({
      min: 0,
      max: 200
    });
  };

  return (
    <div className="px-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Min Price ($)</label>
            <input
              type="number"
              value={min}
              onChange={handleMinChange}
              className="w-full p-2 rounded-md border border-gray-300"
              min={0}
              placeholder="Min price"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Max Price ($)</label>
            <input
              type="number"
              value={max}
              onChange={handleMaxChange}
              className="w-full p-2 rounded-md border border-gray-300"
              min={0}
              placeholder="Max price"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-yellow-600 text-white hover:bg-yellow-700 font-medium py-2 px-28 rounded-md transition-colors"
          >
            Apply Price Range
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
          >
            {trashIcon}
          </button>
        </div>
      </div>
    </div>
  );
};