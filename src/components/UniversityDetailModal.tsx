import React, { useEffect } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Home,
  MapPin,
  Music,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import { MAJORS_DATA } from '../data/majorsAndUniversities';
import { getUniversityExtendedProfile } from '../data/universityFacilitiesAndLinks';
import { AdmissionStatus, CredentialType, UniversityItem } from '../types/game';
import {
  CREDENTIAL_CONFIGS,
  formatAtarBandInCredential,
} from '../utils/credentialConverter';

interface UniversityDetailModalProps {
  university: UniversityItem | null;
  credentialType?: CredentialType;
  matchPercent?: number;
  admissionStatus?: AdmissionStatus;
  fitReasons?: string[];
  isCompared: boolean;
  onToggleCompare: (uniId: string) => void;
  onExploreFacilities?: (universityId: string) => void;
  onClose: () => void;
}

export const UniversityDetailModal: React.FC<UniversityDetailModalProps> = ({
  university,
  credentialType = 'ATAR',
  matchPercent,
  admissionStatus,
  fitReasons,
  isCompared,
  onToggleCompare,
  onExploreFacilities,
  onClose,
}) => {
  useEffect(() => {
    if (!university) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [university, onClose]);

  if (!university) return null;

  const credShort = CREDENTIAL_CONFIGS[credentialType].shortLabel;
  const extended = getUniversityExtendedProfile(university.id);

  const offeredMajors = university.majorIds
    .map((id) => MAJORS_DATA.find((m) => m.id === id))
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="uni-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {university.city}, {university.country}
              </span>
              <span aria-hidden="true">·</span>
              <span>{university.region}</span>
              <span aria-hidden="true">·</span>
              <span>{university.type}</span>
              {matchPercent !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                    {matchPercent}% Match
                  </span>
                </>
              )}
            </div>
            <h2
              id="uni-modal-title"
              className="mt-1.5 font-display text-2xl font-bold text-slate-900 dark:text-slate-50"
            >
              {university.name}
            </h2>
            {extended && (
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={extended.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Official Admissions &amp; Courses</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                {onExploreFacilities && (
                  <button
                    type="button"
                    onClick={() => onExploreFacilities(university.id)}
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                  >
                    <Music className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Explore Music Rooms &amp; Facilities →</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close university details"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Numeric Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {credShort} Entry Band
            </p>
            <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {formatAtarBandInCredential(credentialType, university.minAtar, university.maxAtar)}
            </p>
            {credentialType !== 'ATAR' && (
              <p className="mt-0.5 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                ATAR: {university.minAtar.toFixed(1)} – {university.maxAtar.toFixed(1)}
              </p>
            )}
            {admissionStatus && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {admissionStatus === 'Safe' && (
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                )}
                {admissionStatus === 'Target' && (
                  <Target
                    className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                )}
                {admissionStatus === 'Reach' && (
                  <TrendingUp
                    className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400"
                    aria-hidden="true"
                  />
                )}
                <span>Tier: {admissionStatus}</span>
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Indicative Annual Tuition
            </p>
            <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              ~${university.tuitionApproxUsdK}k USD/yr
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {university.tuitionNote}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              English Requirement
            </p>
            <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-slate-100">
              IELTS {university.ieltsMin}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Or accepted equivalent (PTE/TOEFL)
            </p>
          </div>
        </div>

        {/* Campus Dormitory & Housing Card + Verified Sources */}
        <div className="py-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1.5">
                <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>On-Campus Dorms &amp; Student Housing</span>
              </h3>
              <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 tabular-nums">
                {university.dormCostNote}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Status: {university.dormAvailability} · Dorm Score {university.dormScore}/100
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {university.dormHighlights}
            </p>

            {extended && extended.dormSources.length > 0 && (
              <div className="pt-3 mt-2 border-t border-slate-200/70 dark:border-slate-700/70 space-y-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Official Dorm &amp; Housing Resources
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {extended.dormSources.map((src) => (
                    <a
                      key={src.url}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 group-hover:underline truncate">
                          {src.label}
                        </p>
                        {src.note && (
                          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {src.note}
                          </p>
                        )}
                      </div>
                      <ExternalLink
                        className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personalized Reasons */}
        {fitReasons && fitReasons.length > 0 && (
          <div className="py-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 mb-2.5">
              Why this university fits your profile
            </h3>
            <ul className="space-y-2">
              {fitReasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2"
                >
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    0{idx + 1}.
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Campus Facilities & Music Rooms Spotlight */}
        {extended && (
          <div className="py-5 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1.5">
                <Music className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>Music Rooms &amp; Campus Facilities</span>
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <a
                  href={extended.musicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Music &amp; Arts Rooms</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                {onExploreFacilities && (
                  <button
                    type="button"
                    onClick={() => onExploreFacilities(university.id)}
                    className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                  >
                    Full Campus Tour →
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {extended.musicHighlight}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                In Dorms &amp; Lounges:
              </span>{' '}
              {extended.dormMusicAndLounges}
            </p>
          </div>
        )}

        {/* Campus Highlights & Credentials */}
        <div className="py-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              University Highlights
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-700 dark:text-slate-300">
              {university.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Campus Culture
              </h4>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {university.campusVibe}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                International Scholarships
              </h4>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {university.scholarshipNote}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                SAT &amp; International Credentials
              </h4>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {university.satNote}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Admissions Tip
              </h4>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {university.admissionTip}
              </p>
            </div>
          </div>
        </div>

        {/* Offered Majors List with Direct Official Program URLs */}
        <div className="py-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
              Featured Degree Programs (Official Pages)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click any major to open {university.shortName}’s official page
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {offeredMajors.map((m) => {
              if (!m) return null;
              const officialMajorUrl =
                extended?.majorUrls[m.id] ?? extended?.officialPortalUrl ?? '#';
              return (
                <a
                  key={m.id}
                  href={officialMajorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {m.name}
                    </p>
                    <ExternalLink
                      className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {formatAtarBandInCredential(credentialType, m.minAtar, m.maxAtar)}
                    </p>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                      Official Course →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onToggleCompare(university.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              isCompared
                ? 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isCompared ? 'Added to Comparison' : 'Add to Compare'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

