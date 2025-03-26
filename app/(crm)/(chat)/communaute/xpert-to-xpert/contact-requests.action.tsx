'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export async function getContactRequests() {
  const supabase = await createSupabaseAppServerClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { error: 'User not authenticated' };
  }

  try {
    // Get user profile to get generated_id and check role
    const { data: userProfile, error: profileError } = await supabase
      .from('profile')
      .select('generated_id, role')
      .eq('id', user.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { error: profileError.message };
    }

    // Check if user is admin
    if (userProfile.role !== 'admin') {
      return {
        error:
          'Access denied: Only administrators can view all contact requests',
      };
    }

    // Fetch all contact requests (for admin view)
    const { data: allRequests, error: requestsError } = await supabase
      .from('contact_xpert_demands')
      .select(
        `
        id,
        created_at,
        state,
        message,
        sent_by:profile!contact_xpert_demands_sent_by_fkey(
          id,
          firstname,
          lastname,
          avatar_url,
          generated_id
        ),
        asked_xpert:profile!contact_xpert_demands_asked_xpert_fkey(
          id,
          firstname,
          lastname,
          avatar_url,
          generated_id
        )
      `
      )
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Error fetching contact requests:', requestsError);
      return { error: requestsError.message };
    }

    // Separate into incoming and outgoing for consistency with the component
    // In admin view, we consider requests where admin is involved as "self" requests
    // and all others as "incoming" for admin to moderate
    const incomingData = allRequests.filter(
      (req) =>
        req.sent_by?.id !== user.user.id && req.asked_xpert?.id !== user.user.id
    );

    const outgoingData = allRequests.filter(
      (req) =>
        req.sent_by?.id === user.user.id || req.asked_xpert?.id === user.user.id
    );

    return { incomingData, outgoingData };
  } catch (error) {
    console.error('Error in getContactRequests:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function approveContactRequest(requestId: number) {
  const supabase = await createSupabaseAppServerClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Get user role
    const { data: userProfile, error: profileError } = await supabase
      .from('profile')
      .select('role')
      .eq('id', user.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { success: false, error: profileError.message };
    }

    // Check if user is admin
    if (userProfile.role !== 'admin') {
      return {
        success: false,
        error:
          'Access denied: Only administrators can approve contact requests',
      };
    }

    // First get the request details
    const { data: request, error: requestError } = await supabase
      .from('contact_xpert_demands')
      .select(
        `
        id,
        sent_by,
        asked_xpert,
        state,
        message
      `
      )
      .eq('id', requestId)
      .single();

    if (requestError) {
      console.error('Error fetching request details:', requestError);
      return { success: false, error: requestError.message };
    }

    // Check if request exists and is pending
    if (!request || request.state !== 'pending') {
      return {
        success: false,
        error: 'Request not found or already processed',
      };
    }

    if (!request.sent_by || !request.asked_xpert) {
      return {
        success: false,
        error: 'Invalid request data',
      };
    }

    // Get user profiles for chat creation
    const { data: senderProfile, error: senderError } = await supabase
      .from('profile')
      .select('id, generated_id')
      .eq('id', request.sent_by)
      .single();

    if (senderError) {
      console.error('Error fetching sender profile:', senderError);
      return { success: false, error: senderError.message };
    }

    const { data: receiverProfile, error: receiverError } = await supabase
      .from('profile')
      .select('id, generated_id')
      .eq('generated_id', request.asked_xpert)
      .single();

    if (receiverError) {
      console.error('Error fetching receiver profile:', receiverError);
      return { success: false, error: receiverError.message };
    }

    // First update the request state to approved
    const { error: updateError } = await supabase
      .from('contact_xpert_demands')
      .update({ state: 'approved' })
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating request state:', updateError);
      return { success: false, error: updateError.message };
    }

    // Create a new chat between the two users
    const { data: chat, error: chatError } = await supabase
      .from('chat')
      .insert({
        title: 'Conversation XPERT à XPERT',
        topic: 'xpert_to_xpert',
        type: 'xpert_to_xpert',
        created_by: senderProfile.id,
        receiver_id: receiverProfile.id,
      })
      .select('id')
      .single();

    if (chatError) {
      console.error('Error creating chat:', chatError);
      // Still return success because the request was approved
      return {
        success: true,
        warning: 'Request approved but chat creation failed',
      };
    }

    // Create an initial message in the chat
    const { error: messageError } = await supabase.from('message').insert({
      chat_id: chat.id,
      content: 'Demande de contact acceptée. Vous pouvez maintenant échanger.',
      send_by: user.user.id, // The message is sent by the admin who approved it
      read_by: [user.user.id], // Initially read only by the sender
    });

    if (messageError) {
      console.error('Error creating initial message:', messageError);
      // Still return success because the chat was created
      return {
        success: true,
        warning: 'Chat created but initial message failed',
      };
    }

    return { success: true, chatId: chat.id };
  } catch (error) {
    console.error('Error in approveContactRequest:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function rejectContactRequest(requestId: number) {
  const supabase = await createSupabaseAppServerClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Get user role
    const { data: userProfile, error: profileError } = await supabase
      .from('profile')
      .select('role')
      .eq('id', user.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { success: false, error: profileError.message };
    }

    // Check if user is admin
    if (userProfile.role !== 'admin') {
      return {
        success: false,
        error: 'Access denied: Only administrators can reject contact requests',
      };
    }

    // First check if the request exists and is pending
    const { data: request, error: requestError } = await supabase
      .from('contact_xpert_demands')
      .select('id, state')
      .eq('id', requestId)
      .single();

    if (requestError) {
      console.error('Error fetching request details:', requestError);
      return { success: false, error: requestError.message };
    }

    if (!request || request.state !== 'pending') {
      return {
        success: false,
        error: 'Request not found or already processed',
      };
    }

    // Update the request state to rejected
    const { error: updateError } = await supabase
      .from('contact_xpert_demands')
      .update({ state: 'rejected' })
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating request state:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in rejectContactRequest:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createContactRequest(
  askedXpertId: string,
  message: string
) {
  const supabase = await createSupabaseAppServerClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Check if the requester is also an xpert (only xperts can contact other xperts)
    const { data: userProfile, error: profileError } = await supabase
      .from('profile')
      .select('role')
      .eq('id', user.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { success: false, error: profileError.message };
    }

    if (userProfile.role !== 'xpert' && userProfile.role !== 'admin') {
      return {
        success: false,
        error:
          "Seuls les experts peuvent demander à contacter d'autres experts",
      };
    }

    // Check if there's already a pending request between these users
    const { data: existingRequest, error: checkError } = await supabase
      .from('contact_xpert_demands')
      .select('id, state')
      .eq('sent_by', user.user.id)
      .eq('asked_xpert', askedXpertId)
      .in('state', ['pending', 'approved']);

    if (checkError) {
      console.error('Error checking existing requests:', checkError);
      return { success: false, error: checkError.message };
    }

    if (existingRequest && existingRequest.length > 0) {
      // A request already exists
      const status = existingRequest[0].state;
      return {
        success: false,
        error:
          status === 'approved'
            ? 'Vous êtes déjà connecté avec cet expert'
            : 'Une demande est déjà en attente pour cet expert',
      };
    }

    // Insert the new contact request
    const { data, error: insertError } = await supabase
      .from('contact_xpert_demands')
      .insert({
        sent_by: user.user.id,
        asked_xpert: askedXpertId,
        state: 'pending',
        message: message,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error creating contact request:', insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true, requestId: data.id };
  } catch (error) {
    console.error('Error in createContactRequest:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function cancelContactRequest(requestId: number) {
  const supabase = await createSupabaseAppServerClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // First check if the request exists, is pending, and belongs to the user
    const { data: request, error: requestError } = await supabase
      .from('contact_xpert_demands')
      .select('id, state, sent_by')
      .eq('id', requestId)
      .single();

    if (requestError) {
      console.error('Error fetching request details:', requestError);
      return { success: false, error: requestError.message };
    }

    if (!request || request.state !== 'pending') {
      return {
        success: false,
        error: 'Request not found or already processed',
      };
    }

    if (request.sent_by !== user.user.id) {
      return {
        success: false,
        error: 'You can only cancel your own requests',
      };
    }

    // Delete the request
    const { error: deleteError } = await supabase
      .from('contact_xpert_demands')
      .delete()
      .eq('id', requestId);

    if (deleteError) {
      console.error('Error deleting request:', deleteError);
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in cancelContactRequest:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
