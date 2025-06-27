import { supabase } from '../config/supabase';

export interface ChatMessage {
  id?: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export const createChatSession = async (journeyId: string): Promise<string> => {
  if (!journeyId) {
    throw new Error('journeyId is required to create a chat session');
  }

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ journey_id: journeyId })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating chat session:', error);
    throw new Error('Failed to create chat session');
  }

  return data.id;
};

export const saveChatMessage = async (message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: message.session_id,
      role: message.role,
      content: message.content
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error saving chat message:', error);
    throw new Error('Failed to save chat message');
  }

  return data as ChatMessage;
};

export const getChatHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    throw new Error('Failed to fetch chat history');
  }

  return data as ChatMessage[];
};

export const getOrCreateSession = async (sessionId?: string, journeyId?: string): Promise<string> => {
  if (sessionId) {
    // Check if session exists
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .single();

    if (!error && data) {
      return sessionId;
    }
  }

  if (!journeyId) {
    throw new Error('journeyId is required to create a new chat session');
  }

  // Create new session if none provided or if provided session doesn't exist
  return createChatSession(journeyId);
};
