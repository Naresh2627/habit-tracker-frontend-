# 🎯 Habit Tracker - Frontend

A modern React-based habit tracking application with beautiful UI and comprehensive features.

## ✨ Features

- 🔐 **Authentication**: Email/password login and Google SSO
- 🎯 **Habit Management**: Create, edit, and delete daily habits
- 📅 **Calendar View**: Visual habit completion history
- 📊 **Progress Tracking**: Streaks, statistics, and completion rates
- 🌙 **Dark/Light Theme**: Toggle between themes
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service (PostgreSQL + Auth)
- **React Router** - Client-side routing
- **Date-fns** - Date manipulation library
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main app layout
│   └── ProtectedRoute.js # Route protection
├── contexts/           # React contexts for state management
│   ├── AuthContext.js  # Authentication state
│   ├── HabitContext.js # Habit management state
│   └── ThemeContext.js # Theme switching
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Today.js        # Today's habits dashboard
│   ├── Habits.js       # Habit management
│   ├── Calendar.js     # Calendar view
│   ├── Progress.js     # Progress analytics
│   ├── Share.js        # Social sharing
│   └── Profile.js      # User profile
├── config/
│   └── supabase.js     # Supabase client configuration
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## 🎨 Available Pages

### 📊 Today Dashboard
- View today's habits checklist
- Mark habits as complete/incomplete
- See completion progress and motivational messages
- Quick access to create new habits

### 🎯 Habit Management
- Create new habits with emojis, categories, and colors
- Edit existing habits
- Delete habits (with confirmation)
- View habit statistics (current streak, best streak, total completions)

### 📅 Calendar View
- Monthly calendar with visual completion indicators
- Click dates to view/edit habit progress
- Filter by specific habits
- Color-coded completion status
- Monthly statistics

### 📈 Progress Analytics
- Detailed progress tracking (coming soon)
- Streak analysis
- Completion rate charts
- Export functionality

### 🌐 Social Sharing
- Share progress with others (coming soon)
- Generate shareable progress cards
- Public progress pages

### 👤 Profile Settings
- Update user information
- Toggle between light/dark themes
- Account management

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
# Required - Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional - Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Set up the database schema (see backend documentation)
4. Configure authentication providers if using Google SSO

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Set environment variables in Vercel dashboard

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag the `build` folder to [netlify.com](https://netlify.com)
3. Set environment variables in Netlify dashboard

## 🎨 Customization

### Themes
The app supports light and dark themes. Customize colors in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Components
All components are in the `src/components` directory and use Tailwind CSS classes for styling.

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify your Supabase URL and anon key
   - Check if your Supabase project is active

2. **Authentication Issues**
   - Ensure RLS policies are set up correctly
   - Check Supabase Auth settings

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors if using TS

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Create an issue in the GitHub repository

---

Built with ❤️ using React and Supabase