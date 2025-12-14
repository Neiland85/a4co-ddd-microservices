# Testing Guide - A4CO Dashboard Client

## Prerequisites

1. **Backend Services Running**
   - API Gateway: `http://localhost:4000`
   - Auth Service: Connected
   - Product Service: Connected
   - Order Service: Connected

2. **Test Data**
   - User account with valid credentials
   - Products in database with stock > 0

## Manual Testing Checklist

### 🔐 Authentication Tests

#### ✅ Test 1: Successful Login
1. Navigate to `http://localhost:3000`
2. Should redirect to `/login`
3. Enter valid credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Iniciar Sesión"
5. **Expected**: Toast shows "¡Bienvenido!"
6. **Expected**: Redirected to `/dashboard/products`
7. **Expected**: Token saved in localStorage
8. **Expected**: Sidebar shows user info

#### ❌ Test 2: Failed Login
1. Go to `/login`
2. Enter invalid credentials
3. Click "Iniciar Sesión"
4. **Expected**: Error toast appears
5. **Expected**: Remains on login page
6. **Expected**: No token in localStorage

#### 🔄 Test 3: Session Persistence
1. Login successfully
2. Refresh the page
3. **Expected**: Remains logged in
4. **Expected**: No redirect to login
5. **Expected**: User data loaded from localStorage

#### 🚪 Test 4: Logout
1. While logged in, click "Cerrar Sesión" in sidebar
2. **Expected**: Redirected to `/login`
3. **Expected**: localStorage cleared
4. **Expected**: No auth token present

#### ⏱️ Test 5: Session Expiry
1. Login with valid credentials
2. Manually expire token or wait for expiration
3. Make any API call (refresh orders, view products)
4. **Expected**: Auto-redirect to `/login`
5. **Expected**: Toast: "Sesión expirada"
6. **Expected**: localStorage cleared

---

### 📦 Products Tests

#### ✅ Test 6: View Products
1. Login and navigate to `/dashboard/products`
2. **Expected**: Loading spinner appears
3. **Expected**: Products grid displays
4. **Expected**: Each card shows:
   - Product name
   - Description
   - Price
   - Stock availability
   - "Comprar" button

#### 🔍 Test 7: Search Products
1. On products page, type in search box: "laptop"
2. **Expected**: Filtered products appear
3. Clear search
4. **Expected**: All products shown again

#### 🎯 Test 8: Filter Available Only
1. On products page, check "Solo disponibles"
2. **Expected**: Only products with stock > 0 shown
3. Uncheck filter
4. **Expected**: All products visible again

#### ⚠️ Test 9: Empty Products
1. If no products in database
2. **Expected**: Message: "No hay productos disponibles"

---

### 🛒 Order Creation Tests

#### ✅ Test 10: Create Order Successfully
1. On products page, click "Comprar" on available product
2. **Expected**: Modal opens with product info
3. Set quantity: `2`
4. Enter shipping address: "Calle Test 123, Sevilla, 41001"
5. Click "Confirmar Compra"
6. **Expected**: Loading button shows "Procesando..."
7. **Expected**: Success toast: "¡Orden creada exitosamente!"
8. **Expected**: Redirected to `/dashboard/orders/[orderId]`
9. **Expected**: Order detail page shows correct info

#### ❌ Test 11: Order with Insufficient Stock
1. Click "Comprar" on product with stock = 1
2. Set quantity: `10` (more than stock)
3. Enter shipping address
4. Click "Confirmar"
5. **Expected**: Error toast appears
6. **Expected**: Order not created
7. **Expected**: Modal remains open

#### ⚠️ Test 12: Order without Address
1. Click "Comprar" on product
2. Set quantity but leave address empty
3. Click "Confirmar"
4. **Expected**: Warning toast: "Por favor ingresa una dirección"
5. **Expected**: Form not submitted

#### 🔄 Test 13: Cancel Order Creation
1. Click "Comprar"
2. Modal opens
3. Click "Cancelar" or X button
4. **Expected**: Modal closes
5. **Expected**: No order created
6. **Expected**: Remains on products page

---

### 📊 Orders List Tests

#### ✅ Test 14: View Orders List
1. Navigate to `/dashboard/orders`
2. **Expected**: Loading spinner appears
3. **Expected**: Orders table displays
4. **Expected**: Columns show:
   - Order ID
   - Date created
   - Total amount
   - Status badge

#### 🎨 Test 15: Status Badges Colors
1. On orders list, verify badge colors:
   - **PENDING**: Blue badge
   - **CONFIRMED**: Green badge
   - **FAILED**: Red badge
   - **CANCELLED**: Red badge

#### 🔄 Test 16: Refresh Orders
1. On orders page, click "Actualizar" button
2. **Expected**: Refresh icon spins
3. **Expected**: Orders list reloads
4. **Expected**: Success toast: "Órdenes actualizadas"

