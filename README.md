# Vehicle Information System

Residential vehicle registry built with **Next.js**, **TypeScript**, **MongoDB Atlas**, **Mongoose**, and **Auth.js (NextAuth)**. Public users can search by vehicle or house number. Admins can manage full CRUD after secure login.

## Technology

- Next.js (App Router)
- React
- TypeScript
- Node.js
- MongoDB Atlas
- Mongoose
- Auth.js / NextAuth
- Tailwind CSS
- GitHub
- Vercel

## Requirements

- **Node.js** (v18.18+ recommended; this project was built with Node 24)
- **npm**
- **MongoDB Atlas** account (Cluster0 or any cluster)
- **GitHub** account (for source control / Vercel import)
- **Vercel** account (for hosting)

> Free-tier limits and eligibility for MongoDB Atlas M0 and Vercel Hobby can change over time.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the example file:

```bash
copy .env.local.example .env.local
```

3. Configure environment variables in `.env.local`:

```text
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/vehicle_information
AUTH_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_SECRET
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
SHOW_PUBLIC_MOBILE=true
AUTH_TRUST_HOST=true
```

Generate a strong `AUTH_SECRET` (example):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Create the first admin (password is hashed with bcrypt before save):

```bash
npm run create-admin
```

If the admin already exists, the script prints `Admin already exists.` and exits.

5. (Optional) Seed ~20 fictional sample vehicles:

```bash
npm run seed
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## MongoDB Atlas setup (Cluster0)

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Open your cluster (for example **Cluster0**).
3. Ensure a database user exists (Database Access).
4. Configure **Network Access** so your local IP (and Vercel egress if needed) can connect. For quick testing you may allow `0.0.0.0/0` — tighten this for production.
5. Click **Connect** → **Drivers** and copy the connection string.
6. Set the database name to `vehicle_information` in the URI path, for example:

```text
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/vehicle_information?appName=Cluster0
```

7. Put that value in `.env.local` as `MONGODB_URI`.

Collections used:

- `vehicles`
- `admins`

**Never commit the real connection string, password, or `AUTH_SECRET`.**

## Admin creation

Set in `.env.local`:

```text
ADMIN_EMAIL=your-email
ADMIN_PASSWORD=your-secure-password
```

Then run:

```bash
npm run create-admin
```

The password is stored only as a bcrypt hash. The script does not print the password.

## Public vs admin features

### Public (no login)

- Search by vehicle number (normalized to uppercase)
- Search by house number
- View matching public fields only

### Admin (login required)

- Dashboard totals (Total / Cars / Bikes / Other)
- List, search, sort, paginate vehicles (20 per page)
- Add / edit / delete vehicles
- Logout via Auth.js session

## API overview

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/vehicles/search?vehicleNumber=` or `?houseNo=` | Public |
| GET | `/api/vehicles` | Admin |
| POST | `/api/vehicles` | Admin |
| GET | `/api/vehicles/[id]` | Admin |
| PUT | `/api/vehicles/[id]` | Admin |
| DELETE | `/api/vehicles/[id]` | Admin |
| GET | `/api/admin/stats` | Admin |

Public search never returns the full database. Mobile numbers can be masked when `SHOW_PUBLIC_MOBILE=false` (display convenience only — the API still decides public fields).

## GitHub

```bash
git init
git add .
git commit -m "Initial Vehicle Information System"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY
git push -u origin main
```

Confirm `.env.local` is **not** staged. The repository `.gitignore` excludes `.env`, `.env.local`, and `.env.*.local`.

## Vercel deployment

```text
GitHub → Vercel → Next.js Application → MongoDB Atlas
```

1. Push the project to GitHub.
2. Open Vercel and import the repository.
3. Add **server-side** environment variables (never mark MongoDB vars as public):

```text
MONGODB_URI
AUTH_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
SHOW_PUBLIC_MOBILE
AUTH_TRUST_HOST=true
```

4. Deploy and test the production URL.
5. Create the admin once against Atlas (locally with production URI, or via a one-off script run) if it does not already exist.

Redeploying frontend code does **not** wipe MongoDB Atlas data — Atlas is the permanent store.

## Security checklist

- [ ] `MONGODB_URI` only in server env (never `NEXT_PUBLIC_*`)
- [ ] `.env.local` not committed
- [ ] Passwords stored as bcrypt hashes only
- [ ] Admin APIs require Auth.js session + admin role
- [ ] Public search requires a scoped query parameter
- [ ] No stack traces returned to clients

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run create-admin` | Create first admin |
| `npm run seed` | Insert sample vehicles |

## License

Private / educational use as needed.
