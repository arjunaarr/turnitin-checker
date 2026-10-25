# Turnitin Check

A modern web application for plagiarism detection using Turnitin technology. Upload your PDF, select detection filters, and get comprehensive plagiarism analysis within minutes.

## Features

- **Fast Detection**: Results in minutes using advanced algorithms
- **Multiple Filters**: Blio, Quotes, Small Match detection options
- **Real-time Tracking**: Live status updates for submissions
- **Secure**: 2-hour auto-delete for privacy
- **Admin Dashboard**: Manage submissions and upload results
- **Modern UI**: Dark theme with liquid glass morphism design

## Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **Payment**: Stripe (test mode)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account
- Stripe account (optional)

### Installation

1. Clone repository
```bash
git clone https://github.com/arjunaarr/turnitin-checker.git
cd turnitin-checker
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` with Firebase credentials
```env
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_key
```

4. Start development server
```bash
npm start
```

Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── context/         # Auth context
├── config/          # Firebase config
└── App.tsx          # Main app
```

## User Flows

### Customer
1. Register/Login → Dashboard
2. Upload PDF + Select filters
3. Payment (simulated)
4. Real-time tracking
5. Download result (2-hour window)

### Admin
1. Login → Admin Panel (`/admin/login`)
2. View submission queue
3. Mark as "Processing"
4. Upload result PDF
5. Auto-notifies customer

## Deployment

### Deploy to Vercel

1. Push to GitHub
```bash
git push origin main
```

2. Go to https://vercel.com
3. Select repository
4. Add environment variables
5. Deploy

Live at: `turnitin-checker.vercel.app`

## Features In Progress

- [ ] Auto-cleanup (2-hour expiry)
- [ ] Real Stripe integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Custom UI/UX redesign

## License

MIT

## Author

arjunaarr

---

**Note**: This is a demonstration project. For production use, implement real payment processing and security measures.
