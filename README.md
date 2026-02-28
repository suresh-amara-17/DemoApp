# Authentication App with Next.js

A simple, beginner-friendly authentication demo built with Next.js, React, and Tailwind CSS.

## 📁 Folder Structure

```
frontend/
├── app/
│   ├── components/
│   │   └── Sidebar.js              # Dashboard sidebar component
│   ├── context/
│   │   └── AuthContext.js          # Authentication context and hooks
│   ├── dashboard/
│   │   ├── layout.js               # Dashboard layout with sidebar
│   │   ├── page.js                 # Dashboard home page
│   │   ├── invoices/
│   │   │   └── page.js             # Invoices page
│   │   └── purchases/
│   │       └── page.js             # Purchases page
│   ├── login/
│   │   └── page.js                 # Login page
│   ├── signup/
│   │   └── page.js                 # Signup page
│   ├── ClientLayout.js             # Client-side layout wrapper
│   ├── page.js                     # Home page
│   ├── layout.js                   # Root layout
│   └── globals.css                 # Global styles
├── public/                          # Static assets
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                       # Git ignore file
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open in browser:**
Go to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication Flow

### How it works:
- **localStorage**: User credentials are stored in browser's localStorage (beginner-friendly)
- **AuthContext**: Provides authentication state globally across the app
- **Protected Routes**: Dashboard routes redirect to login if not authenticated
- **Auto-redirect**: Logged-in users are automatically redirected to dashboard

### Key Features:
- ✅ Simple signup with name, email, and password
- ✅ Login with email and password
- ✅ Dashboard accessible only when logged in
- ✅ Logout functionality
- ✅ Session persistence (stays logged in on page reload)
- ✅ Responsive design with Tailwind CSS

## 📱 Pages

### Public Pages
- **`/`** - Home page with Login/Signup buttons
- **`/login`** - Login form
- **`/signup`** - Signup form

### Protected Pages (Require Login)
- **`/dashboard`** - Dashboard home with welcome message
- **`/dashboard/invoices`** - Invoices table with sample data
- **`/dashboard/purchases`** - Purchases table with sample data

## 🧩 Components

### AuthContext
Located at `app/context/AuthContext.js`
- **useAuth hook**: Access user, loading state, and auth functions
- **login()**: Authenticate user
- **signup()**: Create new account
- **logout()**: Clear session and redirect to home

### Sidebar
Located at `app/components/Sidebar.js`
- Dashboard navigation
- User greeting
- Logout button

## 🛠️ Available Scripts

```bash
# Development server
npm run dev

# Production build
npm build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🎨 Technologies Used

- **[Next.js](https://nextjs.org/)** - React framework
- **[React](https://react.dev/)** - UI library
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)** - Language

## 📝 Sample Credentials

You can use any email and password to test:
- Email: `test@example.com`
- Password: `Anything123`

The app stores user data in localStorage, so it's only for demonstration purposes.

## ⚠️ Important Notes

### Development vs Production
- **This is a learning project** - Do NOT use this authentication in production
- **localStorage is not secure** for sensitive data
- For production, use:
  - Backend API with secure session tokens
  - JWT (JSON Web Tokens) with HttpOnly cookies
  - Password hashing (bcrypt, etc.)
  - Database for user storage

## 🚀 Next Steps for Production

1. Add backend API with Node.js/Express
2. Implement proper password hashing
3. Use HTTP-only cookies for sessions
4. Add CSRF protection
5. Add input validation and sanitization
6. Implement proper error handling
7. Add email verification
8. Add password reset functionality
9. Add two-factor authentication

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## 📄 License

This project is open source and available for educational purposes.

---

**Happy coding!** 🎉
