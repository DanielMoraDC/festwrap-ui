'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';

export type SelectSearchItem = {
  value: string;
  label: string;
};

type SelectSearchContextValue = {
  value: string | string[];
  onChange: (_value: string) => void;
  items: SelectSearchItem[];
  isOpen: boolean;
  setIsOpen: (_open: boolean) => void;
  multiple?: boolean;
  onSearch?: (_query: string) => Promise<void> | void;
};

const SelectSearchContext = React.createContext<
  SelectSearchContextValue | undefined
>(undefined);

interface SelectSearchProps {
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (_value: string | string[]) => void;
  onSearch?: (_query: string) => Promise<void> | void;
  items: SelectSearchItem[];
  children: React.ReactNode;
  multiple?: boolean;
}

export function SelectSearch({
  value,
  defaultValue,
  onChange,
  onSearch,
  items,
  children,
  multiple = false,
}: SelectSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | string[]>(
    value || defaultValue || (multiple ? [] : '')
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = React.useCallback(
    (newValue: string) => {
      let updatedValue: string | string[];

      if (multiple) {
        const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
        updatedValue = currentValues.includes(newValue)
          ? currentValues.filter((v) => v !== newValue)
          : [...currentValues, newValue];
      } else {
        updatedValue = newValue;
        setIsOpen(false);
      }

      setSelectedValue(updatedValue);
      onChange?.(updatedValue);
    },
    [multiple, onChange, selectedValue]
  );

  return (
    <SelectSearchContext.Provider
      value={{
        value: selectedValue,
        onChange: handleChange,
        items,
        isOpen,
        setIsOpen,
        multiple,
        onSearch,
      }}
    >
      {children}
    </SelectSearchContext.Provider>
  );
}

const useSelectSearch = () => {
  const context = React.useContext(SelectSearchContext);
  if (!context) {
    throw new Error('useSelectSearch must be used within SelectSearch');
  }
  return context;
};

export function SelectSearchTrigger({
  className,
  placeholder = 'Select an option',
}: {
  className?: string;
  placeholder?: string;
}) {
  const { value, items, isOpen, setIsOpen } = useSelectSearch();

  const selectedLabels = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value
        .map((v) => items.find((item) => item.value === v)?.label)
        .filter(Boolean)
        .join(', ');
    }
    return items.find((item) => item.value === value)?.label;
  }, [items, value]);

  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className={cn('w-full justify-between', className)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedLabels || placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

export function SelectSearchContent({
  className,
  emptyMessage = 'No results found.',
}: {
  className?: string;
  emptyMessage?: string;
}) {
  const { items, onChange, value, multiple, onSearch } = useSelectSearch();
  const [search, setSearch] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  const filteredItems = React.useMemo(() => {
    // Only filter client-side if onSearch is not provided
    if (onSearch) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, onSearch]);

  const handleSearch = React.useCallback(
    async (value: string) => {
      setSearch(value);
      if (onSearch) {
        setIsSearching(true);
        try {
          await onSearch(value);
        } finally {
          setIsSearching(false);
        }
      }
    },
    [onSearch]
  );

  return (
    <PopoverContent
      className={cn('p-0 w-[--radix-popover-trigger-width]', className)}
      align="start"
      sideOffset={4}
    >
      <Command>
        <CommandInput
          placeholder="Search..."
          className="h-9"
          value={search}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? 'Searching...' : emptyMessage}
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {filteredItems.map((item) => {
              const isSelected = multiple
                ? Array.isArray(value) && value.includes(item.value)
                : item.value === value;

              return (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => onChange(item.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

export function SelectSearchRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isOpen, setIsOpen } = useSelectSearch();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className={className}>{children}</div>
    </Popover>
  );
}
