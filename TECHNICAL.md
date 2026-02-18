# 📖 Technical Documentation

## Architecture Overview

TitanSupps is built as a modern, full-stack e-commerce platform using the Next.js 14 App Router with server-side rendering and API routes.

### Tech Stack Rationale

#### Next.js 14 (App Router)
- **Server Components**: Reduced JavaScript bundle size
- **Streaming**: Progressive page rendering
- **Built-in optimization**: Image optimization, font optimization
- **File-based routing**: Intuitive project structure

#### Prisma ORM
- **Type-safe database queries**: Full TypeScript support
- **Migration management**: Version control for database schema
- **Transaction support**: Critical for checkout atomicity
- **Database agnostic**: Easy to switch between databases

#### Zustand
- **Minimal bundle size**: Only ~1KB
- **No provider wrapping**: Cleaner component tree
- **Persistence middleware**: Built-in localStorage sync
- **TypeScript support**: Full type inference

#### Tailwind CSS
- **Utility-first**: Faster development
- **Tree-shaking**: Only used classes in production
- **JIT compiler**: Minimal CSS bundle
- **Dark mode**: Built-in with class strategy

## Database Schema

### Product Model
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  stock       Int
  category    String
  imageUrl    String
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Indexes:**
- `category`: Fast filtering
- `featured`: Homepage query optimization

### Order Model
```prisma
model Order {
  id            String      @id @default(cuid())
  userId        String
  totalAmount   Float
  status        String      @default("completed")
  customerEmail String
  customerName  String
  items         OrderItem[]
  createdAt     DateTime    @default(now())
}
```

**Indexes:**
- `userId`: User order history
- `createdAt`: Chronological sorting

### OrderItem Model
```prisma
model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  order     Order    @relation(fields: [orderId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}
```

## Key Features Implementation

### 1. Atomic Stock Deduction

**Problem**: Race conditions during checkout could lead to overselling

**Solution**: Prisma transactions

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Validate stock
  // 2. Create order
  // 3. Decrement stock atomically
})
```

**Benefits:**
- All-or-nothing execution
- Prevents overselling
- Data consistency guaranteed

### 2. Persistent Shopping Cart

**Implementation**: Zustand with localStorage persistence

```typescript
persist(
  (set, get) => ({
    items: [],
    addItem: (item) => { /* ... */ },
    // ...
  }),
  { name: 'titan-cart-storage' }
)
```

**Features:**
- Survives page refresh
- Cross-tab synchronization
- Automatic hydration
- Stock validation

### 3. Email Receipts

**Flow:**
1. Order created successfully
2. React Email template rendered to HTML
3. Resend API sends email
4. Async to not block checkout

**Template Structure:**
- Professional HTML with inline CSS
- Responsive design
- Itemized order details
- Branding consistent with site

### 4. Admin Panel

**Security Considerations:**
- Currently open (add authentication!)
- CRUD operations via API routes
- Server-side validation
- Optimistic UI updates

**Recommended Auth:**
```typescript
// middleware.ts
export { default } from "next-auth/middleware"
export const config = { matcher: ["/admin/:path*"] }
```

## Performance Optimizations

### 1. Image Optimization
- Next.js Image component
- WebP/AVIF formats
- Lazy loading
- Size optimization

### 2. Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components
- Tree-shaking unused code

### 3. Caching Strategy
```typescript
// Static pages (60s revalidation)
export const revalidate = 60

// Dynamic admin (no cache)
export const revalidate = 0
```

### 4. Font Optimization
- Google Fonts via next/font
- Self-hosted fonts
- FOUT prevention
- Preload critical fonts

## API Routes

### POST /api/checkout
**Request:**
```json
{
  "items": [
    { "productId": "...", "quantity": 2 }
  ],
  "customerName": "John Doe",
  "customerEmail": "john@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "orderId": "clx..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Insufficient stock for Titan Whey..."
}
```

### GET /api/products
Returns all products

### POST /api/products
Creates a new product (admin)

### PUT /api/products
Updates an existing product (admin)

### DELETE /api/products?id={id}
Deletes a product (admin)

## State Management

### Global State (Zustand)
- Shopping cart
- Cart open/close state
- Cart item counts
- Total calculations

### Server State (React Query Alternative)
- Uses Next.js built-in data fetching
- Server Components for initial data
- `useRouter().refresh()` for mutations

### Local State (useState)
- Form inputs
- Dialog open/close
- Loading states
- UI interactions

## Styling Architecture

### CSS Variables
```css
--background: #080808
--card: #121212
--neon: #CCFF00
--border: #2a2a2a
```

### Component Classes
```css
.btn-primary: Primary action button
.btn-secondary: Secondary action button
.card: Content card
.product-card: Product display card
.glass: Glassmorphism effect
```

### Animations
- CSS-based for performance
- Framer Motion for complex interactions
- Tailwind animate utilities
- Custom keyframes

## Error Handling

### API Routes
- Try-catch blocks
- Descriptive error messages
- Proper HTTP status codes
- Error logging

### Client Components
- Toast notifications
- Loading states
- Disabled states during async
- Error boundaries (recommended)

## Security Considerations

### Current Implementation
⚠️ **Admin panel is open** - Add authentication!

### Recommended Additions
1. **NextAuth.js** for admin authentication
2. **Rate limiting** on API routes
3. **CSRF tokens** for mutations
4. **Input sanitization** for user data
5. **SQL injection prevention** (Prisma handles this)

## Testing Strategy (Recommended)

### Unit Tests
- Utility functions
- Component logic
- Store actions

### Integration Tests
- API routes
- Database operations
- Checkout flow

### E2E Tests
- User purchase flow
- Admin product management
- Cart interactions

## Deployment Checklist

- [ ] Set production DATABASE_URL
- [ ] Set NEXTAUTH_SECRET
- [ ] Configure RESEND_API_KEY
- [ ] Set EMAIL_FROM domain
- [ ] Run database migrations
- [ ] Seed production data
- [ ] Test checkout flow
- [ ] Add authentication to admin
- [ ] Configure custom domain
- [ ] Set up monitoring/analytics

## Future Enhancements

### High Priority
1. Admin authentication (NextAuth.js)
2. Payment integration (Stripe)
3. Order tracking for customers
4. Email verification

### Medium Priority
1. Product reviews and ratings
2. Search with Algolia/Meilisearch
3. Wishlist functionality
4. Related products

### Nice to Have
1. Product variants (sizes, flavors)
2. Discount codes
3. Loyalty program
4. Live chat support

## Performance Benchmarks

### Target Metrics (Lighthouse)
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Optimization Techniques
1. Image optimization (WebP/AVIF)
2. Code splitting
3. Server-side rendering
4. Static generation where possible
5. Minimal JavaScript
6. CSS-only animations
7. Preload critical resources

## Contributing Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Meaningful variable names
- Component composition

### Commit Messages
- Conventional commits
- Descriptive messages
- Reference issue numbers

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with description
5. Request review

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Resend Docs](https://resend.com/docs)

---

**Last Updated:** February 2024
