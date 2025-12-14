# Quick Start Guide - A4CO Dashboard

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+
- pnpm (or npm)
- Backend services running

## 1. Install Dependencies

```bash
cd apps/dashboard-client
pnpm install
```

## 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 3. Start Development Server

```bash
pnpm dev
```

## 4. Open Browser

Navigate to: [http://localhost:3000](http://localhost:3000)

## 5. Login

Use your backend credentials:
- Email: `test@example.com`
- Password: `password123`

## That's it! 🎉

You should now see the products catalog.

---

## Common Issues

### "Connection refused" error
- ✅ **Fix**: Make sure API Gateway is running on port 4000
  ```bash
  cd apps/gateway
  pnpm dev
  ```

### "Module not found" error
- ✅ **Fix**: Reinstall dependencies
  ```bash
  pnpm install
  ```

### Login doesn't work
- ✅ **Fix**: Check backend logs for authentication errors
- ✅ **Fix**: Verify user exists in database

### Products page is empty
- ✅ **Fix**: Seed database with test products
- ✅ **Fix**: Check product service is running

---

## Development Workflow

1. **Make changes** to components in `components/` or pages in `app/`
2. **Hot reload** automatically refreshes browser
3. **Check console** for errors or warnings
4. **Test manually** using the testing guide
5. **Commit** when feature works

---

## Useful Commands

```bash
# Development
pnpm dev          # Start dev server (port 3000)

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript check (if configured)

# Clean
rm -rf .next      # Clear Next.js cache
rm -rf node_modules  # Remove dependencies
pnpm install      # Reinstall
```

---

## Project Structure Overview

```
apps/dashboard-client/
├── app/              ← Pages (Next.js App Router)
├── components/       ← UI Components
├── lib/              ← Services, types, utilities
└── public/           ← Static assets
```

---

## Key Files

- `app/login/page.tsx` - Login page
- `app/dashboard/products/page.tsx` - Products catalog
- `app/dashboard/orders/page.tsx` - Orders list
- `lib/services/` - API services
- `lib/types/` - TypeScript definitions
- `components/ui/` - Reusable UI components

---

## Need Help?

- 📖 Read full [README.md](./README.md)
- 🧪 Check [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- 🐛 Review browser console for errors
- 🔍 Check network tab for API calls

---

## Next Steps

1. ✅ Login successfully
2. ✅ Browse products
3. ✅ Create a test order
4. ✅ View order status
5. ✅ Test different scenarios

Happy coding! 💻
