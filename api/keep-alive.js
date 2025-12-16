// This serverless function keeps the Supabase database active
// It will be called by Vercel Cron Jobs every hour
// Prevents Supabase free tier from pausing after 7 days of inactivity

export default async function handler(req, res) {
    const startTime = Date.now();

    // Log request headers for debugging
    console.log('[Keep-Alive] Function triggered at:', new Date().toISOString());
    console.log('[Keep-Alive] Request method:', req.method);

    // Only allow cron jobs to trigger this (optional security)
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        console.warn('[Keep-Alive] Unauthorized request attempt');
        // Still allow it to work for testing, but log warning
    }

    // Get environment variables with validation
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    // Validate configuration
    if (!SUPABASE_URL) {
        console.error('[Keep-Alive] SUPABASE_URL not configured in environment variables');
        return res.status(500).json({
            success: false,
            error: 'SUPABASE_URL not configured',
            message: 'Please add SUPABASE_URL to Vercel environment variables',
            timestamp: new Date().toISOString()
        });
    }

    if (!SUPABASE_ANON_KEY) {
        console.error('[Keep-Alive] SUPABASE_ANON_KEY not configured in environment variables');
        return res.status(500).json({
            success: false,
            error: 'SUPABASE_ANON_KEY not configured',
            message: 'Please add SUPABASE_ANON_KEY to Vercel environment variables',
            timestamp: new Date().toISOString()
        });
    }

    // Retry configuration
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`[Keep-Alive] Attempt ${attempt}/${MAX_RETRIES} - Pinging database...`);

            // Simple ping to the database - just count certificates
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/certificates?select=count`,
                {
                    method: 'GET',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Prefer': 'count=exact',
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unable to read error response');
                throw new Error(`Database ping failed with status ${response.status}: ${errorText}`);
            }

            // Get the count from response headers
            const count = response.headers.get('content-range')?.split('/')[1] || 'unknown';
            const duration = Date.now() - startTime;
            const timestamp = new Date().toISOString();

            console.log(`[Keep-Alive] ✓ Success on attempt ${attempt}`);
            console.log(`[Keep-Alive] Database active - ${count} certificates found`);
            console.log(`[Keep-Alive] Duration: ${duration}ms`);

            return res.status(200).json({
                success: true,
                message: 'Database pinged successfully',
                timestamp: timestamp,
                status: 'active',
                certificateCount: count,
                duration: `${duration}ms`,
                attempt: attempt,
                server: 'Vercel Edge'
            });

        } catch (error) {
            lastError = error;
            console.error(`[Keep-Alive] ✗ Attempt ${attempt} failed:`, error.message);

            // If this isn't the last attempt, wait before retrying
            if (attempt < MAX_RETRIES) {
                console.log(`[Keep-Alive] Retrying in ${RETRY_DELAY}ms...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }

    // All retries failed
    const duration = Date.now() - startTime;
    console.error('[Keep-Alive] ✗ All retry attempts failed');
    console.error('[Keep-Alive] Final error:', lastError);

    return res.status(500).json({
        success: false,
        error: lastError?.message || 'Unknown error occurred',
        message: 'Failed to ping database after multiple attempts',
        timestamp: new Date().toISOString(),
        attempts: MAX_RETRIES,
        duration: `${duration}ms`,
        troubleshooting: {
            checkSupabaseUrl: SUPABASE_URL,
            checkSupabaseStatus: 'Visit status.supabase.com',
            checkEnvironmentVariables: 'Verify SUPABASE_ANON_KEY is set correctly',
            checkRLSPolicies: 'Ensure SELECT policy allows public access'
        }
    });
}
