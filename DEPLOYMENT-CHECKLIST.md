# 🚀 COMPLETE DEPLOYMENT CHECKLIST

Follow these steps in order for a successful deployment.

---

## ✅ Phase 1: Supabase Setup (10 minutes)

### 1.1 Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up or log in
- [ ] Click "New Project"
- [ ] Fill in:
  - **Project Name**: `ihwc-certificates`
  - **Database Password**: (create a strong password and save it)
  - **Region**: Choose closest to you
- [ ] Click "Create new project"
- [ ] ⏳ Wait 1-2 minutes for project creation

### 1.2 Run Database Schema
- [ ] Open Supabase Dashboard
- [ ] Click **SQL Editor** (left sidebar)
- [ ] Click **New Query**
- [ ] Open file: `supabase-schema.sql` from your project
- [ ] Copy ENTIRE contents
- [ ] Paste into SQL editor
- [ ] Click **RUN** button (or Ctrl+Enter)
- [ ] ✅ Verify: "Success. No rows returned" message appears
- [ ] Click **Table Editor** to verify `certificates` table exists
- [ ] ✅ Should see 5 sample certificates

### 1.3 Get API Credentials
- [ ] Click **Settings** (gear icon, bottom left)
- [ ] Click **API** tab
- [ ] Copy and save these values:

```
Project URL: _______________________________________________
(Example: https://xxxxx.supabase.co)

anon public key: _______________________________________________  
(Long JWT token starting with eyJ...)
```

### 1.4 Update Code
- [ ] Open `app.js` in your code editor
- [ ] Find lines 2-4
- [ ] Replace with your actual values:

```javascript
const SUPABASE_URL = 'YOUR_URL_FROM_ABOVE';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_FROM_ABOVE';
```

- [ ] **Optional**: Change admin password on line 6:
```javascript
const ADMIN_PASSWORD = "your-secure-password";
```

- [ ] Save the file

---

## ✅ Phase 2: Local Testing (5 minutes)

### 2.1 Test Locally
- [ ] Open `index.html` in a web browser
- [ ] ✅ Page loads without console errors (F12 to check)
- [ ] Test certificate verification:
  - [ ] Enter: `IHWC2025001`
  - [ ] Click "Verify Certificate"
  - [ ] ✅ Modal shows certificate details
- [ ] Test admin login:
  - [ ] Click "Admin Login" in footer
  - [ ] Enter password: `123456789` (or your custom password)
  - [ ] ✅ Dashboard loads with 5 certificates

### 2.2 Test Add Certificate
- [ ] In admin dashboard, fill form:
  - Certificate Number: `TEST001`
  - Student Name: `Test Student`
  - Course: `Test Course`
  - Duration: `6 Months`
  - Institution: `Test Institution`
  - Issue Date: Today
- [ ] Click **Save Certificate**
- [ ] ✅ Success message appears
- [ ] ✅ Certificate appears in table below

---

## ✅ Phase 3: Deploy to Vercel (10 minutes)

### 3.1 Prepare for Deployment

**Option A: Using Git/GitHub (Recommended)**
- [ ] Create a new repository on GitHub
- [ ] Initialize git in your project folder:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git push -u origin main
  ```

**Option B: Direct Upload**
- [ ] Zip your project folder (exclude `.git` if present)
- [ ] You'll upload this to Vercel

### 3.2 Deploy to Vercel

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up or log in (use GitHub account for easier deployment)
- [ ] Click **"Add New..." → "Project"**

**If using Git:**
- [ ] Select your GitHub repository
- [ ] Click **Import**

**If uploading directly:**
- [ ] Click **"Browse"**
- [ ] Select your project folder
- [ ] Click **Upload**

### 3.3 Configure Deployment
- [ ] **Project Name**: `ihwc-certificate-system` (or your choice)
- [ ] **Framework Preset**: Leave as "Other"
- [ ] **Root Directory**: `./`
- [ ] **Build Command**: Leave empty
- [ ] **Output Directory**: Leave empty
- [ ] Click **Deploy**
- [ ] ⏳ Wait 1-2 minutes

### 3.4 Verify Deployment
- [ ] ✅ "Congratulations!" screen appears
- [ ] Click **Visit** button
- [ ] Your site should load
- [ ] Test certificate verification again
- [ ] Test admin login

---

## ✅ Phase 4: Set Up Keep-Alive (5 minutes)

### 4.1 Add Environment Variables
- [ ] In Vercel Dashboard, click your project
- [ ] Click **Settings** tab
- [ ] Click **Environment Variables**
- [ ] Add Variable 1:
  - **Name**: `SUPABASE_URL`
  - **Value**: Your Supabase URL
  - **Environments**: ✅ Production ✅ Preview ✅ Development
  - Click **Save**
- [ ] Add Variable 2:
  - **Name**: `SUPABASE_ANON_KEY`
  - **Value**: Your Supabase anon key
  - **Environments**: ✅ Production ✅ Preview ✅ Development
  - Click **Save**

### 4.2 Redeploy
- [ ] Go to **Deployments** tab
- [ ] Click ⋮ menu on latest deployment
- [ ] Click **Redeploy**
- [ ] ✅ Wait for redeployment

### 4.3 Test Keep-Alive Function
- [ ] Open browser
- [ ] Go to: `https://your-site.vercel.app/api/keep-alive`
- [ ] ✅ Should see JSON:
  ```json
  {
    "success": true,
    "message": "Database pinged successfully",
    ...
  }
  ```

