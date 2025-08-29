# C-Matrix Learning - Frontend

A modern, responsive React application for the C-Matrix Learning platform built with React, Tailwind CSS v4, and Zustand.

## 🚀 Features Implemented

### ✅ Core Infrastructure
- **React 19** with modern hooks and components
- **Tailwind CSS v4** with custom theme configuration
- **React Router DOM** for client-side routing
- **Zustand** for state management
- **React Hot Toast** for notifications
- **Lucide React** for beautiful icons

### ✅ UI Components
- **Responsive Layout System**: Header, Footer, Sidebar with mobile support
- **Reusable Components**: Button, Input, Modal, Loader, ThemeToggle
- **CourseCard**: Beautiful course display with hover effects
- **Dark/Light Mode**: Complete theme system with persistence

### ✅ Pages & Routing
- **HomePage**: Hero section, features, course preview, statistics
- **CoursesPage**: Course catalog with search, filtering, and grid/list views
- **StudentDashboard**: Learning streaks, progress tracking, quick actions
- **Protected Routes**: Authentication-based route protection
- **404 Page**: Custom not found page

### ✅ State Management
- **Authentication Store**: User state, login/logout functionality
- **Theme Store**: Dark/light mode with system preference detection
- **Persistent Storage**: Zustand with localStorage integration

### ✅ Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Tailwind CSS**: Utility-first styling with custom components
- **Dark Mode**: Complete dark theme implementation
- **Smooth Transitions**: Enhanced user experience with animations

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Atomic components
│   └── layout/          # Layout components
├── layouts/             # Page layouts
├── pages/               # Application pages
├── services/            # API service layer (ready for backend)
├── store/               # Zustand state stores
├── hooks/               # Custom React hooks
├── utils/               # Helper functions and constants
└── config/              # Configuration files
```

### Key Patterns
- **Component Composition**: Reusable, composable components
- **Layout Wrapping**: Consistent layouts across pages
- **State Separation**: Clear separation of concerns in state management
- **Route Protection**: Authentication-based route guards

## 🎨 Design System

### Colors
- **Primary**: Blue gradient for CTAs and highlights
- **Success**: Green for positive actions and completion states
- **Warning**: Yellow/Orange for streaks and achievements
- **Error**: Red for errors and destructive actions

### Typography
- **Inter Font**: Modern, clean typography
- **Responsive Text**: Scales appropriately across devices
- **Dark Mode Support**: Proper contrast ratios for accessibility

### Components
- **Consistent Spacing**: 4px grid system via Tailwind
- **Rounded Corners**: Consistent border radius throughout
- **Shadows**: Subtle shadows for depth and hierarchy
- **Transitions**: Smooth 200ms transitions for interactions

## 🔧 Configuration

### Tailwind CSS v4
- Custom theme variables in `index.css`
- CSS-first configuration approach
- Native cascade layers support
- Dark mode with `dark:` prefix

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚧 Next Steps

### Authentication System
- Login/Signup pages with form validation
- JWT token management
- Password reset functionality

### API Integration
- Axios interceptors for authentication
- Service layer for API calls
- Error handling and loading states

### Advanced Features
- **Kanban Board**: Drag-and-drop task management
- **TODO Modal**: Quick task creation and management
- **Learning Streaks**: Gamification system
- **Course Progress**: Detailed progress tracking

### Performance Optimization
- Code splitting for routes
- Image optimization
- Bundle analysis and optimization

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1279px
- **Large**: 1280px+

## 🌙 Dark Mode

The application supports system preference detection and manual toggle. Theme preference is persisted in localStorage.

## 🎯 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Notes

- All components are built with accessibility in mind
- Dummy data is used throughout for development
- API integration points are prepared but not implemented
- The application is ready for backend integration

---

**Ready for API Integration**: The frontend is fully prepared to connect with your backend API. Simply replace dummy data with API calls in the service layer.