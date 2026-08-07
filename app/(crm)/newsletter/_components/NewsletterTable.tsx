'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Download, Search } from 'lucide-react';
import { normalizeSearch } from '@/utils/string';
import Loader from '@/components/Loader';
import {
  deleteNewsletterSubscriber,
  getNewsletterSubscribers,
  type NewsletterSubscriber,
} from '../newsletter.action';

export default function NewsletterTable() {
  const [list, setList] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getNewsletterSubscribers()
      .then((data) => setList(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = normalizeSearch(query);
    if (!q) return list;
    return list.filter((s) => normalizeSearch(s.email).includes(q));
  }, [list, query]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const { error } = await deleteNewsletterSubscriber(id);
    setDeletingId(null);
    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }
    setList((prev) => prev.filter((s) => s.id !== id));
    toast.success('Inscrit supprimé');
  };

  const exportCsv = () => {
    const header = 'email,date_inscription,source\n';
    const rows = list
      .map(
        (s) =>
          `${s.email},${new Date(s.created_at).toISOString()},${s.source ?? ''}`
      )
      .join('\n');
    const blob = new Blob([header + rows], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">
          Inscrits à la newsletter{' '}
          <span className="text-gray-500">({list.length})</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un email..."
              className="w-64 rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={exportCsv}
            disabled={list.length === 0}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            <Download className="size-4" /> Exporter (CSV)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Date d'inscription</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8">
                  <div className="flex justify-center">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Aucun inscrit
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(s.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.source ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deletingId === s.id}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
