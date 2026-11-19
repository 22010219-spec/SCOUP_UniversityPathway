import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  MessageSquare,
  RotateCcw,
  Send,
  User,
} from 'lucide-react';
import { Region, RiasecVector, SubjectTrack } from '../types/game';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface CareerMentorChatProps {
  riasecScores: RiasecVector;
  topCode: string;
  archetypeTitle: string;
  targetAtar: number;
  credentialDisplay: string;
  subjectTrack: SubjectTrack;
  preferredRegion: Region;
  selectedMajorId: string;
  selectedMajorName: string;
  selectedIndustry: string;
  demandGrowthPct: number;
  shortageLevel: string;
  driverTraitsSummary: string;
}

function renderFormattedMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g).map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-semibold text-slate-900 dark:text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <p key={idx} className="pl-3.5 relative leading-relaxed">
          <span
            className="absolute left-0 text-blue-600 dark:text-blue-400 font-semibold"
            aria-hidden="true"
          >
            •
          </span>
          <span>
            {trimmed
              .slice(2)
              .split(/(\*\*[^*]+\*\*)/g)
              .map((part, pIdx) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong
                    key={pIdx}
                    className="font-semibold text-slate-900 dark:text-slate-100"
                  >
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  part
                )
              )}
          </span>
        </p>
      );
    }

    return (
      <p key={idx} className="leading-relaxed">
        {parts}
      </p>
    );
  });
}

export const CareerMentorChat: React.FC<CareerMentorChatProps> = ({
  riasecScores,
  topCode,
  archetypeTitle,
  targetAtar,
  credentialDisplay,
  subjectTrack,
  preferredRegion,
  selectedMajorId,
  selectedMajorName,
  selectedIndustry,
  demandGrowthPct,
  shortageLevel,
  driverTraitsSummary,
}) => {
  const [threadsByMajor, setThreadsByMajor] = useState<Record<string, ChatMessage[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const messages = threadsByMajor[selectedMajorId] ?? [];

  useEffect(() => {
    setErrorMsg(null);
  }, [selectedMajorId]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages.length, isSending]);

  const starterPrompts = [
    `How can I leverage my ${topCode} strengths to break into ${selectedIndustry}?`,
    `What skill gaps should I close now to thrive in ${selectedMajorName}?`,
    `With a ${credentialDisplay} target and ${subjectTrack}, what high school projects should I build?`,
  ];

  const sendMessage = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText || isSending) return;

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: cleanText,
    };

    const nextHistory = [...messages, userMessage];
    setThreadsByMajor((prev) => ({
      ...prev,
      [selectedMajorId]: nextHistory,
    }));
    setInputValue('');
    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/career-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riasecScores,
          topCode,
          archetypeTitle,
          targetAtar,
          credentialDisplay,
          subjectTrack,
          preferredRegion,
          selectedMajorName,
          selectedIndustry,
          demandGrowthPct,
          shortageLevel,
          driverTraitsSummary,
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Unable to get a response from Career Mentor.');
      }

      const replyMessage: ChatMessage = {
        id: `m_${Date.now()}`,
        role: 'model',
        text: data.reply,
      };

      setThreadsByMajor((prev) => ({
        ...prev,
        [selectedMajorId]: [...nextHistory, replyMessage],
      }));
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'An error occurred connecting to Career Mentor.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleResetThread = () => {
    setThreadsByMajor((prev) => {
      const next = { ...prev };
      delete next[selectedMajorId];
      return next;
    });
    setErrorMsg(null);
  };

  return (
    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 p-5 sm:p-6 space-y-4">
        {/* Mentor Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>Career Mentor · Bridging RIASEC Strengths &amp; Industry Demand</span>
            </div>
            <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              Ask Your Career Mentor About {selectedMajorName}
            </h3>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
              Synced profile: <strong className="text-slate-900 dark:text-slate-100">{topCode}</strong> ·{' '}
              <span className="font-mono font-semibold tabular-nums">
                {credentialDisplay} (≈ {targetAtar.toFixed(2)} ATAR)
              </span>{' '}
              · Industry Growth{' '}
              <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                +{demandGrowthPct}%
              </span>
            </p>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleResetThread}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>New Chat</span>
            </button>
          )}
        </div>

        {/* Starter Prompts when thread is empty */}
        {messages.length === 0 && (
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pick a quick prompt or ask your own question below:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {starterPrompts.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isSending}
                  onClick={() => sendMessage(promptText)}
                  className="text-left p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/40 text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed transition-colors disabled:opacity-50"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat History Thread */}
        {messages.length > 0 && (
          <div
            ref={scrollContainerRef}
            className="max-h-[360px] overflow-y-auto space-y-3 pr-1"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-1.5'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="leading-relaxed">{msg.text}</p>
                  ) : (
                    renderFormattedMessage(msg.text)
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Career Mentor is analyzing your RIASEC fit and industry gaps...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center justify-between gap-3 text-xs text-red-800 dark:text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
            {messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <button
                type="button"
                onClick={() => sendMessage(messages[messages.length - 1].text)}
                className="px-2.5 py-1 font-semibold bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSending}
            placeholder={`Ask Mentor how to prepare for ${selectedMajorName}...`}
            className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
