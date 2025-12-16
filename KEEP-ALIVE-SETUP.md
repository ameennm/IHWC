# Setting Up Supabase Keep-Alive (Prevent Database Pausing)

## Problem
Supabase free tier databases pause after **1 week of inactivity**. This can cause:
- Slow first load when database wakes up
- Potential service interruptions
- Poor user experience

## Solution
We've set up an automated cron job that pings your database **every hour** to keep it active.

---

## 🚀 Setup Instructions

### Step 1: Deploy Your Site to Vercel First
Make sure your site is deployed to Vercel before setting up the cron job.

### Step 2: Add Environment Variables in Vercel

1. **Go to your Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard
   - Click on your deployed project

2. **Navigate to Settings**:
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Required Variables**:

   **Variable 1:**
   - Name: `SUPABASE_URL`
   - Value: `https://zeutkwqvzdymqwezprjn.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 2:**
   - Name: `SUPABASE_ANON_KEY`
   - Value: `[Your actual Supabase anon/public key]`
   - Get it from: Supabase Dashboard → Settings → API → "anon public" key
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 3 (Optional - for extra security):**
   - Name: `CRON_SECRET`
   - Value: `[Any random secret string]` (e.g., `my-super-secret-key-12345`)
   - Environments: ✅ Production
   - Click **Save**

4. **Redeploy Your Site**:
   - Go to **Deployments** tab
   - Click the ⋮ menu on latest deployment
   - Click **Redeploy**
   - ✅ This activates the environment variables

### Step 3: Verify Cron Job is Working

**Option A: Check Vercel Logs (After 1 Hour)**

1. Go to your Vercel project
2. Click **Logs** tab
3. Wait for the next hour mark (e.g., 3:00 PM, 4:00 PM)
4. Look for logs from `/api/keep-alive`
5. ✅ Should see: "Database pinged successfully"

**Option B: Manual Test (Immediate)**

1. Open your browser
2. Go to: `https://your-site.vercel.app/api/keep-alive`
3. You should see JSON response:
   ```json
   {
     "success": true,
     "message": "Database pinged successfully",
     "timestamp": "2025-12-15T...",
     "status": "active"
   }
   ```

---

## 📊 How It Works

### Cron Schedule
```
"0 * * * *"
```
This means: **Every hour at minute 0** (e.g., 1:00, 2:00, 3:00...)

### What the Cron Job Does
1. Runs every hour automatically
2. Makes a simple query to Supabase: `SELECT count FROM certificates`
3. This keeps the database "awake"
4. Logs success/failure for monitoring

### Why Every Hour?
- Supabase pauses after **7 days of inactivity**
- Running every hour = 168 pings per week
- Well below Vercel's free tier limits
- Ensures database never sleeps

---

## 💰 Cost & Limits

### Vercel Free Tier
- ✅ **100 GB-Hours per month** (Function execution time)
- ✅ Our cron job uses ~0.5 seconds per run
- ✅ 720 runs/month × 0.5s = **0.1 GB-Hours/month**
- ✅ You'll use **0.1% of your limit**

### Supabase Free Tier
- ✅ **Unlimited API requests** (within rate limits)
- ✅ Database stays active
- ✅ No additional costs

**Conclusion: Completely free! ✅**

---

## 🔧 Customization

### Change Ping Frequency

Edit `vercel.json`:

```json
"crons": [
  {
    "path": "/api/keep-alive",
    "schedule": "0 */2 * * *"  // Every 2 hours
  }
]
```

**Common Schedules:**
- Every hour: `"0 * * * *"`
- Every 2 hours: `"0 */2 * * *"`
- Every 6 hours: `"0 */6 * * *"`
- Every 12 hours: `"0 */12 * * *"`
- Once a day at midnight: `"0 0 * * *"`

### Add Monitoring/Alerts

Edit `api/keep-alive.js` to send alerts on failure:

```javascript
if (!response.ok) {
  // Send email/webhook notification
  await fetch('https://your-webhook-url.com', {
    method: 'POST',
    body: JSON.stringify({ alert: 'Database ping failed!' })
  });
}
```

---

## 🐛 Troubleshooting

### "SUPABASE_ANON_KEY not configured" Error

**Fix:**
1. Make sure you added `SUPABASE_ANON_KEY` to Vercel env variables
2. Redeploy after adding variables
3. The key should be the long JWT token from Supabase

### Cron Job Not Running

**Check:**
1. ✅ Vercel Pro plan required? (No - cron works on free tier)
2. ✅ Wait at least 1 hour after deployment
3. ✅ Check **Logs** tab in Vercel dashboard
4. ✅ Verify `vercel.json` has correct syntax

### How to Verify It's Working

**Method 1: Check Supabase Logs**
1. Go to Supabase Dashboard
2. Click **Logs** → **API**
3. You should see requests every hour from your Vercel function

**Method 2: Check Vercel Logs**
1. Vercel Dashboard → Your Project → **Logs**
2. Filter by "keep-alive"
3. Should see hourly successful pings

---

## 📋 Quick Checklist

- [ ] Deployed site to Vercel
- [ ] Added `SUPABASE_URL` to Vercel env variables
- [ ] Added `SUPABASE_ANON_KEY` to Vercel env variables
- [ ] Redeployed site after adding variables
- [ ] Verified `/api/keep-alive` endpoint works manually
- [ ] Checked logs after 1 hour to confirm cron is running
- [ ] Database stays active ✅

---

## 🎯 Alternative Solutions

### 1. GitHub Actions (If you prefer)
Create `.github/workflows/keep-alive.yml`:
```yaml
name: Keep Supabase Alive
on:
  schedule:
    - cron: '0 * * * *'
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Database
        run: curl https://your-site.vercel.app/api/keep-alive
```

### 2. External Cron Services
- **UptimeRobot**: Free monitoring + pings every 5 minutes
- **Cron-job.org**: Free cron service
- **EasyCron**: Free tier available

### 3. Supabase Edge Functions
Create a scheduled function in Supabase itself (requires setup)

---

## ✅ Benefits of This Setup

1. ✅ **Fully Automated** - Set it and forget it
2. ✅ **Free Forever** - No costs on either platform
3. ✅ **Reliable** - Vercel's infrastructure is rock solid
4. ✅ **Transparent** - Easy to monitor via logs
5. ✅ **Customizable** - Adjust frequency as needed

---

**Your database will never pause again! 🎉**
