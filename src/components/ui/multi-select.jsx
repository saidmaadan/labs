"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export function MultiSelect({
  selected = [],
  options = [],
  onChange,
  placeholder = "Select items...",
  emptyText = "No items found.",
  disabled = false,
}) {
  const inputRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((item) => {
    const currentSelected = Array.isArray(selected) ? selected : [];
    onChange(currentSelected.filter((i) => i.id !== item.id));
  }, [onChange, selected]);

  const handleSelect = React.useCallback((item) => {
    setInputValue("");
    const currentSelected = Array.isArray(selected) ? selected : [];
    if (currentSelected.some((i) => i.id === item.id)) {
      onChange(currentSelected.filter((i) => i.id !== item.id));
    } else {
      onChange([...currentSelected, item]);
    }
  }, [onChange, selected]);

  const handleKeyDown = React.useCallback((e) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected && selected.length > 0) {
          const currentSelected = Array.isArray(selected) ? selected : [];
          onChange(currentSelected.slice(0, -1));
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, [onChange, selected]);

  const currentOptions = Array.isArray(options) ? options : [];
  const currentSelected = Array.isArray(selected) ? selected : [];
  
  const filteredOptions = currentOptions.filter(option => 
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {currentSelected.map((item) => (
            <Badge key={item.id} variant="secondary">
              {item.name}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(item);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(item)}
                disabled={disabled}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            disabled={disabled}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && filteredOptions.length > 0 && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-[200px]">
              {filteredOptions.map((option) => {
                const isSelected = currentSelected.some((item) => item.id === option.id);
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => handleSelect(option)}
                    className={`cursor-pointer ${isSelected ? "bg-secondary" : ""}`}
                  >
                    {option.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  );
}
