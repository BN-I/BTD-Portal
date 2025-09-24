# Facebook Meta Pixel Integration - Vendor Portal

## Overview

This integration adds Facebook Meta Pixel tracking to your vendor portal to help with Meta Ads campaigns for vendor acquisition and engagement.

## Files Added/Modified

### Core Files

- `src/components/meta-pixel.tsx` - Main pixel component
- `src/hooks/use-facebook-pixel.ts` - Custom hook for vendor-specific tracking
- `src/types/facebook-pixel.d.ts` - TypeScript definitions
- `src/app/layout.tsx` - Root layout with pixel integration

### Example Files

- `src/components/example-pixel-usage.tsx` - Example usage for vendor portal
- `src/components/products-pixel-integration.tsx` - Integration guide for products page

## Vendor Portal Events Tracked

### Standard Events

- **CompleteRegistration** - When vendors register
- **Lead** - When vendors show interest (first product upload, etc.)
- **Search** - When vendors search within the portal

### Custom Events

- **VendorLogin** - Vendor login activity
- **ProductUpload** - When vendors upload products
- **ProductEdit** - When vendors edit products
- **ProductDelete** - When vendors delete products
- **VendorProfileUpdate** - When vendors update their profile
- **VendorDashboardView** - When vendors view different dashboard sections

### Authentication Events

- **PageView** - Track page views (login, register, main page)
- **LoginAttempt** - Track login attempts
- **LoginSuccess** - Track successful logins
- **RegistrationAttempt** - Track registration attempts
- **RegistrationSuccess** - Track completed registrations
- **RegistrationFormStart** - Track when registration form is loaded
- **AgreementViewed** - Track when terms agreement is viewed
- **AgreementAccepted** - Track when terms agreement is accepted
- **MainPageView** - Track main landing page views
- **CTAClick** - Track call-to-action button clicks

## Integration Examples

### Basic Usage

```typescript
import { useFacebookPixel } from "@/hooks/use-facebook-pixel";

function MyComponent() {
  const { trackVendorDashboardView, trackProductUpload } = useFacebookPixel();

  useEffect(() => {
    trackVendorDashboardView("products_page");
  }, []);

  const handleProductUpload = (product) => {
    // Your logic...
    trackProductUpload(1, product.category);
  };
}
```

### Authentication Page Integration

#### Main Landing Page

```typescript
const { trackMainPageView, trackCTA } = useFacebookPixel();

useEffect(() => {
  trackMainPageView("direct");
}, []);

const handleCTAClick = (ctaType: string) => {
  trackCTA(ctaType, "main_page");
};
```

#### Login Page

```typescript
const { trackPageView, trackLoginAttempt, trackLoginSuccess, trackCTA } =
  useFacebookPixel();

useEffect(() => {
  trackPageView("login", "auth");
}, []);

const handleSubmit = async (e) => {
  trackLoginAttempt("email");
  // ... login logic ...
  trackLoginSuccess(userRole);
};
```

#### Registration Page

```typescript
const {
  trackPageView,
  trackRegistrationFormStart,
  trackRegistrationAttempt,
  trackRegistrationSuccess,
  trackAgreementViewed,
  trackAgreementAccepted,
} = useFacebookPixel();

useEffect(() => {
  trackPageView("register", "auth");
  trackRegistrationFormStart();
}, []);

const handleAcceptAgreement = async () => {
  trackAgreementAccepted();
  // ... registration logic ...
  trackRegistrationSuccess("vendor");
};
```

### Products Page Integration

Add these tracking calls to your existing functions:

1. **Dashboard View Tracking**

```typescript
useEffect(() => {
  trackVendorDashboardView("products_management");
}, []);
```

2. **Product Upload Tracking**

```typescript
const handleAddProduct = (newProduct) => {
  // Existing logic...
  trackProductUpload(1, newProduct.category);
};
```

3. **Product Edit Tracking**

```typescript
const handleEditProduct = (updatedProduct) => {
  // Existing logic...
  trackProductEdit(updatedProduct._id, updatedProduct.category);
};
```

4. **Product Delete Tracking**

```typescript
const handleDeleteProduct = (id) => {
  // Existing logic...
  const product = products.find((p) => p._id === id);
  trackProductDelete(id, product?.category || "");
};
```

## Meta Ads Campaign Setup

### Custom Audiences

Create custom audiences based on:

- Vendors who registered
- Vendors who uploaded products
- Vendors who are actively managing products
- Vendors who haven't logged in recently

### Conversion Events

Set up conversion tracking for:

- Vendor registration
- First product upload
- Profile completion
- Dashboard engagement

### Lookalike Audiences

Create lookalike audiences based on:

- Successful vendors (high product upload activity)
- Engaged vendors (frequent dashboard usage)
- Converting vendors (completed registration flow)

## Testing

1. Install Facebook Pixel Helper browser extension
2. Visit your vendor portal
3. Perform vendor activities (login, upload products, etc.)
4. Check that events are firing in the Pixel Helper
5. Verify events appear in Facebook Events Manager

## Privacy Considerations

- The pixel respects user privacy settings
- No personal data is sent to Facebook beyond standard tracking
- Consider adding cookie consent if required by your jurisdiction
- The pixel only tracks vendor portal activities, not end-user behavior

## Troubleshooting

1. **Events not firing**: Check browser console for JavaScript errors
2. **Pixel not loading**: Verify the pixel ID is correct
3. **Events delayed**: This is normal, events may take up to 24 hours to appear in Facebook

## Next Steps

1. Integrate tracking into your existing vendor portal pages
2. Set up Meta Ads campaigns targeting vendor acquisition
3. Create custom audiences based on vendor behavior
4. Monitor conversion rates and optimize campaigns
