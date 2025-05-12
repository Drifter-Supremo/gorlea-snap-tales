# Tech Context: Gorlea Snaps

## Technologies Used

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Router for navigation
- React Query for data fetching and caching
- Lucide React for icons

### Backend (Planned/Required)
- Firebase Authentication for user management
- Firebase Storage for image uploads
- Firestore for database
- Firebase Cloud Functions for serverless API endpoints
- OpenAI GPT 4.1 API for story generation

## Development Setup

- Node.js (v18+) and npm required
- VS Code or preferred code editor
- Firebase CLI for project management
- Vercel CLI for deployment
- Environment variables managed via `.env.local` (local) and Vercel dashboard (production)

## Technical Constraints

- Mobile-first responsive design is mandatory
- All user data and images must be securely handled (Firebase security rules)
- API keys and secrets must not be exposed in the frontend
- Story generation must be performant (target <15s per story)
- Image uploads must be optimized for size and speed

## Dependencies

- All frontend dependencies managed via npm and listed in `package.json`
- Firebase and OpenAI dependencies required for backend integration
- Testing libraries (to be added) for unit and integration tests
- Deployment via Vercel with environment-specific configuration
