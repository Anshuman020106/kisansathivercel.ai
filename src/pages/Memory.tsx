/**
 * Memory Page — "kisansathi.ai remembers"
 * Timeline view of farm memories matching the Stitch memory_history screen.
 */

import { useState, useEffect } from 'react';
import { getRecentMemories, deleteMemory } from '../api/memoryContext';
import type { MemoryItem } from '../types';

export default function Memory() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  useEffect(() => {
    getRecentMemories().then(setMemories);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteMemory(id);
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-container-margin py-8 md:py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-display-lg text-display-lg text-primary mb-2">kisansathi.ai remembers</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Here is a record of our recent conversations and observations.
        </p>
      </header>

      {/* Timeline */}
      <div className="space-y-12">
        {memories.map((memory, index) => {
          const isFirst = index === 0;
          const isLast = index === memories.length - 1;

          return (
            <div key={memory.id} className="relative pl-8 md:pl-12">
              {/* Timeline connector line (not on last item) */}
              {!isLast && (
                <div className="absolute left-0 top-2 bottom-0 w-px border-l-2 border-dashed border-secondary-fixed-dim -ml-[1px]" />
              )}
              
              {/* Timeline dot */}
              <div
                className={`absolute left-[-5px] top-2 w-3 h-3 rounded-full ring-4 ring-background ${
                  isFirst ? 'bg-primary' : 'bg-secondary-fixed-dim'
                }`}
              />

              {/* Time label */}
              <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-4">
                {memory.timeLabel}
              </h2>

              {/* Memory card */}
              <div
                className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container hover:shadow-lg transition-shadow"
                style={{ boxShadow: '0 4px 20px rgba(39,111,37,0.08)' }}
              >
                <p className="font-body-lg text-body-lg text-on-surface mb-6">{memory.text}</p>
                <div className="flex gap-3">
                  <button className="h-touch-target-min px-6 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg rounded-full flex items-center gap-2 hover:bg-inverse-primary transition-colors active:scale-95 duration-150">
                    <span className="material-symbols-outlined">edit</span>
                    Correct
                  </button>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="h-touch-target-min px-6 border border-outline text-on-surface-variant font-label-lg text-label-lg rounded-full flex items-center gap-2 hover:bg-error-container hover:text-on-error-container hover:border-error-container transition-colors active:scale-95 duration-150"
                  >
                    <span className="material-symbols-outlined">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {memories.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-outline text-[48px] mb-4 block">psychology</span>
          <p className="font-body-lg text-body-lg text-on-surface-variant">No memories yet. Start a conversation!</p>
        </div>
      )}
    </div>
  );
}


