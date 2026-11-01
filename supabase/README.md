# Setting up Supabase & Google Authentication for Movieflix

Movieflix comes with a **built-in Demo / Guest Mode** that works out-of-the-box with complete local persistence. When you're ready to enable cloud synchronization and Google OAuth, follow these simple steps:

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, name it (e.g. `movieflix-movies`), set a database password, and choose your preferred region.

---

## 2. Run Database Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Copy all contents from [`supabase/schema.sql`](./schema.sql) and paste them into the SQL editor.
4. Click **Run**. This creates the `profiles`, `ratings`, `watchlist`, and `history` tables with Row Level Security (RLS) enabled.

---

## 3. Enable Google Authentication

1. Go to **Authentication** > **Providers** in Supabase.
2. Select **Google** and toggle it **Enabled**.
3. You will need:
   - **Client ID**
   - **Client Secret**
   - **Callback URL** (Supabase displays this, e.g. `https://<project-ref>.supabase.co/auth/v1/callback`)
4. To get your Client ID & Secret:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - Create an OAuth 2.0 Client ID for a **Web Application**.
   - Add the Supabase Callback URL to **Authorized redirect URIs**.
   - Copy the Client ID & Client Secret into Supabase and click **Save**.

---

## 4. Connect to Movieflix

### Option A: Via the Web UI (Instant)
1. Open Movieflix in your browser.
2. Click the **Supabase Live / Connect** button in the top navbar.
3. Paste your **Project URL** and **Anon Public Key**.
4. Click **Save Credentials & Connect**.

### Option B: Via `.env` file
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
