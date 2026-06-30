import { sortOptions } from "../../../data/products";

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹200", value: "0-199" },
  { label: "₹200 - ₹299", value: "200-299" },
  { label: "₹300 and above", value: "300-99999" },
];

/**
 * Controlled filter sidebar. All state lives in the parent (AllProduct) so the
 * product grid reacts instantly to every change.
 */
const ProductFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  characters,
  selectedCharacter,
  onCharacterChange,
  price,
  onPriceChange,
  sort,
  onSortChange,
  onReset,
}) => {
  return (
    <aside className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 lg:p-6 shadow-sm lg:mt-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Filters</h2>

      {/* Category */}
      <div className="mb-6">
        <h3 className="font-semibold text-[#fe4462] mb-3">Category</h3>
        <div className="space-y-3">
          {categories.map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === item}
                onChange={() => onCategoryChange(item)}
                className="h-4 w-4 accent-[#fe4462]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-5 border-gray-200 dark:border-white/10" />

      {/* Character */}
      <div className="mb-6">
        <h3 className="font-semibold text-[#fe4462] mb-3">Character</h3>
        <div className="space-y-3">
          {characters.map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="character"
                checked={selectedCharacter === item}
                onChange={() => onCharacterChange(item)}
                className="h-4 w-4 accent-[#fe4462]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-5 border-gray-200 dark:border-white/10" />

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold text-[#fe4462] mb-3">Price Range</h3>
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={price === range.value}
                onChange={() => onPriceChange(range.value)}
                className="h-4 w-4 accent-[#fe4462]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-5 border-gray-200 dark:border-white/10" />

      {/* Sort */}
      <div className="mb-6">
        <h3 className="font-semibold text-[#fe4462] mb-3">Sort By</h3>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-gray-300 dark:border-white/10 dark:bg-[#1a0a0e] dark:text-white rounded-xl px-4 py-3 focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl border border-[#fe4462] bg-transparent text-[#fe4462] hover:bg-[#fe4462] hover:text-white transition-all duration-200 cursor-pointer font-medium"
      >
        Reset Filters
      </button>
    </aside>
  );
};

export default ProductFilters;
