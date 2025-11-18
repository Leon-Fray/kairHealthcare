# Kari Healthcare Platform

A full-stack healthcare booking platform that connects patients with healthcare practitioners. Built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

## Features

- **User Authentication**: Secure sign-up and sign-in for patients, practitioners, and admins
- **Role-Based Access**: Different dashboards and features for each user type
- **Practitioner Discovery**: Search and filter healthcare practitioners by specialty, consultation type, and ratings
- **Appointment Booking**: Easy-to-use booking system with date/time selection
- **Practitioner Profiles**: Detailed profiles with credentials, bio, reviews, and ratings
- **Patient Dashboard**: View upcoming and past appointments
- **Practitioner Dashboard**: Manage schedule, view appointments, and update profile
- **Admin Panel**: User management and platform administration
- **AI Health Assistant**: Chatbot that recommends practitioners based on symptoms
- **File Uploads**: Profile pictures and ID verification for practitioners
- **Reviews & Ratings**: Patient feedback system

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with custom healthcare theme
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Leon-Fray/kairHealthcare.git
cd kariHealth
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Set up the database:
   - Follow the instructions in `DATABASE_SETUP.md`
   - Run all SQL commands in your Supabase SQL Editor

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Patient dashboard
│   ├── practitioner/      # Practitioner pages
│   ├── admin/             # Admin panel
│   ├── search/            # Search practitioners
│   ├── booking/           # Appointment booking
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── ui/               # UI components (Shadcn)
│   ├── layout/           # Layout components
│   └── ...               # Feature components
├── lib/                  # Utility functions
│   ├── database.ts       # Database queries
│   ├── supabaseClient.ts # Supabase client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript types
└── icons/               # Logo images
```

## User Roles

### Patient
- Browse and search practitioners
- Book appointments
- View appointment history
- Leave reviews
- Access AI health assistant

### Practitioner
- Create professional profile
- Manage schedule
- View appointments
- Update profile and credentials
- Upload profile picture and ID

### Admin
- Manage all users
- Create new users
- Update user roles
- Platform administration

## Design System

### Colors
- **Primary**: Green (#059669) - Healthcare & wellness
- **Secondary Patient**: Cyan/teal (#1cabb0)
- **Secondary Doctor**: Lime green (#8cc342)

### Theme
- Nature-inspired healthcare theme with leaf motifs
- Soft rounded corners (0.75rem)
- Smooth transitions and animations
- Responsive design (mobile-first)

## Key Pages

- `/` - Landing page
- `/auth/sign-in` - Sign in
- `/auth/sign-up` - Patient signup
- `/practitioner-signup` - Practitioner registration (multi-step)
- `/dashboard` - Patient dashboard
- `/practitioner/dashboard` - Practitioner dashboard
- `/search` - Search practitioners
- `/practitioner/[id]` - Practitioner profile
- `/booking/[practitionerId]` - Book appointment
- `/admin/users` - Admin user management

## Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New UI Components

We use Shadcn UI. To add components:

```bash
npx shadcn-ui@latest add [component-name]
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=       # Supabase service role key (server-side only)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests if applicable
5. Submit a pull request

## Security

- All routes are protected with authentication
- Row Level Security (RLS) enabled on all database tables
- File uploads are validated (type and size)
- Passwords are hashed by Supabase Auth
- Service role key only used server-side

## License

ISC

## Support

For issues and questions:
- Open an issue on GitHub
- Check the `DATABASE_SETUP.md` for database-related issues
- Review the Supabase documentation

## Roadmap

- [ ] Email notifications
- [ ] Real-time updates
- [ ] Calendar integration
- [ ] Payment processing
- [ ] Video consultations
- [ ] Mobile app
- [ ] Multi-language support

---

Built with ❤️ using Next.js and Supabase

