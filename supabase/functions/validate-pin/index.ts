import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminPin = Deno.env.get('ADMIN_PIN')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { pin, clientId } = await req.json();

    console.log(`PIN validation attempt from client: ${clientId}`);

    // Check if client is locked out
    const { data: attemptData, error: fetchError } = await supabase
      .from('admin_attempts')
      .select('*')
      .eq('ip_address', clientId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching attempt data:', fetchError);
      throw fetchError;
    }

    const now = new Date();

    // Check if locked out
    if (attemptData?.locked_until) {
      const lockUntil = new Date(attemptData.locked_until);
      if (lockUntil > now) {
        const remainingMinutes = Math.ceil((lockUntil.getTime() - now.getTime()) / 60000);
        console.log(`Client ${clientId} is locked out for ${remainingMinutes} more minutes`);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Too many failed attempts. Try again in ${remainingMinutes} minutes.`,
            locked: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
    }

    // Validate PIN
    if (pin === adminPin) {
      console.log(`PIN validated successfully for client: ${clientId}`);
      
      // Reset attempt count on success
      if (attemptData) {
        await supabase
          .from('admin_attempts')
          .update({ attempt_count: 0, locked_until: null })
          .eq('ip_address', clientId);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log(`Invalid PIN attempt from client: ${clientId}`);
      
      // Update or create attempt record
      const newAttemptCount = (attemptData?.attempt_count || 0) + 1;
      const shouldLock = newAttemptCount >= 5;
      const lockUntil = shouldLock ? new Date(now.getTime() + 15 * 60000).toISOString() : null;

      if (attemptData) {
        await supabase
          .from('admin_attempts')
          .update({ 
            attempt_count: newAttemptCount, 
            last_attempt: now.toISOString(),
            locked_until: lockUntil
          })
          .eq('ip_address', clientId);
      } else {
        await supabase
          .from('admin_attempts')
          .insert({ 
            ip_address: clientId, 
            attempt_count: newAttemptCount,
            last_attempt: now.toISOString(),
            locked_until: lockUntil
          });
      }

      if (shouldLock) {
        console.log(`Client ${clientId} locked out for 15 minutes`);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Too many failed attempts. Locked out for 15 minutes.',
            locked: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid PIN. ${5 - newAttemptCount} attempts remaining.`,
          attemptsRemaining: 5 - newAttemptCount
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in validate-pin function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});