'use client';

import React, { useEffect, useState } from 'react';
import {
  approveContactRequest,
  rejectContactRequest,
  getContactRequests,
} from './contact-requests.action';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/utils/date';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type ContactRequest = {
  id: number;
  created_at: string;
  state: string | null;
  message: string | null;
  sent_by: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    avatar_url: string | null;
    generated_id: string;
  } | null;
  asked_xpert: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    avatar_url: string | null;
    generated_id: string;
  } | null;
};

export default function ContactRequestsPanel() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const result = await getContactRequests();
      if (result.error) {
        toast.error(`Erreur: ${result.error}`);
      } else {
        // Combine all requests
        const allRequests = [
          ...(result.incomingData || []),
          ...(result.outgoingData || []),
        ];
        setRequests(allRequests);
      }
    } catch (error) {
      toast.error('Erreur lors de la récupération des demandes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: number) => {
    setProcessingIds((prev) => [...prev, requestId]);
    try {
      const result = await approveContactRequest(requestId);
      if (result.success) {
        toast.success('Demande de contact approuvée');
        fetchRequests(); // Refresh data
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    } catch (error) {
      toast.error("Erreur lors de l'approbation de la demande");
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const handleReject = async (requestId: number) => {
    setProcessingIds((prev) => [...prev, requestId]);
    try {
      const result = await rejectContactRequest(requestId);
      if (result.success) {
        toast.success('Demande de contact rejetée');
        fetchRequests(); // Refresh data
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    } catch (error) {
      toast.error('Erreur lors du rejet de la demande');
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const renderRequestCard = (request: ContactRequest) => {
    const isProcessing = processingIds.includes(request.id);
    const isPending = request.state === 'IN_REVIEW';
    const sender = request.sent_by || {
      id: '',
      firstname: 'Utilisateur',
      lastname: 'Inconnu',
      avatar_url: null,
      generated_id: '',
    };
    const receiver = request.asked_xpert || {
      id: '',
      firstname: 'Expert',
      lastname: 'Inconnu',
      avatar_url: null,
      generated_id: '',
    };

    return (
      <Card key={request.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-lg">Demande de contact</CardTitle>
            <div className="flex items-center gap-2">
              {request.state === 'IN_REVIEW' && (
                <Clock className="size-5 text-amber-500" />
              )}
              {request.state === 'approved' && (
                <CheckCircle className="size-5 text-green-500" />
              )}
              {request.state === 'rejected' && (
                <XCircle className="size-5 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  request.state === 'IN_REVIEW'
                    ? 'text-amber-500'
                    : request.state === 'approved'
                      ? 'text-green-500'
                      : 'text-red-500'
                )}
              >
                {request.state === 'IN_REVIEW'
                  ? 'En attente'
                  : request.state === 'approved'
                    ? 'Approuvée'
                    : request.state === 'rejected'
                      ? 'Rejetée'
                      : 'État inconnu'}
              </span>
            </div>
          </div>
          <CardDescription>
            Créée le {formatDate(request.created_at)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={sender.avatar_url || ''}
                    alt={`${sender.firstname || ''} ${sender.lastname || ''}`}
                  />
                  <AvatarFallback className="bg-primary text-white">
                    {sender.firstname?.[0] || '?'}
                    {sender.lastname?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {sender.firstname || 'Prénom'} {sender.lastname || 'Nom'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    ID: {sender.generated_id || 'Non disponible'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mx-4 font-light">demande à contacter</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={receiver.avatar_url || ''}
                    alt={`${receiver.firstname || ''} ${receiver.lastname || ''}`}
                  />
                  <AvatarFallback className="bg-secondary text-white">
                    {receiver.firstname?.[0] || '?'}
                    {receiver.lastname?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {receiver.firstname || 'Prénom'}{' '}
                    {receiver.lastname || 'Nom'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    ID: {receiver.generated_id || 'Non disponible'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-gray-50 p-3">
              <p className="mb-1 text-sm font-medium">Message :</p>
              <p className="text-sm">{request.message || 'Aucun message'}</p>
            </div>

            {isPending && (
              <div className="mt-2 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleReject(request.id)}
                  disabled={isProcessing}
                >
                  Refuser
                </Button>
                <Button
                  onClick={() => handleApprove(request.id)}
                  disabled={isProcessing}
                  className="bg-primary text-white"
                >
                  Approuver
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.state === 'IN_REVIEW');
  const resolvedRequests = requests.filter(
    (r) => r.state !== 'IN_REVIEW' && r.state !== null
  );

  return (
    <div className="size-full">
      <Tabs defaultValue="pending" className="flex h-full flex-col">
        <TabsList className="mb-4 w-fit">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="size-4" />
            En attente
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary p-1 text-xs text-white">
              {pendingRequests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="resolved">Traitées</TabsTrigger>
          <TabsTrigger value="all">Toutes</TabsTrigger>
        </TabsList>

        {/* Pending Requests Tab */}
        <TabsContent value="pending" className="flex-1 overflow-auto">
          <div className="max-h-[calc(100vh_-_290px)] overflow-auto pr-4">
            {pendingRequests.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">
                  Aucune demande en attente
                </p>
              </div>
            ) : (
              <div className="pb-4">
                {pendingRequests.map((request) => renderRequestCard(request))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Resolved Requests Tab */}
        <TabsContent value="resolved" className="flex-1 overflow-auto">
          <div className="max-h-[calc(100vh_-_290px)] overflow-auto pr-4">
            {resolvedRequests.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">Aucune demande traitée</p>
              </div>
            ) : (
              <div className="pb-4">
                {resolvedRequests.map((request) => renderRequestCard(request))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* All Requests Tab */}
        <TabsContent value="all" className="flex-1 overflow-auto">
          <div className="max-h-[calc(100vh_-_290px)] overflow-auto pr-4">
            {requests.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">Aucune demande trouvée</p>
              </div>
            ) : (
              <div className="pb-4">
                {requests.map((request) => renderRequestCard(request))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
