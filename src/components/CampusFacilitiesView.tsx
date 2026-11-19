import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Compass,
  Cpu,
  Dumbbell,
  ExternalLink,
  Home,
  Music,
  Palette,
  Plus,
  Search,
} from 'lucide-react';
import { UNIVERSITIES_DATA } from '../data/majorsAndUniversities';
import {
  FACILITY_CATEGORIES,
  UNIVERSITY_EXTENDED_PROFILES,
} from '../data/universityFacilitiesAndLinks';
import { FacilityCategory, Region, UniversityItem } from '../types/game';

interface CampusFacilitiesViewProps {
  selectedUniversityId: string;
  onSelectUniversityId: (id: string) => void;
  compareIds: string[];
  onToggleCompare: (uniId: string) => void;
  onInspectUniversity: (uni: UniversityItem) => void;
}

const REGIONS: Region[] = [
  'All',
  'Australia',
  'UK & Europe',
  'Singapore & Asia',
  'Canada & New Zealand',
];

const getCategoryIcon = (category: FacilityCategory) => {
  switch (category) {
    case 'Music & Performing Arts':
      return Music;
    case 'STEM & Makerspaces':
      return Cpu;
    case 'Design & Media Studios':
      return Palette;
    case 'Libraries & 24/7 Hubs':
      return BookOpen;
    case 'Sports & Wellness':
      return Dumbbell;
  }
};

export const CampusFacilitiesView: React.FC<CampusFacilitiesViewProps> = ({
  selectedUniversityId,
  onSelectUniversityId,
  compareIds,
  onToggleCompare,
  onInspectUniversity,
}) => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | FacilityCategory>('All');
  const [onlyNonMajorMusic, setOnlyNonMajorMusic] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    return UNIVERSITIES_DATA.map((uni) => ({
      uni,
      profile: UNIVERSITY_EXTENDED_PROFILES[uni.id],
    })).filter(({ uni, profile }) => {
      if (!profile) return false;
      if (selectedUniversityId !== 'All' && uni.id !== selectedUniversityId) return false;
      if (regionFilter !== 'All' && uni.region !== regionFilter) return false;
      if (onlyNonMajorMusic && !profile.nonMajorMusicAccess) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystacks = [
          uni.name,
          uni.shortName,
          uni.city,
          uni.country,
          profile.facilitiesSummary,
          profile.musicHighlight,
          profile.dormMusicAndLounges,
          ...profile.spaces.map((s) => `${s.name} ${s.details} ${s.accessNote}`),
        ];
        if (!haystacks.some((h) => h.toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    });
  }, [selectedUniversityId, regionFilter, onlyNonMajorMusic, search]);

  const nonMajorMusicCount = useMemo(() => {
    return Object.values(UNIVERSITY_EXTENDED_PROFILES).filter((p) => p.nonMajorMusicAccess)
      .length;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50">
            Campus Facilities, Music Rooms &amp; Student Spaces
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            Explore real campus infrastructure across 18 universities — from acoustic piano &amp; band
            practice rooms and dorm lounges to robotics makerspaces, 24/7 libraries, and Olympic
            sports centers.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300 tabular-nums shrink-0">
          <div>
            <span className="block font-mono text-lg font-bold text-slate-900 dark:text-slate-50">
              {filteredItems.length}
            </span>
            <span>Campuses Shown</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
          <div>
            <span className="block font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
              {nonMajorMusicCount}/18
            </span>
            <span>Open Music Rooms</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full w-fit">
          <button
            type="button"
            onClick={() => setCategoryFilter('All')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'All'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>All Facilities (5 Areas)</span>
          </button>
          {FACILITY_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === category
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{category}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Region Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => {
                    setRegionFilter(region);
                    if (selectedUniversityId !== 'All') {
                      onSelectUniversityId('All');
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    regionFilter === region
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* University Picker */}
            <select
              aria-label="Filter by university"
              value={selectedUniversityId}
              onChange={(e) => onSelectUniversityId(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All 18 Universities</option>
              {UNIVERSITIES_DATA.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.shortName} ({uni.city})
                </option>
              ))}
            </select>

            {/* Open Music Access Toggle */}
            <button
              type="button"
              onClick={() => setOnlyNonMajorMusic((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
                onlyNonMajorMusic
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Music className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Practice Rooms Open to All Majors</span>
            </button>

            {selectedUniversityId !== 'All' && (
              <button
                type="button"
                onClick={() => onSelectUniversityId('All')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0"
              >
                Clear University Filter
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search piano, studio, robotics, pool..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            No matching campus facilities found
          </p>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Try clearing your search term or resetting the university/region filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setRegionFilter('All');
              setCategoryFilter('All');
              setOnlyNonMajorMusic(false);
              onSelectUniversityId('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Campus Facilities Cards */}
      <div className="space-y-6">
        {filteredItems.map(({ uni, profile }) => {
          const isCompared = compareIds.includes(uni.id);
          const visibleSpaces =
            categoryFilter === 'All'
              ? profile.spaces
              : profile.spaces.filter((s) => s.category === categoryFilter);
          const primaryDormSource = profile.dormSources[0];

          return (
            <article
              key={uni.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6"
            >
              {/* Card Top Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {uni.city}, {uni.country} · {uni.region} · Dorms: {uni.dormAvailability}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {uni.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {profile.facilitiesSummary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleCompare(uni.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                      isCompared
                        ? 'bg-slate-900 dark:bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isCompared ? (
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectUniversity(uni)}
                    className="px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors whitespace-nowrap shrink-0"
                  >
                    Courses, Dorms &amp; Links
                  </button>
                </div>
              </div>

              {/* Music & Dorm Lounge Highlights */}
              {(categoryFilter === 'All' || categoryFilter === 'Music & Performing Arts') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                        <Music
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                        <span>Music Practice Rooms &amp; Rehearsal Studios</span>
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                        {profile.nonMajorMusicAccess
                          ? 'Open to All Majors'
                          : 'Conservatory / Creative Priority'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {profile.musicHighlight}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                        <Home
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                        <span>Residential Hall Music &amp; Student Lounges</span>
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                        {uni.dormCostNote}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {profile.dormMusicAndLounges}
                    </p>
                  </div>
                </div>
              )}

              {/* Structured Facilities Grid */}
              <div
                className={`grid gap-4 ${
                  visibleSpaces.length === 1
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {visibleSpaces.map((space) => {
                  const Icon = getCategoryIcon(space.category);
                  return (
                    <div
                      key={`${uni.id}-${space.category}-${space.name}`}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/50 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <Icon
                            className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{space.category}</span>
                        </div>
                        <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {space.name}
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {space.details}
                        </p>
                      </div>
                      <p className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Access:
                        </span>{' '}
                        {space.accessNote}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Official External Resource Links Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                <a
                  href={profile.musicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Official Music &amp; Rehearsal Spaces</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href={profile.facilitiesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Campus Facilities Directory</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                {primaryDormSource && (
                  <a
                    href={primaryDormSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                  >
                    <span>{primaryDormSource.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
                <a
                  href={profile.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                >
                  <span>Official Courses &amp; Majors</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
