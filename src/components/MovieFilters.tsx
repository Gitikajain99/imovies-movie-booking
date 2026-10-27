import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface MovieFiltersProps {
  searchQuery: string;
  selectedGenre: string;
  selectedLanguage: string;
  selectedFormat: string;
  selectedStatus: string;
  onSearchChange: (q: string) => void;
  onGenreChange: (genre: string) => void;
  onLanguageChange: (lang: string) => void;
  onFormatChange: (fmt: string) => void;
  onStatusChange: (status: string) => void;
  onResetFilters: () => void;
}

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  searchQuery,
  selectedGenre,
  selectedLanguage,
  selectedFormat,
  selectedStatus,
  onSearchChange,
  onGenreChange,
  onLanguageChange,
  onFormatChange,
  onStatusChange,
  onResetFilters,
}) => {
  const genres = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Thriller', 'Drama', 'Animation'];
  const languages = ['All', 'English', 'Spanish', 'Hindi', 'French'];
  const formats = ['All', 'IMAX 3D', 'Dolby Atmos', '4DX', 'Standard 2D'];

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedGenre !== 'All' || 
    selectedLanguage !== 'All' || 
    selectedFormat !== 'All';

  return (
    <div className="w-full space-y-4">
      {/* Top Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Status Segmented Switch: Now Showing vs Coming Soon */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => onStatusChange('now_showing')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              selectedStatus === 'now_showing'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => onStatusChange('coming_soon')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              selectedStatus === 'coming_soon'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Coming Soon
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search movies, directors, or cast..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns for Language & Format */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400/80 cursor-pointer"
          >
            <option value="All">All Languages</option>
            {languages.filter(l => l !== 'All').map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          {/* Format Selector */}
          <select
            value={selectedFormat}
            onChange={(e) => onFormatChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400/80 cursor-pointer"
          >
            <option value="All">All Formats</option>
            {formats.filter(f => f !== 'All').map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-2 text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Genre Filter Bar (Interactive Segmented buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-500 font-medium mr-1 flex items-center gap-1 shrink-0">
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          Genre:
        </span>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreChange(genre)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedGenre === genre
                ? 'bg-amber-400/10 border border-amber-400/40 text-amber-300'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};
