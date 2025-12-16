# QUICK START GUIDE

## What You Need to Provide

### 1. Supabase Setup (5 minutes)

1. **Go to**: https://supabase.com
2. **Sign up/Login** (free account)
3. **Create new project**:
   - Project name: `ihwc-certificates`
   - Database password: (create a strong password)
   - Region: Choose closest to you
   - Click "Create new project"
   - ⏳ Wait 1-2 minutes for setup

4. **Run SQL Schema**:
   - Click **SQL Editor** in left sidebar
   - Click **New Query**
   - Open file: `supabase-schema.sql`
   - Copy ALL contents → Paste in SQL editor
   - Click **RUN** button
   - ✅ Should see success message

5. **Get Your Keys**:
   - Click **Settings** (gear icon) → **API**
   - Copy these 2 values:
     ```
     Project URL: https://xxxxx.supabase.co
     anon public key: eyJhbGc... (long token)
     ```

### 2. Update Your Code (2 minutes)

**Open**: `app.js`

**Find lines 2-3** and replace:
```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

**Paste your actual values from Supabase**

### 3. Deploy to Vercel (3 minutes)

**Option 1: Using Vercel Website (Easiest)**

1. Go to: https://vercel.com
2. Click **Sign Up** (use GitHub account)
3. Click **Add New** → **Project**
4. Click **Browse** → Select your project folder
5. Click **Deploy**
6. ⏳ Wait 1-2 minutes
7. ✅ Your site is live! Click the URL

**Option 2: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (run in your project folder)
vercel

# Follow prompts, then your site is live!
```

---

## Testing Your Site

### Test 1: Verify Certificate
1. Open your deployed URL
2. Scroll to "Verify Your Certificate" section
3. Enter: `IHWC2025001`
4. Click **Verify Certificate**
5. ✅ Should show certificate details

### Test 2: Admin Login
1. Scroll to footer
2. Click **Admin Login**
3. Password: `123456789`
4. ✅ Should see dashboard with 5 sample certificates

### Test 3: Add Certificate
1. Fill the form:
   - Certificate Number: `IHWC2025999`
   - Student Name: `Test User`
   - Course: `Test Course`
   - Duration: `6 Months`
   - Institution: `Test Institution`
   - Issue Date: (today's date)
2. Click **Save Certificate**
3. ✅ Should appear in table below

---

## What Files to Give Me?

**You need to provide:**

1. ✅ **Supabase Project URL**
   - Example: `https://zeutkwqvzdymqwezprjn.supabase.co`

2. ✅ **Supabase Anon Key**
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)

**That's it! Just these 2 values.**

I'll update the code for you, then you can deploy.

---

## Already Have Supabase Credentials?

**You provided:**
- URL: `https://zeutkwqvzdymqwezprjn.supabase.co`
- Key: `eyJhbGc...` (from your original message)

**I need to confirm:**
1. Did you already run the SQL schema in Supabase?
2. Is your Supabase project ready to use?

If YES → I can update the code now and you can deploy immediately.
If NO → Follow Step 1 above first.

---

## Next Steps

Tell me:
- [ ] "I have Supabase ready - update the code" 
- [ ] "I need to set up Supabase first"
- [ ] "I'm ready to deploy to Vercel"

Then I'll guide you through the exact next steps!
