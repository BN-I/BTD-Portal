import { useCallback } from "react";
import { trackEvent, trackCustomEvent } from "@/components/meta-pixel";
import type { FacebookPixelEvent, StandardEventParameters, CustomEventParameters } from "@/types/facebook-pixel";

export const useFacebookPixel = () => {
  const trackStandardEvent = useCallback((eventName: FacebookPixelEvent, parameters?: StandardEventParameters) => {
    trackEvent(eventName, parameters);
  }, []);

  const trackCustom = useCallback((eventName: string, parameters?: CustomEventParameters) => {
    trackCustomEvent(eventName, parameters);
  }, []);

  // Vendor portal specific events
  const trackVendorRegistration = useCallback((vendorType?: string) => {
    trackEvent("CompleteRegistration", {
      content_name: "Vendor Registration",
      content_category: vendorType || "vendor",
    });
  }, []);

  const trackVendorLogin = useCallback(() => {
    trackCustom("VendorLogin", {
      event_type: "vendor_activity",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackProductUpload = useCallback((productCount: number, category?: string) => {
    trackCustom("ProductUpload", {
      event_type: "vendor_activity",
      portal_type: "vendor_portal",
      product_count: productCount,
      category: category,
    });
  }, []);

  const trackProductEdit = useCallback((productId: string, category?: string) => {
    trackCustom("ProductEdit", {
      event_type: "vendor_activity",
      portal_type: "vendor_portal",
      product_id: productId,
      category: category,
    });
  }, []);

  const trackProductDelete = useCallback((productId: string, category?: string) => {
    trackCustom("ProductDelete", {
      event_type: "vendor_activity",
      portal_type: "vendor_portal",
      product_id: productId,
      category: category,
    });
  }, []);

  const trackVendorProfileUpdate = useCallback((updateType: string) => {
    trackCustom("VendorProfileUpdate", {
      event_type: "vendor_activity",
      portal_type: "vendor_portal",
      update_type: updateType,
    });
  }, []);

  const trackVendorDashboardView = useCallback((section?: string) => {
    trackCustom("VendorDashboardView", {
      event_type: "vendor_activity",
      portal_type: "vendor_portal",
      dashboard_section: section,
    });
  }, []);

  const trackVendorLead = useCallback((leadSource?: string) => {
    trackEvent("Lead", {
      content_name: "Vendor Lead",
      content_category: "vendor_acquisition",
      lead_source: leadSource,
    });
  }, []);

  const trackVendorSearch = useCallback((searchTerm: string, filters?: string[]) => {
    trackEvent("Search", {
      content_category: "vendor_portal",
      search_string: searchTerm,
      filters_applied: filters,
    });
  }, []);

  // Authentication page events
  const trackPageView = useCallback((pageName: string, pageType?: string) => {
    trackCustom("PageView", {
      page_name: pageName,
      page_type: pageType || "auth",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackLoginAttempt = useCallback((loginMethod?: string) => {
    trackCustom("LoginAttempt", {
      event_type: "auth_activity",
      login_method: loginMethod || "email",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackLoginSuccess = useCallback((userRole?: string) => {
    trackCustom("LoginSuccess", {
      event_type: "auth_activity",
      user_role: userRole || "vendor",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackRegistrationAttempt = useCallback(() => {
    trackCustom("RegistrationAttempt", {
      event_type: "auth_activity",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackRegistrationSuccess = useCallback((userRole?: string) => {
    trackEvent("CompleteRegistration", {
      content_name: "Vendor Registration Completed",
      content_category: userRole || "vendor",
    });
  }, []);

  const trackRegistrationFormStart = useCallback(() => {
    trackCustom("RegistrationFormStart", {
      event_type: "auth_activity",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackAgreementViewed = useCallback(() => {
    trackCustom("AgreementViewed", {
      event_type: "auth_activity",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackAgreementAccepted = useCallback(() => {
    trackCustom("AgreementAccepted", {
      event_type: "auth_activity",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackMainPageView = useCallback((source?: string) => {
    trackCustom("MainPageView", {
      event_type: "landing_page",
      source: source || "direct",
      portal_type: "vendor_portal",
    });
  }, []);

  const trackCTA = useCallback((ctaType: string, ctaLocation?: string) => {
    trackCustom("CTAClick", {
      event_type: "cta_interaction",
      cta_type: ctaType,
      cta_location: ctaLocation,
      portal_type: "vendor_portal",
    });
  }, []);

  return {
    trackStandardEvent,
    trackCustom,
    trackVendorRegistration,
    trackVendorLogin,
    trackProductUpload,
    trackProductEdit,
    trackProductDelete,
    trackVendorProfileUpdate,
    trackVendorDashboardView,
    trackVendorLead,
    trackVendorSearch,
    // Authentication events
    trackPageView,
    trackLoginAttempt,
    trackLoginSuccess,
    trackRegistrationAttempt,
    trackRegistrationSuccess,
    trackRegistrationFormStart,
    trackAgreementViewed,
    trackAgreementAccepted,
    trackMainPageView,
    trackCTA,
  };
};
