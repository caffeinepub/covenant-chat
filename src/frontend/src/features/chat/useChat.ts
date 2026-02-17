import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { getSessionPassword } from './chatSession';
import { encodeMessage } from './messageCodec';
import type { Message } from '@/backend';

const MESSAGES_QUERY_KEY = 'messages';
const POLLING_INTERVAL = 3000; // 3 seconds

export function useMessages() {
  const { actor, isFetching: isActorFetching } = useActor();
  const password = getSessionPassword();

  return useQuery<Message[]>({
    queryKey: [MESSAGES_QUERY_KEY],
    queryFn: async () => {
      if (!actor || !password) return [];
      try {
        const messages = await actor.getMessages(password, null);
        return messages;
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        throw error;
      }
    },
    enabled: !!actor && !isActorFetching && !!password,
    refetchInterval: password ? POLLING_INTERVAL : false,
    retry: 1
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const password = getSessionPassword();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor || !password) {
        throw new Error('Not authenticated');
      }
      const encodedContent = encodeMessage(text);
      return actor.addMessage(password, encodedContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
    }
  });
}

export function useClearChat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const password = getSessionPassword();

  return useMutation({
    mutationFn: async () => {
      if (!actor || !password) {
        throw new Error('Not authenticated');
      }
      return actor.clearChat(password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_QUERY_KEY] });
    }
  });
}

export function useVerifyPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      // Try to fetch messages to verify password
      await actor.getMessages(password, null);
      return true;
    }
  });
}

