# 🏋️ TitanSupps - Premium Gym Supplements E-commerce

A high-performance, dark-themed e-commerce platform for gym supplements built with Next.js 14, featuring a cyberpunk aesthetic with neon lime accents.

## ✨ Features

- 🎨 **Dark Mode Design** - Stunning cyberpunk aesthetic with neon lime (#CCFF00) accents
- 🛒 **Persistent Shopping Cart** - Zustand-powered cart that persists across sessions
- 💳 **Atomic Checkout System** - Transaction-based stock deduction with email receipts
- 📧 **Automated Email Receipts** - Professional HTML emails via Resend
- 🔐 **Admin Panel** - Complete CRUD operations for product management
- ⚡ **Performance Optimized** - Built for Lighthouse 100 score
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- 🎭 **Smooth Animations** - Framer Motion powered micro-interactions

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **State Management:** Zustand
- **Emails:** Resend + React Email
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Resend API key (for email receipts)

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd titansupps
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/titansupps?schema=public"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Resend Email
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="TitanSupps <noreply@titansupps.com>"

# Admin Credentials (Initial Setup)
ADMIN_EMAIL="admin@titansupps.com"
ADMIN_PASSWORD="your-admin-password"
```

4. **Set up the database:**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed sample data
npx prisma db seed
```

5. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
titansupps/
├── app/                      # Next.js App Router
│   ├── (store)/             # Public storefront routes
│   ├── admin/               # Admin panel
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── cart/                # Shopping cart components
│   ├── products/            # Product components
│   └── admin/               # Admin components
├── lib/                     # Utilities and configurations
│   ├── prisma.ts           # Prisma client
│   ├── store.ts            # Zustand store
│   └── email.ts            # Email utilities
├── prisma/                  # Database schema
│   └── schema.prisma
├── emails/                  # Email templates
│   └── receipt.tsx
└── types/                   # TypeScript types
    └── index.ts
```

## 🎯 Key Features Explained

### Atomic Stock Deduction

The checkout process uses Prisma transactions to ensure:
1. Stock availability check
2. Order creation
3. Atomic stock decrement
4. Email receipt sending

All operations succeed or fail together, preventing overselling.

### Persistent Cart

The shopping cart uses Zustand with localStorage persistence:
- Survives page refreshes
- Syncs across browser tabs
- Validates stock on checkout

### Admin Panel

Located at `/admin`, the panel allows you to:
- Create new products
- Edit existing products (name, price, stock, description)
- Delete products
- View inventory stats

### Email Receipts

Professional HTML email receipts are automatically sent via Resend:
- Order confirmation
- Itemized list with quantities and prices
- Total amount
- Unique order ID

## 🎨 Design System

### Colors
- **Background:** `#080808`
- **Card:** `#121212`
- **Neon Lime:** `#CCFF00`
- **Border:** `#2a2a2a`

### Typography
- **Font Family:** Outfit (Google Fonts)
- **Headings:** Bold, uppercase with letter-spacing
- **Body:** Regular weight, optimized line-height

### Components
- Glassmorphism effects
- Neon glow on hover
- Smooth transitions (300ms)
- Pulse animations for highlights

## 📦 Sample Product Data

Add products via the admin panel or seed them programmatically:

```typescript
{
  name: "Titan Whey Protein",
  description: "Premium whey isolate with 25g protein per serving",
  price: 49.99,
  stock: 100,
  category: "Protein",
  imageUrl: "https://example.com/protein.jpg",
  featured: true
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Build for production:
```bash
npm run build
npm start
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products` - Update product (admin)
- `DELETE /api/products?id={id}` - Delete product (admin)

### Checkout
- `POST /api/checkout` - Process order and send receipt

## 🎓 Performance Tips

This site is optimized for Lighthouse 100:
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Minimal JavaScript bundle size
- CSS-only animations where possible
- Proper caching headers

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 💬 Support

For questions or issues, please open an issue on GitHub.

---

**Built with 💪 by Claude** | Powered by Next.js, Prisma, and Tailwind CSS
