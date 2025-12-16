# 🚀 STEP-BY-STEP DEPLOYMENT GUIDE

Follow these exact steps in order. Don't skip any!

---

## ⚠️ IMPORTANT: Get Your Correct Supabase Key First!

The key you provided (`sb_publishable_...`) is NOT the correct key format.

### Step 1: Get the Correct Supabase Anon Key (2 minutes)

1. **Open Supabase Dashboard**:
   - Go to: https://app.supabase.com
   - Log into your account
   - Click on your project: `zeutkwqvzdymqwezprjn`

2. **Navigate to API Settings**:
   - Click the **Settings** icon (⚙️) in the bottom left
   - Click **API** in the left menu

3. **Copy the CORRECT Key**:
   - Look for section called "Project API keys"
   - Find the key labeled: **`anon` `public`**
   - It should be a LONG token that looks like:
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpldXRrd3F2emR5bXF3ZXpwcmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyODM1OTIsImV4cCI6MjA0OTg1OTU5Mn0.XXXXXXXXXXXXXX
     ```
   - Click the **Copy** button
   - Save it somewhere safe!

4. **Update app.js**:
   - Open `app.js` file
   - Find line 4
   - Replace `'YOUR_ANON_KEY_HERE'` with your copied key
   - Should look like:
     ```javascript
     const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
     ```
   - Save the file

---

## 📝 Step 2: Run the Database Schema (3 minutes)

⚠️ **CRITICAL**: Do this before anything else!

1. **Open SQL Editor in Supabase**:
   - In Supabase Dashboard, click **SQL Editor** (left sidebar)
   - Click **New Query** button

2. **Copy the Schema**:
   - Open file: `supabase-schema.sql`
   - Select ALL content (Ctrl+A)
   - Copy (Ctrl+C)

3. **Run the Schema**:
   - Paste into the SQL Editor in Supabase
   - Click **RUN** button (or press Ctrl+Enter)
   - ✅ Wait for "Success" message

4. **Verify**:
   - Click **Table Editor** in left sidebar
   - You should see `certificates` table
   - Click on it - should have 5 sample records

---

## 🧪 Step 3: Test Locally (5 minutes)

Before deploying, make sure everything works!

1. **Open in Browser**:
   - Right-click `index.html`
   - Choose "Open with" → Your web browser
   - OR just double-click `index.html`

2. **Open Browser Console**:
   - Press `F12` (or right-click → Inspect)
   - Click **Console** tab
   - ✅ Should NOT see any red errors

3. **Test Certificate Verification**:
   - Scroll to "Verify Your Certificate" section
   - Enter: `IHWC2025001`
   - Click "Verify Certificate"
   - ✅ Modal should popup with certificate details
   - If you see an error about Supabase → Go back to Step 1!

4. **Test Admin Dashboard**:
   - Scroll to footer
   - Click "Admin Login"
   - Enter password: `123456789`
   - ✅ Should see dashboard with 5 certificates

✅ **If everything works locally, proceed to GitHub!**

---

## 📦 Step 4: Deploy to GitHub (5 minutes)

### Option A: Using GitHub Desktop (Easiest)

1. **Download GitHub Desktop**:
   - Go to: https://desktop.github.com
   - Download and install

2. **Create Repository**:
   - Open GitHub Desktop
   - Click **File** → **New Repository**
   - Name: `ihwc-certificate-system`
   - Local Path: Choose your project folder (`c:\Users\servi\Desktop\vs code\irshad`)
   - Click **Create Repository**

3. **Commit Files**:
   - You'll see all files listed
   - Summary: `Initial commit`
   - Click **Commit to main**

4. **Publish to GitHub**:
   - Click **Publish repository**
   - Uncheck "Keep this code private" (or keep checked if you want it private)
   - Click **Publish repository**
   - ✅ Your code is now on GitHub!

### Option B: Using Git Command Line

1. **Open PowerShell**:
   - Press `Win + X`
   - Choose "Windows PowerShell" or "Terminal"

2. **Navigate to Your Project**:
   ```powershell
   cd "c:\Users\servi\Desktop\vs code\irshad"
   ```

3. **Check if Git is Installed**:
   ```powershell
   git --version
   ```
   - If error → Install Git from: https://git-scm.com/download/win

4. **Initialize Git Repository**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: IHWC Certificate System"
   ```

5. **Create GitHub Repository**:
   - Go to: https://github.com/new
   - Repository name: `ihwc-certificate-system`
   - Description: "IHWC Certificate Verification System"
   - Public or Private: (your choice)
   - **DO NOT** check "Add README" or "Add .gitignore"
   - Click **Create repository**

