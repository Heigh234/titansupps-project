# 🚀 Quick Setup Guide

Follow these steps to get TitanSupps running on your local machine:

## 1️⃣ Prerequisites Check

Make sure you have:
- ✅ Node.js 18 or higher (`node -v`)
- ✅ PostgreSQL installed and running
- ✅ npm or yarn package manager
- ✅ Resend API key ([Get one here](https://resend.com))

## 2️⃣ Database Setup

### Option A: Local PostgreSQL

1. Create a new database:
```sql
CREATE DATABASE titansupps;
```

2. Note your connection string:
```
postgresql://username:password@localhost:5432/titansupps
```

### Option B: Hosted Database (Recommended for Production)

Use one of these providers:
- [Supabase](https://supabase.com) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)
- [Railway](https://railway.app)

## 3️⃣ Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your values:
```env
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="TitanSupps <noreply@yourdomain.com>"
```

## 4️⃣ Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed sample products (optional but recommended)
npm run seed
```

## 5️⃣ Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 6️⃣ Test the Features

1. **Browse Products**: Navigate to `/products` to see all supplements
2. **Add to Cart**: Click on any product and add it to your cart
3. **Checkout**: Click the cart icon, fill in details, and place an order
4. **Check Email**: You should receive an order receipt at the email you provided
5. **Admin Panel**: Visit `/admin` to manage products

## 🎨 Customize Your Store

### Change Brand Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  background: '#080808',
  card: '#121212',
  neon: '#CCFF00', // Change this to your brand color!
}
```

### Update Store Name

Replace "TitanSupps" in:
- `app/layout.tsx` (metadata)
- `components/navigation.tsx` (logo)
- Email templates in `emails/receipt.tsx`

### Add Your Products

1. Go to `/admin`
2. Click "Add Product"
3. Fill in the form with your product details
4. Set featured products to display on homepage

## 🐛 Common Issues

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Ensure database exists

### Email Not Sending
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for errors
- Ensure EMAIL_FROM domain is verified in Resend

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

## 📚 Next Steps

- Read the full [README.md](README.md)
- Deploy to [Vercel](https://vercel.com)
- Set up authentication for admin panel
- Add payment integration (Stripe recommended)

## 💬 Need Help?

- Check the [README.md](README.md) for detailed docs
- Review Prisma docs: https://www.prisma.io/docs
- Review Next.js docs: https://nextjs.org/docs

Happy building! 💪
