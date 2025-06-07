import React, { useState } from 'react';
import { Button, Input } from './components/ui/button';

const generateRandomArray = (length = 6, min = 1, max = 9) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export default function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>(generateRandomArray());
  const [accessIndex, setAccessIndex] = useState<number | null>(null);
  const [insertValue, setInsertValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<number | null>(null);

  const handleAccess = (index: number) => setAccessIndex(index);

  const handleInsert = () => {
    const index = parseInt(insertIndex);
    const value = parseInt(insertValue);
    if (!isNaN(index) && !isNaN(value) && index >= 0 && index <= array.length) {
      const newArr = [...array];
      newArr.splice(index, 0, value);
      setArray(newArr);
    }
  };

  const handleSearch = () => {
    const val = parseInt(searchValue);
    if (!isNaN(val)) {
      const index = array.indexOf(val);
      setSearchResult(index >= 0 ? index : null);
    }
  };

  const handleReset = () => {
    setArray(generateRandomArray());
    setAccessIndex(null);
    setSearchResult(null);
  };

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Array Visualization</h1>
      <div className="flex space-x-2 overflow-auto">
        {array.map((value, index) => (
          <div
            key={index}
            onClick={() => handleAccess(index)}
            className={`cursor-pointer border-2 p-2 w-16 text-center rounded-md ${
              accessIndex === index ? 'bg-blue-200 border-blue-500' : 'border-gray-400'
            }`}
          >
            <div className="font-bold">{value}</div>
            <div className="text-sm text-gray-600">{index}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Input
            placeholder="Value"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
          />
          <Input
            placeholder="Index"
            value={insertIndex}
            onChange={(e) => setInsertIndex(e.target.value)}
          />
          <Button onClick={handleInsert}>Insert</Button>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Search Value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <Button onClick={handleReset}>Reset</Button>
      </div>
      <div className="mt-4">
        <h2 className="font-semibold">Array Properties</h2>
        <p>Current Array: [{array.join(', ')}]</p>
        <p>Length: {array.length}</p>
        <p>Memory Layout: Elements stored in contiguous memory locations</p>
        <h2 className="font-semibold mt-2">Time Complexity</h2>
        <ul className="list-disc pl-6">
          <li>Access: O(1)</li>
          <li>Search: O(n)</li>
          <li>Insertion: O(n)</li>
          <li>Deletion: O(n)</li>
        </ul>
        <h2 className="font-semibold mt-2">Operations</h2>
        <ul className="list-disc pl-6">
          <li>Access: Click any element to access it directly using its index</li>
          <li>Insert: Add a new element at a specific index</li>
          <li>Search: Find an element by checking each position sequentially</li>
          <li>Delete: (Not yet implemented) Remove an element and shift remaining elements</li>
        </ul>
        {accessIndex !== null && (
          <p className="mt-2">Accessed Value at Index {accessIndex}: {array[accessIndex]}</p>
        )}
        {searchResult !== null && (
          <p className="mt-2 text-green-600">Value found at index: {searchResult}</p>
        )}
        {searchResult === null && searchValue !== '' && (
          <p className="mt-2 text-red-600">Value not found</p>
        )}
      </div>
    </div>
  );
}