6. **Push to GitHub**:
   - Copy the commands GitHub shows you (should look like):
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/ihwc-certificate-system.git
   git branch -M main
   git push -u origin main
   ```
   - Paste and run in PowerShell
   - Enter GitHub credentials if asked
   - ✅ Code is now on GitHub!

---

## 🌐 Step 5: Deploy to Vercel (5 minutes)

1. **Go to Vercel**:
   - Visit: https://vercel.com
   - Click **Sign Up** (use your GitHub account - it's easier!)
   - Authorize Vercel to access GitHub

2. **Import Project**:
   - Click **Add New...** → **Project**
   - You should see your `ihwc-certificate-system` repository
   - Click **Import**

3. **Configure Project**:
   - Project Name: `ihwc-certificate-system` (or your choice)
   - Framework Preset: **Other**
   - Root Directory: `./` (leave default)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Click **Deploy**

4. **Wait for Deployment**:
   - ⏳ Takes 1-2 minutes
   - You'll see a progress screen
   - ✅ "Congratulations!" screen appears

5. **Get Your Live URL**:
   - Click **Visit** button
   - Your URL will be something like: `https://ihwc-certificate-system.vercel.app`
   - ✅ Your site is LIVE!

---

## ⚙️ Step 6: Configure Vercel Environment Variables (5 minutes)

**Why?** To make the keep-alive cron job work and keep your database active.

1. **In Vercel Dashboard**:
   - Click on your project name
   - Click **Settings** tab
   - Click **Environment Variables** (left menu)

2. **Add Variable 1**:
   - Key: `SUPABASE_URL`
   - Value: `https://zeutkwqvzdymqwezprjn.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

3. **Add Variable 2**:
   - Key: `SUPABASE_ANON_KEY`
   - Value: (paste the LONG key you got from Step 1)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

4. **Redeploy**:
   - Click **Deployments** tab
   - Click the ⋮ (three dots) on latest deployment
   - Click **Redeploy**
   - ✅ Wait for redeployment to finish

---

## ✅ Step 7: Final Testing (5 minutes)

1. **Visit Your Live Site**:
   - Go to your Vercel URL
   - Example: `https://ihwc-certificate-system.vercel.app`

2. **Test Certificate Verification**:
   - Enter: `IHWC2025001`
   - Click "Verify Certificate"
   - ✅ Should show certificate details

3. **Test Admin Login**:
   - Click "Admin Login" in footer
   - Password: `123456789`
   - ✅ Dashboard loads

4. **Test Adding Certificate**:
   - Fill in the form with test data
   - Click "Save Certificate"
   - ✅ Should save and appear in table

5. **Test Keep-Alive Endpoint**:
   - Open new tab
   - Go to: `https://YOUR-SITE.vercel.app/api/keep-alive`
   - ✅ Should see JSON response:
     ```json
     {
       "success": true,
       "message": "Database pinged successfully",
       ...
     }
     ```

---

## 🎉 Success! Your Site is Live!

### Your URLs:
- **Main Site**: `https://your-project.vercel.app`
- **Admin Dashboard**: `https://your-project.vercel.app/#adminpage`
- **GitHub Repo**: `https://github.com/your-username/ihwc-certificate-system`

### Credentials:
- **Admin Password**: `123456789` (change this in `app.js` line 6)
- **Supabase**: Access at https://app.supabase.com
- **Vercel**: Access at https://vercel.com

---

## 🔄 How to Update Your Site Later

### If You Make Changes:

**Using GitHub Desktop:**
1. Make changes to your files
2. Open GitHub Desktop
3. You'll see changed files
4. Add commit message
5. Click "Commit to main"
6. Click "Push origin"
7. ✅ Vercel auto-deploys the changes!

**Using Git Command Line:**
```powershell
git add .
git commit -m "Your change description"
git push
```
✅ Vercel auto-deploys!

---

## 📊 Monitoring

### Check if Cron Job is Working:
1. Wait 1 hour after deployment
2. Go to Vercel Dashboard → Your Project
3. Click **Logs** tab
4. Search for "keep-alive"
5. ✅ Should see hourly successful pings

### Check Supabase Usage:
1. Go to Supabase Dashboard
2. Click **Settings** → **Usage**
3. Monitor database size and API requests

---

## 🆘 Troubleshooting

### Site loads but verification doesn't work:
- ✅ Check if you updated `app.js` with correct anon key
- ✅ Check browser console (F12) for errors
- ✅ Make sure you ran SQL schema in Supabase

### "Error occurred during operation" message:
- ✅ Verify Supabase anon key is correct (should start with `eyJ...`)
- ✅ Check Supabase project is active (not paused)
- ✅ Verify RLS policies are enabled

### Cron job not working:
- ✅ Make sure you added environment variables in Vercel
- ✅ Redeploy after adding variables
- ✅ Wait 1 full hour before checking logs

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console (F12) for errors
2. Check Vercel deployment logs
3. Verify all steps were completed
4. Make sure Supabase anon key is correct format

---

## 🎯 Next Steps After Deployment:

- [ ] Change admin password in `app.js`
- [ ] Add your actual logo (replace `logo.png`)
- [ ] Customize colors in `styles.css`
- [ ] Add real certificate data
- [ ] Set up custom domain (optional)
- [ ] Share with your team!

---

**Congratulations! You've successfully deployed a full-stack application! 🎊**
