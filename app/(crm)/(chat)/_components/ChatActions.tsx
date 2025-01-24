'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { assignReferent, getAvailableReferents } from './chat-actions';
import { getReceiverAndReferentProfile } from './chat-user-info-actions';
import { toggleChatDone } from './chat-done-action';
import useChat from '@/store/chat/chat';
import useReferent from './referent-store';
import type { DBProfile } from '@/types/typesDb';

export default function ChatActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [referents, setReferents] = useState<DBProfile[]>([]);
  const [selectedReferentId, setSelectedReferentId] = useState<string>('');
  const [currentReferent, setCurrentReferent] = useState<DBProfile | null>(
    null
  );
  const [isDone, setIsDone] = useState(false);

  const chatSelected = useChat((state) => state.chatSelected);
  const triggerRefresh = useReferent((state) => state.triggerRefresh);

  useEffect(() => {
    const fetchData = async () => {
      if (!chatSelected?.receiver_id) return;

      try {
        // Récupérer les référents disponibles et le profil actuel
        const [referentsData, profilesData] = await Promise.all([
          getAvailableReferents(),
          getReceiverAndReferentProfile(chatSelected.receiver_id),
        ]);

        setReferents(referentsData);

        if (profilesData?.referent) {
          setCurrentReferent(profilesData.referent);
          setSelectedReferentId(profilesData.referent.id);
        }

        // Mettre à jour l'état isDone si le chat est sélectionné
        if (chatSelected) {
          setIsDone(chatSelected.is_done || false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [chatSelected?.receiver_id, chatSelected]);

  const handleAssignReferent = async () => {
    if (!chatSelected?.receiver_id || !selectedReferentId) return;

    setIsLoading(true);
    try {
      await assignReferent(chatSelected.receiver_id, selectedReferentId);
      const profilesData = await getReceiverAndReferentProfile(
        chatSelected.receiver_id
      );
      setCurrentReferent(profilesData.referent);
      triggerRefresh();
    } catch (error) {
      console.error('Error assigning referent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsDone = async () => {
    if (!chatSelected?.id) return;

    setIsLoading(true);
    try {
      const result = await toggleChatDone(chatSelected.id.toString());
      if (result.success) {
        setIsDone(result.isDone);
      }
    } catch (error) {
      console.error('Error toggling chat done status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Attribuer un référent</label>
          <Select
            value={selectedReferentId}
            onValueChange={setSelectedReferentId}
          >
            <SelectTrigger className="bg-white">
              <SelectValue
                placeholder="Sélectionner un référent"
                className="bg-white"
              />
            </SelectTrigger>
            <SelectContent>
              {referents?.map((referent: DBProfile) => (
                <SelectItem key={referent.id} value={referent.id}>
                  {referent.firstname} {referent.lastname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="default"
            className="mt-2 w-full text-white"
            onClick={handleAssignReferent}
            disabled={isLoading || selectedReferentId === currentReferent?.id}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer le référent'}
          </Button>
        </div>

        <Button
          variant={isDone ? 'default' : 'secondary'}
          className="w-full text-white"
          onClick={handleMarkAsDone}
          disabled={isLoading}
        >
          {isLoading
            ? 'En cours...'
            : isDone
              ? 'Conversation traitée'
              : 'Marquer comme traitée'}
        </Button>
      </CardContent>
    </Card>
  );
}