---

## ✅ Phase 5: Final Verification (5 minutes)

### 5.1 Production Tests
- [ ] Visit your live site
- [ ] Test certificate verification with: `IHWC2025001`
- [ ] ✅ Works correctly
- [ ] Test admin login
- [ ] ✅ Dashboard loads
- [ ] Add a new certificate
- [ ] ✅ Saves successfully
- [ ] Edit a certificate
- [ ] ✅ Updates successfully
- [ ] Delete the test certificate
- [ ] ✅ Deletes successfully
- [ ] Test search function
- [ ] ✅ Filters correctly

### 5.2 Mobile Testing
- [ ] Open site on mobile device
- [ ] ✅ Responsive layout works
- [ ] ✅ Navigation menu opens/closes
- [ ] ✅ Forms are usable
- [ ] ✅ Table scrolls horizontally

### 5.3 Monitor Cron Job
- [ ] Wait 1 hour after deployment
- [ ] Go to Vercel → Your Project → **Logs**
- [ ] Filter by "keep-alive"
- [ ] ✅ See successful ping logs
- [ ] Check Supabase → **Logs** → **API**
- [ ] ✅ See hourly requests from Vercel

---

## ✅ Phase 6: Security & Customization (Optional)

### 6.1 Security Hardening
- [ ] Change admin password in `app.js` (line 6)
- [ ] Update Supabase RLS policies:
  - [ ] Keep SELECT public (for verification)
  - [ ] Restrict INSERT/UPDATE/DELETE to authenticated users
- [ ] Add `CRON_SECRET` environment variable in Vercel

### 6.2 Customization
- [ ] Replace `logo.png` with your actual logo
- [ ] Update colors in `styles.css` (CSS variables)
- [ ] Modify course durations in `index.html`
- [ ] Update footer text
- [ ] Change meta tags for SEO

### 6.3 Custom Domain (Optional)
- [ ] Purchase domain from provider
- [ ] In Vercel: Settings → Domains
- [ ] Add your custom domain
- [ ] Update DNS records as instructed
- [ ] ✅ Site accessible via custom domain

---

## 📊 Post-Deployment

### What You Should Have Now:
✅ Live website on Vercel  
✅ Working Supabase database  
✅ Certificate verification system  
✅ Admin dashboard  
✅ Automated keep-alive cron job  
✅ 5 sample certificates in database  

### Your URLs:
- **Website**: `https://your-project.vercel.app`
- **Admin**: `https://your-project.vercel.app/#adminpage`
- **Keep-Alive API**: `https://your-project.vercel.app/api/keep-alive`

### Credentials:
- **Admin Password**: `123456789` (or your custom password)
- **Supabase Dashboard**: Access via supabase.com
- **Vercel Dashboard**: Access via vercel.com

---

## 🆘 Troubleshooting

### Issue: Certificates Not Loading
**Fix:**
- [ ] Check browser console (F12) for errors
- [ ] Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `app.js`
- [ ] Confirm SQL schema was run in Supabase
- [ ] Check Supabase RLS policies are enabled

### Issue: Admin Login Fails
**Fix:**
- [ ] Verify password in `app.js` line 6
- [ ] Clear browser cache
- [ ] Try incognito/private mode

### Issue: Deployment Failed
**Fix:**
- [ ] Check all files are in root directory
- [ ] Verify `vercel.json` has correct syntax
- [ ] Check Vercel deployment logs for errors
- [ ] Try redeploying

### Issue: Cron Job Not Working
**Fix:**
- [ ] Verify environment variables are set in Vercel
- [ ] Redeploy after adding env variables
- [ ] Wait 1 hour before checking logs
- [ ] Test manual endpoint: `/api/keep-alive`

---

## 📝 Maintenance

### Regular Tasks:
- ✅ Monitor Vercel logs weekly
- ✅ Check Supabase database size (free tier: 500MB)
- ✅ Backup database monthly (Supabase → Database → Backups)
- ✅ Update admin password regularly

### Scaling:
When you outgrow free tiers:
- **Vercel Pro**: $20/month (custom domains, more bandwidth)
- **Supabase Pro**: $25/month (no pausing, more storage, priority support)

---

## 🎉 Congratulations!

Your IHWC Certificate Verification System is now live and fully functional!

### What's Next?
- [ ] Share the URL with stakeholders
- [ ] Train users on admin dashboard
- [ ] Add real certificate data
- [ ] Monitor usage and performance
- [ ] Gather feedback for improvements

---

**Need help? Check the other documentation files:**
- `README.md` - Full project documentation
- `QUICK-START.md` - Quick setup guide
- `KEEP-ALIVE-SETUP.md` - Detailed cron job setup

**Happy deploying! 🚀**
