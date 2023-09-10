"use client";

import { React, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export const SearchForm = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };
  return (
    <form>
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className=" w-5" />
        </div>
        <input
          type="text"
          placeholder="Search Pokémon by name"
          value={searchQuery}
          onChange={handleInputChange}
          className="searchForm"
        />
      </div>
    </form>
  );
};
