// components/XpertNotes.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/date';
import { Textarea } from '@/components/ui/textarea';
import {
  createNote,
  getNotes,
  deleteNote,
  updateNote,
} from '../../../../functions/xperts-notes';
import { toast } from 'sonner';
import type { DBXpertNote } from '@/types/typesDb';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type XpertNotesProps = {
  xpertId: string;
};

export function XpertNotes({ xpertId }: XpertNotesProps) {
  const [notes, setNotes] = useState<DBXpertNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    id: number;
    content: string;
  } | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  // Charger les notes
  const fetchNotes = async () => {
    const { data, error } = await getNotes(xpertId);
    if (error) {
      toast.error('Erreur lors du chargement des notes');
      return;
    }
    if (data) {
      setNotes(data);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [xpertId]);

  // Ajouter une note
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsLoading(true);
    const { error } = await createNote(xpertId, newNote);
    setIsLoading(false);

    if (error) {
      toast.error("Erreur lors de l'ajout de la note");
      return;
    }

    toast.success('Note ajoutée avec succès');
    setNewNote('');
    fetchNotes();
  };

  // Modifier une note
  const handleUpdate = async (noteId: number, content: string) => {
    const { error } = await updateNote(noteId, content);
    if (error) {
      toast.error('Erreur lors de la modification de la note');
      return;
    }
    toast.success('Note modifiée avec succès');
    setEditingNote(null);
    fetchNotes();
  };

  // Supprimer une note
  const handleDelete = async (noteId: number) => {
    const { error } = await deleteNote(noteId);
    if (error) {
      toast.error('Erreur lors de la suppression de la note');
      return;
    }
    await fetchNotes();
    toast.success('Note supprimée avec succès');
    setNoteToDelete(null);
  };

  return (
    <div className="flex flex-col gap-3 py-4">
      Liste des notes existantes
      <div className="flex max-h-[500px] flex-col gap-2 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="rounded-lg bg-gray-100 p-4">
            {editingNote?.id === note.id ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  value={editingNote.content}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, content: e.target.value })
                  }
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(note.id, editingNote.content)}
                    size="sm"
                    className="text-white"
                  >
                    Sauvegarder
                  </Button>
                  <Button
                    onClick={() => setEditingNote(null)}
                    variant="outline"
                    size="sm"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {note.author?.firstname} {note.author?.lastname}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      le {formatDate(note.created_at)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setEditingNote({ id: note.id, content: note.content })
                      }
                      variant="secondary"
                      size="sm"
                      className="size-10 rounded-full"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="size-10 rounded-full"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. La note sera
                            définitivement supprimée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="text-white"
                            onClick={() => handleDelete(note.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700">{note.content}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Formulaire d'ajout de note */}
      <form onSubmit={handleSubmit} className="mt-2">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Écrire une note"
          className="mb-2 min-h-[100px] w-full resize-none rounded-lg border bg-white focus:border-none focus:outline-none focus:ring-0"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!newNote.trim() || isLoading}
          className="w-full text-white"
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter une note'}
        </Button>
      </form>
    </div>
  );
}
