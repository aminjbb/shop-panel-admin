import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

export interface SearchBoxProps {
  value?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value = "",
  onSearch,
  placeholder = "جستجو بر اساس نام محصول، بارکد یا SKU...",
  className = "",
  debounceMs = 300,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;
  
  const lastSearchedRef = useRef(value);
  const isFirstRender = useRef(true);

  // Sync with external value changes
  useEffect(() => {
    setInternalValue(value);
    lastSearchedRef.current = value;
  }, [value]);

  // Debounce search only when internalValue changes and differs from lastSearched
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (internalValue === lastSearchedRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      lastSearchedRef.current = internalValue;
      if (onSearchRef.current) {
        onSearchRef.current(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs]);

  const handleClear = () => {
    setInternalValue("");
    lastSearchedRef.current = "";
    if (onSearchRef.current) {
      onSearchRef.current("");
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl text-white placeholder-slate-400 ps-10 pe-10 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />

      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="پاک کردن جستجو"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
