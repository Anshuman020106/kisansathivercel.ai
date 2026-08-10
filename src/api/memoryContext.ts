/**
 * Mock Memory & Context API Layer
 * 
 * This module provides mock implementations that will later be replaced
 * with real Qdrant-backed API calls. The frontend should NEVER contain
 * Qdrant credentials or direct database access.
 * 
 * Future integration points:
 * - getFarmContext()     → Backend API → Qdrant collection
 * - getRelevantMemory()  → Backend API → Qdrant semantic search
 * - getRecentMemories()  → Backend API → Qdrant filtered query
 * - saveMemory()         → Backend API → Qdrant upsert
 * - deleteMemory()       → Backend API → Qdrant delete
 */

import type { FarmContext, MemoryItem } from '../types';

// ===== Mock Farm Context =====

const MOCK_FARM_CONTEXT: FarmContext = {
  crop: 'Wheat',
  cropAge: 42,
  location: 'Gautam Buddha Nagar',
  lastIrrigation: '3 days ago',
  farmerName: 'Ansh',
};

export async function getFarmContext(): Promise<FarmContext> {
  // TODO: Replace with real API call to backend
  // e.g., const res = await fetch('/api/farm/context'); return res.json();
  return MOCK_FARM_CONTEXT;
}

// ===== Mock Memory =====

let MOCK_MEMORIES: MemoryItem[] = [
  {
    id: '1',
    text: 'Yellow leaves mentioned in wheat crop',
    timestamp: new Date().toISOString(),
    timeLabel: 'Today',
  },
  {
    id: '2',
    text: 'Irrigation completed',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    timeLabel: '3 Days Ago',
  },
  {
    id: '3',
    text: 'Fertilizer applied',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    timeLabel: '1 Week Ago',
  },
];

export async function getRelevantMemory(query: string): Promise<MemoryItem | null> {
  // TODO: Replace with real API call using semantic search
  // e.g., const res = await fetch(`/api/memory/search?q=${encodeURIComponent(query)}`);
  void query;
  return MOCK_MEMORIES[0] ?? null;
}

export async function getRecentMemories(): Promise<MemoryItem[]> {
  // TODO: Replace with real API call
  // e.g., const res = await fetch('/api/memory/recent');
  return [...MOCK_MEMORIES];
}

export async function saveMemory(text: string): Promise<MemoryItem> {
  // TODO: Replace with real API call
  // e.g., const res = await fetch('/api/memory', { method: 'POST', body: JSON.stringify({ text }) });
  const item: MemoryItem = {
    id: String(Date.now()),
    text,
    timestamp: new Date().toISOString(),
    timeLabel: 'Just now',
  };
  MOCK_MEMORIES = [item, ...MOCK_MEMORIES];
  return item;
}

export async function deleteMemory(id: string): Promise<void> {
  // TODO: Replace with real API call
  // e.g., await fetch(`/api/memory/${id}`, { method: 'DELETE' });
  MOCK_MEMORIES = MOCK_MEMORIES.filter(m => m.id !== id);
}
