import React, { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {

  return (
    <div className="border w-80 flex items-center px-3 bg-slate-100 rounded">
      <input
        type="text"
        placeholder="Serach Notes"
        className="w-full text-xs bg-transparent py-2 px-3 outline-none "
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          className="text-slate-400 cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
