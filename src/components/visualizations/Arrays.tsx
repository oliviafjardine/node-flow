import { useState } from 'react';

const generateRandomArray = (length = 8, min = 1, max = 99) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export default function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>(generateRandomArray());
  const [accessIndex, setAccessIndex] = useState<number | null>(null);
  const [insertValue, setInsertValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number | null>(null);

  const handleAccess = (index: number) => {
    if (isSearching) return;
    setAccessIndex(index);
    setSearchResult(null);
    setTimeout(() => setAccessIndex(null), 2000);
  };

  const handleInsert = () => {
    const index = parseInt(insertIndex);
    const value = parseInt(insertValue);
    
    if (isNaN(index) || isNaN(value) || index < 0 || index > array.length) {
      return;
    }
    
    if (insertValue.trim() === '' || insertIndex.trim() === '') {
      return;
    }

    const newArr = [...array];
    newArr.splice(index, 0, value);
    setArray(newArr);
    setInsertValue('');
    setInsertIndex('');
    setAccessIndex(null);
    setSearchResult(null);
  };

  const handleDelete = (index: number) => {
    if (isSearching) return;
    const newArr = [...array];
    newArr.splice(index, 1);
    setArray(newArr);
    setAccessIndex(null);
    setSearchResult(null);
  };

  const animatedSearch = async () => {
    const val = parseInt(searchValue);
    if (isNaN(val) || searchValue.trim() === '') return;

    setIsSearching(true);
    setSearchResult(null);
    setAccessIndex(null);

    for (let i = 0; i < array.length; i++) {
      setCurrentSearchIndex(i);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (array[i] === val) {
        setSearchResult(i);
        setCurrentSearchIndex(null);
        setIsSearching(false);
        return;
      }
    }

    setCurrentSearchIndex(null);
    setIsSearching(false);
    setSearchResult(-1);
  };

  const handleReset = () => {
    setArray(generateRandomArray());
    setAccessIndex(null);
    setSearchResult(null);
    setCurrentSearchIndex(null);
    setIsSearching(false);
    setInsertValue('');
    setInsertIndex('');
    setSearchValue('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      if (action === 'insert') {
        handleInsert();
      } else if (action === 'search') {
        animatedSearch();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Array Visualization</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Arrays store elements in contiguous memory locations, allowing O(1) access by index but requiring O(n) time 
            for insertion and deletion due to element shifting.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Insert Controls */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Insert Element</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Value"
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'insert')}
                  disabled={isSearching}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <input
                  type="number"
                  placeholder="Index"
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'insert')}
                  disabled={isSearching}
                  className="w-24 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={handleInsert}
                  disabled={!insertValue.trim() || !insertIndex.trim() || isSearching || parseInt(insertIndex) < 0 || parseInt(insertIndex) > array.length}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Insert
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Index range: 0 to {array.length}
              </div>
            </div>

            {/* Search Controls */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Search Element</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Search Value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'search')}
                  disabled={isSearching}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={animatedSearch}
                  disabled={!searchValue.trim() || isSearching}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Linear search with animation
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              disabled={isSearching}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Reset Array
            </button>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {accessIndex !== null && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="text-purple-700 font-semibold">✓ Accessed:</span>
                <span className="text-purple-600 ml-2">Value {array[accessIndex]} at index {accessIndex}</span>
              </div>
            )}

            {searchResult !== null && (
              <div className={`p-4 border rounded-lg ${
                searchResult >= 0
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <span className={`font-semibold ${
                  searchResult >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {searchResult >= 0 ? '✓ Found:' : '✗ Not Found:'}
                </span>
                <span className={`ml-2 ${
                  searchResult >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {searchResult >= 0
                    ? `${searchValue} found at index ${searchResult}`
                    : `${searchValue} not found in array`
                  }
                </span>
              </div>
            )}

            {isSearching && currentSearchIndex !== null && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-700 font-semibold">🔍 Searching:</span>
                <span className="text-yellow-600 ml-2">
                  Checking index {currentSearchIndex} (value: {array[currentSearchIndex]})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Array Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-wrap gap-4 justify-center items-center min-h-[240px] p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            {array.length === 0 ? (
              <div className="text-center text-gray-500">
                <div className="text-2xl font-bold mb-2">Empty Array</div>
                <div className="text-lg">Insert elements to get started</div>
              </div>
            ) : (
              array.map((value, index) => (
                <div
                  key={`${index}-${value}-${array.length}`}
                  className={`
                    relative group cursor-pointer select-none transition-all duration-300
                    ${accessIndex === index
                      ? 'transform scale-110'
                      : currentSearchIndex === index
                      ? 'transform scale-110'
                      : searchResult === index
                      ? 'transform scale-110'
                      : 'hover:scale-105'
                    }
                    ${isSearching && currentSearchIndex !== index ? 'opacity-50' : ''}
                  `}
                  onClick={() => handleAccess(index)}
                  style={{ 
                    cursor: isSearching ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div className={`
                    w-20 h-20 border-3 rounded-xl flex flex-col items-center justify-center
                    transition-all duration-300 relative
                    ${accessIndex === index
                      ? 'bg-purple-100 border-purple-400 text-purple-800 shadow-lg'
                      : currentSearchIndex === index
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-800 shadow-md'
                      : searchResult === index
                      ? 'bg-green-100 border-green-400 text-green-800 shadow-lg'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:shadow-md'
                    }
                  `}>
                    <span className="font-bold text-lg">{value}</span>
                    <span className="text-xs text-gray-500 font-medium">[{index}]</span>

                    {/* Delete button */}
                    {!isSearching && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center shadow-md"
                        title="Delete element"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Array Info */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center gap-8 text-lg">
              <div className="text-gray-700">
                Length: <span className="font-bold text-purple-600">{array.length}</span>
              </div>
              <div className="text-gray-700">
                Memory: <span className="font-bold text-purple-600">{array.length * 4} bytes</span>
              </div>
              <div className="text-gray-700">
                Max Index: <span className="font-bold text-purple-600">{array.length - 1}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 max-w-2xl mx-auto">
              Contiguous memory allocation • O(1) index-based access • Fixed-size elements
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Access:</strong> O(1) - Constant time by index</div>
                <div><strong>Search:</strong> O(n) - Linear search through elements</div>
                <div><strong>Insert/Delete:</strong> O(n) - Requires shifting elements</div>
                <div><strong>Space:</strong> O(n) - Linear space for n elements</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Array Operations</h3>
              <div className="text-sm text-purple-700 space-y-1 text-left">
                <div>• <strong>Access:</strong> Click any element to access it directly using its index</div>
                <div>• <strong>Insert:</strong> Add elements at specific positions (elements shift right)</div>
                <div>• <strong>Search:</strong> Find elements using animated linear search</div>
                <div>• <strong>Delete:</strong> Remove elements by clicking the × button (elements shift left)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}