#### ⚠️ Test 17: Empty Orders
1. If user has no orders
2. **Expected**: Message: "No hay órdenes registradas"

---

### 📄 Order Detail Tests

#### ✅ Test 18: View Order Detail
1. From orders list, click on any order row
2. **Expected**: Navigated to `/dashboard/orders/[id]`
3. **Expected**: Order detail page shows:
   - Order ID
   - Creation date
   - Status badge
   - Shipping address
   - Product list with quantities
   - Total amount
   - Event timeline

#### 📜 Test 19: Order Timeline
1. On order detail page, scroll to timeline
2. **Expected**: Events shown in chronological order
3. **Expected**: Each event has:
   - Icon (checkmark, circle, or X)
   - Event name
   - Timestamp

#### 🔙 Test 20: Back to Orders
1. On order detail page, click "Volver a órdenes"
2. **Expected**: Navigate back to `/dashboard/orders`

---

### 🎨 UI/UX Tests

#### 📱 Test 21: Mobile Responsive (320px-767px)
1. Resize browser to mobile width
2. **Expected**: Sidebar becomes hamburger menu (if implemented) or hidden
3. **Expected**: Product cards stack vertically
4. **Expected**: Order table scrolls horizontally
5. **Expected**: Modals fit screen width
6. **Expected**: All buttons accessible

#### 📱 Test 22: Tablet Responsive (768px-1023px)
1. Resize browser to tablet width
2. **Expected**: 2 product cards per row
3. **Expected**: Sidebar visible
4. **Expected**: All content readable
5. **Expected**: No horizontal scroll

#### 🖥️ Test 23: Desktop Responsive (1024px+)
1. View on desktop resolution
2. **Expected**: 3-4 product cards per row
3. **Expected**: Full sidebar visible
4. **Expected**: Optimal spacing
5. **Expected**: All features accessible

#### 🔔 Test 24: Toast Notifications
1. Trigger various actions (login, create order, errors)
2. **Expected**: Toasts appear bottom-right
3. **Expected**: Auto-dismiss after 5 seconds
4. **Expected**: Can manually close with X button
5. **Expected**: Multiple toasts stack vertically

#### ⏳ Test 25: Loading States
1. Perform actions that load data
2. **Expected**: Spinners show during load
3. **Expected**: Buttons show "Cargando..." text
4. **Expected**: Buttons disabled during load
5. **Expected**: Content appears after load

---

### 🐛 Error Handling Tests

#### ❌ Test 26: Network Error
1. Disconnect internet
2. Try to load products or create order
3. **Expected**: Error toast: "Error de conexión"
4. **Expected**: Graceful failure (no crash)

#### ⚠️ Test 27: 404 Error
1. Navigate to non-existent order: `/dashboard/orders/999999`
2. **Expected**: Error toast
3. **Expected**: Redirect to orders list

#### 💥 Test 28: Component Error Boundary
1. If any component crashes
2. **Expected**: Error boundary shows:
   - Warning emoji
   - "Algo salió mal" message
   - "Recargar página" button
3. Click reload button
4. **Expected**: Page refreshes

#### 🔒 Test 29: Protected Routes
1. Logout completely
2. Try to access `/dashboard/products` directly
3. **Expected**: Auto-redirect to `/login`
4. **Expected**: No protected content shown

---

## Automated Testing (Future)

### Unit Tests
- [ ] Service layer functions
- [ ] Utility functions
- [ ] Custom hooks
- [ ] Context providers

### Integration Tests
- [ ] API client with mocked responses
- [ ] Form submissions
- [ ] Navigation flows

### E2E Tests (Playwright/Cypress)
- [ ] Complete purchase flow
- [ ] Authentication flow
- [ ] Order tracking flow

---

## Performance Checklist

- [ ] Initial page load < 3s
- [ ] Product list loads < 2s
- [ ] Order creation < 1s
- [ ] No layout shifts (CLS)
- [ ] Smooth animations (60fps)
- [ ] Images optimized
- [ ] Lazy loading implemented

---

## Accessibility Checklist

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader friendly
- [ ] Color contrast sufficient
- [ ] Text readable at 200% zoom

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Security Tests

- [ ] JWT stored securely in localStorage
- [ ] No sensitive data in console logs
- [ ] API keys not exposed in client
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection (if applicable)

---

## Test Results Template

```markdown
## Test Run: [Date]

**Environment:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

**Test Results:**

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Successful Login | ✅ | |
| 2 | Failed Login | ✅ | |
| 3 | Session Persistence | ✅ | |
| ... | ... | ... | |

**Issues Found:**
1. [Issue description]
2. [Issue description]

**Screenshots:**
- Login page: [attach]
- Products list: [attach]
- Order detail: [attach]
```

---

**Note**: This is a comprehensive manual testing guide. For production, implement automated tests for critical paths.
