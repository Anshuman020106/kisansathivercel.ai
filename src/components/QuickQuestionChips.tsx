/**
 * QuickQuestionChips — Suggestion chips from the Stitch idle state
 */

interface QuickQuestionChipsProps {
  onSelect: (question: string) => void;
}

const QUESTIONS = [
  { icon: 'psychiatry', text: 'Meri fasal kaisi hai?' },
  { icon: 'water_drop', text: 'Aaj paani doon?' },
  { icon: 'history', text: 'Kal kya baat hui thi?' },
];

export default function QuickQuestionChips({ onSelect }: QuickQuestionChipsProps) {
  return (
    <div className="w-full flex flex-wrap justify-center gap-unit">
      {QUESTIONS.map((q) => (
        <button
          key={q.text}
          onClick={() => onSelect(q.text)}
          className="px-5 py-3 rounded-full bg-surface-container-high text-on-surface-variant font-label-lg text-label-lg hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">{q.icon}</span>
          {q.text}
        </button>
      ))}
    </div>
  );
}
