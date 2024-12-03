"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  ChevronsUpDownIcon,
  CircleCheck,
  SearchIcon,
  XIcon,
} from "lucide-react"
import Image, { StaticImageData } from "next/image"

interface Item {
  id: number
  title: string
  icon: StaticImageData
}

interface SearchComboboxProps {
  options: Item[]
  values: number[]
  onChange: (_values: number[]) => void
  placeholder?: string
}

export function SearchBandsCombobox({
  options,
  values,
  onChange,
  placeholder,
}: SearchComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const filteredItems = options.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const selectedOptions = options.filter((option) =>
      values.includes(option.id)
    )
    setSelectedItems(selectedOptions)
  }, [options, values])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  const handleInputToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleItemSelect = (item: Item) => {
    const newSelectedItems = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    )
      ? selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      : [...selectedItems, item]

    setSelectedItems(newSelectedItems)
    onChange(newSelectedItems.map((item) => item.id))

    // Ensure closure after all updates
    setSearch("")
    setTimeout(() => setIsOpen(false), 0)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      } else {
        setActiveIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : prev
        )
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      handleItemSelect(filteredItems[activeIndex])
    } else if (e.key === "Escape") {
      setIsOpen(false)
    } else if (e.key === "Tab" && isOpen) {
      e.preventDefault()
    }
  }

  const clearSearch = () => {
    setSearch("")
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (isOpen && listRef.current && activeIndex >= 0) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement
      if (activeItem && typeof activeItem.scrollIntoView === "function") {
        activeItem.scrollIntoView({ block: "nearest" })
      }
    }
  }, [activeIndex, isOpen])

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
            value={search}
            onChange={handleInputChange}
            onMouseDown={handleInputToggle}
            className="w-full rounded-full bg-white px-12 py-3 border-2 border-secondary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            placeholder={placeholder}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="combobox-items"
          />
          {search && (
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
            {filteredItems.length === 0 ? (
              <li className="px-4 py-2 text-secondary">No results found.</li>
            ) : (
              filteredItems.map((item, index) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={selectedItems.some(
                    (selectedItem) => selectedItem.id === item.id
                  )}
                  className={`flex items-center px-4 py-2 cursor-pointer ${
                    index === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    handleItemSelect(item)
                  }}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-md object-cover mr-2"
                  />
                  <span>{item.title}</span>
                  {selectedItems.some(
                    (selectedItem) => selectedItem.id === item.id
                  ) && (
                    <span className="ml-auto">
                      <CircleCheck className="h-5 w-5 text-primary" />
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
