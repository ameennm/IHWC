# IHWC - Certificate Verification System

A complete certificate verification and management system built with HTML, JavaScript, Supabase, and deployed on Vercel.

## 🚀 Features

- **Certificate Verification**: Public certificate verification by certificate number
- **Admin Dashboard**: Complete CRUD operations for certificate management
- **Responsive Design**: Works on all devices (desktop, tablet, mobile)
- **Secure Database**: Powered by Supabase PostgreSQL
- **Beautiful UI**: Modern, clean design with smooth animations
- **Real-time Stats**: Dashboard statistics for certificates, students, and institutions

## 📋 Prerequisites

Before you begin, you need:

1. **Supabase Account** - [Sign up at supabase.com](https://supabase.com)
2. **Vercel Account** - [Sign up at vercel.com](https://vercel.com)
3. **Git** (optional, for version control)

## 🔧 Setup Instructions

### Step 1: Set Up Supabase Database

1. **Create a new Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details and create the project
   - Wait for the project to be ready (takes 1-2 minutes)

2. **Run the SQL Schema**:
   - In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
   - Click "New Query"
   - Copy the entire contents of `supabase-schema.sql` file
   - Paste it into the SQL editor
   - Click "Run" or press `Ctrl+Enter`
   - You should see a success message

3. **Get Your Supabase Credentials**:
   - Go to **Project Settings** (gear icon in left sidebar)
   - Click on **API** tab
   - Copy these two values:
     - `Project URL` (example: https://xxxxx.supabase.co)
     - `anon/public` API key (a long JWT token)

### Step 2: Update Your Code

1. **Open `app.js` file**

2. **Update Supabase Configuration** (lines 2-3):
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
   ```
   Replace with your actual Supabase URL and anon key

3. **Change Admin Password** (line 6):
   ```javascript
   const ADMIN_PASSWORD = "123456789"; // Change this!
   ```
   Replace `123456789` with a strong password

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if not already):
   - Create a new repository on GitHub
   - Push your project files to the repository

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings
   - Click "Deploy"
   - Wait for deployment to complete (1-2 minutes)

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Your site will be deployed and you'll get a URL

### Step 4: Test Your Application

1. **Visit your deployed URL** (e.g., `https://your-project.vercel.app`)

2. **Test Certificate Verification**:
   - On the home page, enter a sample certificate number: `IHWC2025001`
   - Click "Verify Certificate"
   - You should see certificate details in a modal

3. **Test Admin Dashboard**:
   - Click "Admin Login" in the footer
   - Enter your admin password (default: `123456789`)
   - You should see the admin dashboard with sample data

4. **Test Adding a Certificate**:
   - Fill in the form with new certificate details
   - Click "Save Certificate"
   - You should see a success message and the new certificate in the table

## 🗂️ Project Structure

```
ihwc-certificate-system/
├── index.html              # Main HTML file
├── styles.css              # All CSS styles
├── app.js                  # JavaScript + Supabase integration
├── supabase-schema.sql     # Database schema
├── vercel.json             # Vercel configuration
├── supabase-loader.html    # Supabase library loader
└── README.md               # This file
```

## 🔒 Security Notes

### Current Setup (Development/Testing)
- The current setup has **public** RLS policies that allow anyone to read and write
- This is fine for testing but **NOT recommended for production**

### For Production
You should update the RLS policies in Supabase:

1. Go to **Authentication** > **Policies** in Supabase
2. Create stricter policies:
   - **SELECT**: Allow public (for verification)
   - **INSERT/UPDATE/DELETE**: Require authentication

Example secure policy for INSERT:
```sql
CREATE POLICY "Authenticated users can insert" 
ON certificates FOR INSERT 
TO authenticated
WITH CHECK (true);
```

## 🎨 Customization

### Change Colors
Edit `styles.css` and update the CSS variables:
```css
:root {
  --primary-green: #6ECB63;
  --primary-dark: #56AB4A;
  --primary-light: #9EE493;
  --accent-green: #B7EFC5;
  --light-bg: #F0FFF4;
}
```

### Add Logo
- Replace `logo.png` with your actual logo image
- Or remove the logo by deleting line 20 in `index.html`

### Modify Course Durations
Edit the `<select id="duration">` dropdown in `index.html` (lines 241-250)

## 📊 Database Schema

The `certificates` table has the following structure:

| Column       | Type      | Description                    |
|--------------|-----------|--------------------------------|
| id           | BIGSERIAL | Primary key (auto-increment)   |
| cert_number  | TEXT      | Unique certificate number      |
| student_name | TEXT      | Student's full name            |
| course       | TEXT      | Course name                    |
| duration     | TEXT      | Course duration                |
| institution  | TEXT      | Institution name               |
| issue_date   | DATE      | Certificate issue date         |
| created_at   | TIMESTAMP | Record creation timestamp      |
| updated_at   | TIMESTAMP | Last update timestamp          |

## 🐛 Troubleshooting

### Certificates not loading?
- Check browser console for errors (F12)
- Verify Supabase URL and API key in `app.js`
- Make sure you ran the SQL schema in Supabase
- Check RLS policies are enabled

### Admin login not working?
- Verify you're using the correct password from `app.js`
- Check browser console for errors

### Deployment failed on Vercel?
- Make sure all files are in the root directory
- Check `vercel.json` is present
- Try deleting `.vercel` folder and redeploying

## 📝 Admin Credentials

**Default Admin Password**: `123456789`

⚠️ **IMPORTANT**: Change this password in `app.js` before deploying to production!

## 🌐 Live Demo Features

- ✅ Certificate verification
- ✅ Admin dashboard
- ✅ Add/Edit/Delete certificates
- ✅ Search and filter
- ✅ Responsive design
- ✅ Real-time statistics

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Verify Supabase connection
3. Check Vercel deployment logs

## 📄 License

This project is open source and available for educational purposes.

---

**Built with ❤️ using HTML, CSS, JavaScript, Supabase & Vercel**
