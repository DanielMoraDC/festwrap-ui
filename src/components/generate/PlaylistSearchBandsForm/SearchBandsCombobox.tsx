'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronsUpDownIcon, SearchIcon, XIcon } from 'lucide-react';
import BandSearchResult from './BandSearchResult';
import { BandSearcher, SearchedBand } from './BandSearcher';

type SearchComboboxProps = {
  bandSearcher: BandSearcher;
  onSelectionChange: (_values: SearchedBand[]) => void;
  searchPlaceholder: string;
};

export function SearchBandsCombobox({
  bandSearcher,
  onSelectionChange,
  searchPlaceholder,
}: SearchComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBands, setSelectedBands] = useState<SearchedBand[]>([]);
  const [searchedBands, setSearchedBands] = useState<SearchedBand[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      listRef.current &&
      !listRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleInputToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    const searchedBands = await bandSearcher.searchArtists(e.target.value);
    setSearchedBands(searchedBands);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleItemSelect = (band: SearchedBand) => {
    const newSelection = selectedBands.some(
      (selectedBand) => selectedBand.id === band.id
    )
      ? selectedBands.filter((selectedBand) => selectedBand.id !== band.id)
      : [...selectedBands, band];

    setSelectedBands(newSelection);
    onSelectionChange(newSelection);

    // Ensure closure after all updates
    setSearchInput('');
    setTimeout(() => setIsOpen(false), 0);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setActiveIndex((prev) =>
          prev < searchedBands.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleItemSelect(searchedBands[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Tab' && isOpen) {
      e.preventDefault();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current && activeIndex >= 0) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem && typeof activeItem.scrollIntoView === 'function') {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  return (
    <div className="w-full">
      <div
        className="relative w-full"
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
      >
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary h-5 w-5" />
          <input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            onMouseDown={handleInputToggle}
            className="w-full rounded-full bg-white px-12 py-3 border-2 border-secondary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            placeholder={searchPlaceholder}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="combobox-items"
          />
          {searchInput && (
            <button
              className="absolute right-12 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <XIcon className="h-5 w-5 text-gray-400" />
            </button>
          )}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle options"
          >
            <ChevronsUpDownIcon className="h-5 w-5 text-secondary" />
          </button>
        </div>
        {isOpen && (
          <ul
            ref={listRef}
            id="combobox-items"
            role="listbox"
            className="absolute z-10 w-full mt-2 bg-white border border-secondary rounded-xl shadow-lg max-h-60 overflow-auto py-3"
          >
            {searchedBands.length === 0 ? (
              <li className="px-4 py-2 text-secondary">No results found.</li>
            ) : (
              searchedBands.map((item, index) => (
                <BandSearchResult
                  key={item.id}
                  name={item.title}
                  isActive={index === activeIndex}
                  isSelected={selectedBands.some(
                    (selectedItem) => selectedItem.id === item.id
                  )}
                  handleItemSelect={() => handleItemSelect(item)}
                  icon={item.icon}
                />
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
