import React, { useEffect } from 'react';
import { ExternalLink, Trash2, X } from 'lucide-react';
import { MAJORS_DATA, UNIVERSITIES_DATA } from '../data/majorsAndUniversities';
import { getUniversityExtendedProfile } from '../data/universityFacilitiesAndLinks';
import { CredentialType } from '../types/game';
import {
  CREDENTIAL_CONFIGS,
  formatAtarBandInCredential,
} from '../utils/credentialConverter';
import { evaluateAtarStatus } from '../utils/matchingEngine';

interface ComparisonDrawerProps {
  isOpen: boolean;
  compareIds: string[];
  targetAtar?: number;
  credentialType?: CredentialType;
  onRemoveId: (id: string) => void;
  onClearAll: () => void;
  onExploreFacilities?: (universityId: string) => void;
  onClose: () => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  isOpen,
  compareIds,
  targetAtar,
  credentialType = 'ATAR',
  onRemoveId,
  onClearAll,
  onExploreFacilities,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const credShort = CREDENTIAL_CONFIGS[credentialType].shortLabel;

  const selectedUniversities = compareIds
    .map((id) => UNIVERSITIES_DATA.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[88vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2
              id="compare-modal-title"
              className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50"
            >
              Compare International Universities ({selectedUniversities.length}/3)
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Place up to 3 universities side-by-side to compare {credShort} cutoffs, SAT policy,
              on-campus dorms, tuition, and scholarships.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedUniversities.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close comparison modal"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {selectedUniversities.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              No universities added for comparison yet
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Click "Compare" on any university card in your Results or the Universities directory
              to compare them side by side.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500 dark:text-slate-400 w-44">
                    Criteria
                  </th>
                  {selectedUniversities.map((uni) => (
                    <th key={uni.id} className="py-3 px-4 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                            {uni.shortName}
                          </p>
                          <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                            {uni.city}, {uni.country}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveId(uni.id)}
                          aria-label={`Remove ${uni.shortName} from comparison`}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    {credShort} Entry Band
                  </td>
                  {selectedUniversities.map((uni) => (
                    <td
                      key={uni.id}
                      className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums"
                    >
                      {formatAtarBandInCredential(credentialType, uni.minAtar, uni.maxAtar)}
                      {credentialType !== 'ATAR' && (
                        <span className="block text-xs font-mono font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                          ATAR: {uni.minAtar.toFixed(1)} – {uni.maxAtar.toFixed(1)}
                        </span>
                      )}
                      {targetAtar !== undefined && (
                        <span className="block text-xs font-sans font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                          Tier: {evaluateAtarStatus(targetAtar, uni.minAtar, uni.maxAtar)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    SAT / Credentials
                  </td>
                  {selectedUniversities.map((uni) => (
                    <td
                      key={uni.id}
                      className="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      {uni.satNote}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    On-Campus Dorms
                  </td>
                  {selectedUniversities.map((uni) => (
                    <td
                      key={uni.id}
                      className="py-3.5 px-4 text-slate-900 dark:text-slate-100 tabular-nums"
                    >
                      <strong className="text-xs font-semibold block">
                        {uni.dormAvailability}
                      </strong>
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400 block mt-0.5">
                        {uni.dormCostNote}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        Dorm Score: {uni.dormScore}/100
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    Estimated Tuition
                  </td>
                  {selectedUniversities.map((uni) => (
                    <td
                      key={uni.id}
                      className="py-3.5 px-4 text-slate-900 dark:text-slate-100 tabular-nums"
                    >
                      <strong className="font-mono">~${uni.tuitionApproxUsdK}k USD/yr</strong>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {uni.tuitionNote}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    IELTS Requirement
                  </td>
                  {selectedUniversities.map((uni) => (
                    <td
                      key={uni.id}
                      className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300"
                    >
                      {uni.ieltsMin}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    Learning Profile
                  </td>
                  {selectedUniversities.map((uni) => (
                    <td
                      key={uni.id}
                      className="py-3.5 px-4 text-slate-700 dark:text-slate-300 tabular-nums"
                    >
                      Hands-on:{' '}
                      <strong className="text-slate-900 dark:text-slate-100">
                        {uni.practiceScore}/100
                      </strong>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Campus Energy: {uni.campusEnergyScore}/100
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    Flagship Majors
                  </td>
                  {selectedUniversities.map((uni) => {
                    const names = uni.majorIds
                      .slice(0, 3)
                      .map((id) => MAJORS_DATA.find((m) => m.id === id)?.name)
                      .filter(Boolean)
                      .join(', ');
                    return (
                      <td
                        key={uni.id}
                        className="py-3.5 px-4 text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        {names}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    Key Scholarships
                  </td>
                  {selectedUniversities.map((uni) => (
                    <td
                      key={uni.id}
                      className="py-3.5 px-4 text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                      {uni.scholarshipNote}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    Music Rooms &amp; Facilities
                  </td>
                  {selectedUniversities.map((uni) => {
                    const ext = getUniversityExtendedProfile(uni.id);
                    return (
                      <td
                        key={uni.id}
                        className="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        {ext ? (
                          <div className="space-y-1.5">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {ext.nonMajorMusicAccess
                                ? 'Practice rooms open to all majors'
                                : 'Conservatory / studio priority'}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 line-clamp-3">
                              {ext.musicHighlight}
                            </p>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    Official Portals &amp; Dorms
                  </td>
                  {selectedUniversities.map((uni) => {
                    const ext = getUniversityExtendedProfile(uni.id);
                    if (!ext) return <td key={uni.id} className="py-3.5 px-4">—</td>;
                    const primaryDorm = ext.dormSources[0];
                    return (
                      <td key={uni.id} className="py-3.5 px-4 text-xs">
                        <div className="flex flex-col items-start gap-1.5">
                          <a
                            href={ext.officialPortalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span>Courses &amp; Programs</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                          {primaryDorm && (
                            <a
                              href={primaryDorm.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <span>Dorm Housing Portal</span>
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          )}
                          <a
                            href={ext.musicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 hover:underline"
                          >
                            <span>Music Practice Spaces</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                          {onExploreFacilities && (
                            <button
                              type="button"
                              onClick={() => onExploreFacilities(uni.id)}
                              className="mt-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                            >
                              View All Facilities →
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
