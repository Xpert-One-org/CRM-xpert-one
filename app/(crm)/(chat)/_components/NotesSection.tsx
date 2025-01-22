'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { DBChatNote, DBProfile } from '@/types/typesDb';
import useChat from '@/store/chat/chat';
import {
  getChatNotes,
  createChatNote,
  updateChatNote,
  deleteChatNote,
} from '../../../../functions/chat-notes';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
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

export default function NotesSection() {
  const [notes, setNotes] = useState<DBChatNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    id: number;
    content: string;
  } | null>(null);

  const { getChatSelectedWithRightType } = useChat();
  const chatSelected = getChatSelectedWithRightType('chat');

  const fetchNotes = async () => {
    if (!chatSelected) return;

    const { data, error } = await getChatNotes(chatSelected.id);
    if (error) {
      toast.error('Erreur lors du chargement des notes');
      return;
    }
    if (data) {
      setNotes(data);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !chatSelected) return;

    setIsLoading(true);
    const { error } = await createChatNote({
      content: newNote,
      chatId: chatSelected.id,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Erreur lors de l'ajout de la note");
      return;
    }

    setNewNote('');
    fetchNotes();
    toast.success('Note ajoutée avec succès');
  };

  const handleEdit = async (note: DBChatNote) => {
    setEditingNote({ id: note.id, content: note.content });
  };

  const saveEdit = async (noteId: number) => {
    if (!editingNote?.content.trim()) return;

    const { error } = await updateChatNote({
      noteId,
      content: editingNote.content,
    });

    if (error) {
      toast.error('Erreur lors de la modification de la note');
      return;
    }

    setEditingNote(null);
    fetchNotes();
    toast.success('Note modifiée avec succès');
  };

  const handleDelete = async (noteId: number) => {
    const { error } = await deleteChatNote(noteId);

    if (error) {
      toast.error('Erreur lors de la suppression de la note');
      return;
    }

    fetchNotes();
    toast.success('Note supprimée avec succès');
  };

  useEffect(() => {
    if (chatSelected) {
      fetchNotes();
    }
  }, [chatSelected]);

  if (!chatSelected) {
    return null;
  }

  return (
    <Card className="w-full overflow-scroll bg-gray-50 lg:max-h-[calc(100vh_-_255px)]">
      <CardHeader>
        <CardTitle>Notes internes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Écrire une note..."
            className="resize-none bg-white"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button
            className="w-full text-white"
            onClick={addNote}
            disabled={isLoading || !newNote.trim()}
          >
            Ajouter une note
          </Button>
        </div>

        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-card relative rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="absolute right-2 top-2">
                <Button
                  onClick={() => handleEdit(note)}
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0"
                >
                  <Pencil className="size-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="size-8 p-0">
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

              {editingNote?.id === note.id ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        content: e.target.value,
                      })
                    }
                    className="mt-6 min-h-[100px] resize-none bg-white"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveEdit(note.id)}
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
                  <p className="mb-2 whitespace-pre-wrap">{note.content}</p>
                  <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                    <span className="font-medium">
                      {note.author?.firstname} {note.author?.lastname}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
