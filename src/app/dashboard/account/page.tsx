"use client";

import type React from "react";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/hooks/use-toast";
// import { Toast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Loader2,
  Camera,
  CreditCard,
  Truck,
  Users,
  createLucideIcon,
} from "lucide-react";
import type { User, User as UserType } from "@/lib/auth-types";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { sub } from "date-fns";
import { industries } from "@/utils/industries";

// Business categories for vendors
const businessCategories = [
  "Apparel & Fashion",
  "Beauty & Personal Care",
  "Electronics & Gadgets",
  "Home & Garden",
  "Jewelry & Accessories",
  "Food & Beverages",
  "Health & Wellness",
  "Toys & Games",
  "Art & Collectibles",
  "Other",
];

// Company size options
const companySizes = [
  "Solo Entrepreneur",
  "2-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501+ employees",
];

// Business types
const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Non-profit Organization",
  "Other",
];

const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);

const countries = [
  { code: "US", name: "United States" },
  // { code: "CA", name: "Canada" },

  // ✅ Add more countries as needed
];

export default function VendorAccountPage() {
  const { toast } = useToast();
  const [vendor, setVendor] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Store Information
    storeName: "",
    storeDescription: "",
    category: "",
    companySize: "",
    yearFounded: "",
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",

    // Business Details
    businessType: "",
    taxId: "",
    businessEmail: "",
    businessPhone: "",

    // Address
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",

    // Policies
    shippingPolicy: "",
    returnPolicy: "",

    // Payment Information
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderFirstName: "",
    accountHolderLastName: "",
    businessUrl: "",
    phoneNumber: "",
    addressP: "",
    cityP: "",
    stateP: "",
    postalCodeP: "",
    countryP: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    id_number: "",
    industry: "",

    // Subscription

    subscription: {
      _id: "",
      vendorID: "",
      plan: "",
      priceID: "",
      amount: 0,
      startDate: "",
      endDate: "",
      status: "",
      createdAt: "",
      updatedAt: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      interval: string;
      price_id: string;
    }>
  >([]);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create-portal-session`
      );
      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      console.error("Failed to create portal session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subscription-plans`
        );
        console.log("fetchPlans", response.data.plans);
        setPlans(response.data.plans);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (priceId: string, planName: string) => {
    const stripe = await stripePromise;
    const user = localStorage.getItem("user");
    if (!user) return;

    const userObj = JSON.parse(user) as User;
    const { sessionId } = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, vendorID: userObj._id, planName }),
      }
    ).then((res) => res.json());

    if (!stripe) return;
    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      console.error(result.error);
    }
  };

  const [storeSettings, setStoreSettings] = useState({
    acceptCreditCards: true,
    acceptPayPal: true,
    internationalShipping: false,
    automaticPayouts: true,
    displayContactInfo: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch this from your API
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const userData = JSON.parse(userJson) as UserType;
        setVendor(userData);

        let storeInformation: any = {};
        let businessInformation: any = {};
        let paymentInformation: any = {};
        let subscriptionInformation: any = {};

        await axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/store/storeInformation/${userData._id}`
          )
          .then((res) => {
            storeInformation = res;
          })
          .catch((err) => {
            console.log(err);
          });

        await axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/store/businessInformation/${userData._id}`
          )
          .then((res) => {
            businessInformation = res;
          })
          .catch((err) => {
            console.log(err);
          });

        await axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/store/paymentInformation/${userData._id}`
          )
          .then((res) => {
            paymentInformation = res;
          })
          .catch((err) => {
            console.log(err);
          });

        await axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${userData._id}`
          )
          .then((res) => {
            subscriptionInformation = res;
          })
          .catch((err) => {
            console.log(err);
          });

        console.log("storeInformation", storeInformation.data);

        // Mock vendor data for demonstration
        const mockVendorData = {
          storeName: storeInformation.data.storeInformation?.storeName || "",
          storeDescription:
            storeInformation.data.storeInformation?.storeDescription || "",
          category:
            storeInformation.data.storeInformation?.businessCategory || "",
          companySize:
            storeInformation.data.storeInformation?.companySize || "",
          yearFounded:
            storeInformation.data.storeInformation?.yearFounded || "",
          website: storeInformation.data.storeInformation?.website || "",
          instagram: storeInformation.data.storeInformation?.instagram || "",
          facebook: storeInformation.data.storeInformation?.facebook || "",
          twitter: storeInformation.data.storeInformation?.twitter || "",
          businessType:
            businessInformation.data.businessInformation?.businessType || "",
          taxId: businessInformation.data.businessInformation?.taxID || "",
          businessEmail:
            businessInformation.data.businessInformation?.businessEmail || "",
          businessPhone:
            businessInformation.data.businessInformation?.businessPhone || "",
          streetAddress:
            businessInformation.data.businessInformation?.businessAddress || "",
          city: businessInformation.data.businessInformation?.city || "",
          state: businessInformation.data.businessInformation?.state || "",
          postalCode:
            businessInformation.data.businessInformation?.postalCode || "",
          country: businessInformation.data.businessInformation?.country || "",
          shippingPolicy:
            businessInformation.data.businessInformation?.storePolicy || "",
          returnPolicy:
            businessInformation.data.businessInformation?.returnPolicy || "",
          bankName: paymentInformation.data.paymentInformation?.bankName || "",
          accountNumber:
            paymentInformation.data.paymentInformation?.accountNumber || "",
          routingNumber:
            paymentInformation.data.paymentInformation?.routingNumber || "",
          accountHolderFirstName:
            paymentInformation.data.paymentInformation
              ?.accountHolderFirstName || "",
          accountHolderLastName:
            paymentInformation.data.paymentInformation?.accountHolderLastName ||
            "",
          businessUrl:
            paymentInformation.data.paymentInformation?.businessUrl || "",
          phoneNumber:
            paymentInformation.data.paymentInformation?.phoneNumber || "",
          addressP: paymentInformation.data.paymentInformation?.addressP || "",
          cityP: paymentInformation.data.paymentInformation?.cityP || "",
          stateP: paymentInformation.data.paymentInformation?.stateP || "",
          postalCodeP:
            paymentInformation.data.paymentInformation?.postalCodeP || "",
          countryP: paymentInformation.data.paymentInformation?.countryP || "",
          dobDay: paymentInformation.data.paymentInformation?.dobDay || "",
          dobMonth: paymentInformation.data.paymentInformation?.dobMonth || "",
          dobYear: paymentInformation.data.paymentInformation?.dobYear || "",
          id_number:
            paymentInformation.data.paymentInformation?.id_number || "",
          industry: paymentInformation.data.paymentInformation?.industry || "",
          subscription: subscriptionInformation.data?.subscription,
        };

        console.log("store indormation", storeInformation);
        setFormData(mockVendorData);
        // Set store logo if available
        setStoreLogo(storeInformation.data.storeInformation?.storeImage);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description:
      //     "Failed to load your vendor information. Please try again.",
      // });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (key: keyof typeof storeSettings) => {
    setStoreSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(file);
    const userJson = localStorage.getItem("user");
    if (!userJson) return;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("vendorID", JSON.parse(userJson)._id);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/store/logo`,
      formData
    );

    console.log("response", response);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Store logo must be less than 5MB",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setStoreLogo(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // In a real app, you'd upload the file to your server here
  };

  const handleSaveStoreInfo = async () => {
    setSaving(true);
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        return;
      }
      // Validate form data
      if (!formData.storeName.trim()) {
        throw new Error("Store name is required");
      }

      if (!formData.category) {
        throw new Error("Please select a business category");
      }

      if (!formData.companySize) {
        throw new Error("Please select a company size");
      }

      if (!formData.yearFounded) {
        throw new Error("Please select a year founded");
      }

      if (!formData.website.trim()) {
        throw new Error("Website URL is required");
      }

      if (!formData.instagram.trim()) {
        throw new Error("Instagram URL is required");
      }

      if (!formData.facebook.trim()) {
        throw new Error("Facebook URL is required");
      }

      if (!formData.twitter.trim()) {
        throw new Error("Twitter URL is required");
      }

      if (!formData.storeDescription.trim()) {
        throw new Error("Store description is required");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/store/storeInformation`,
        {
          vendorID: JSON.parse(userJson)._id,
          storeName: formData.storeName,
          storeDescription: formData.storeDescription,
          businessCategory: formData.category,
          companySize: formData.companySize,
          yearFounded: formData.yearFounded,
          website: formData.website,
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter,
        }
      );

      console.log(response);

      // For demo purposes, we'll just show a success message
      toast({
        title: "Store information updated",
        description: "Your store information has been updated successfully.",
      });

      document.cookie = `storeData=${encodeURIComponent(
        JSON.stringify(response.data)
      )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
    } catch (error) {
      console.error("Error saving store information:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update your store information. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBusinessDetails = async () => {
    setSaving(true);
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        return;
      }

      if (!formData.businessType.trim()) {
        throw new Error("Business type is required");
      }

      if (!formData.taxId.trim()) {
        throw new Error("Tax id is required");
      }

      if (
        !formData.businessEmail ||
        !/\S+@\S+\.\S+/.test(formData.businessEmail)
      ) {
        throw new Error("Valid business email is required");
      }

      if (!formData.businessPhone.trim()) {
        throw new Error("Valid business phone is required");
      }

      if (!formData.streetAddress.trim()) {
        throw new Error("Street address is required");
      }

      if (!formData.city.trim()) {
        throw new Error("City is required");
      }

      if (!formData.state.trim()) {
        throw new Error("State is required");
      }

      if (!formData.postalCode.trim()) {
        throw new Error("Postal code is required");
      }

      if (!formData.country.trim()) {
        throw new Error("Country is required");
      }

      if (!formData.shippingPolicy.trim()) {
        throw new Error("Shipping policy is required");
      }

      if (!formData.returnPolicy.trim()) {
        throw new Error("Return policy is required");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/store/businessInformation`,
        {
          vendorID: JSON.parse(userJson)._id,
          businessType: formData.businessType,
          taxID: formData.taxId,
          businessEmail: formData.businessEmail,
          businessPhone: formData.businessPhone,
          businessAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          storePolicy: formData.shippingPolicy,
          returnPolicy: formData.returnPolicy,
        }
      );

      console.log(response);

      // For demo purposes, we'll just show a success message
      toast({
        title: "Business details updated",
        description: "Your business details have been updated successfully.",
      });

      document.cookie = `businessInformation=${encodeURIComponent(
        JSON.stringify(response.data)
      )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
    } catch (error) {
      console.error("Error saving business details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update your business details. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePaymentInfo = async () => {
    setSaving(true);
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        return;
      }

      // Validate form data
      if (!formData.bankName.trim()) {
        throw new Error("Bank name is required");
      }

      if (!formData.accountHolderFirstName.trim()) {
        throw new Error("Account holder first name is required");
      }

      if (!formData.accountHolderLastName.trim()) {
        throw new Error("Account holder last name is required");
      }

      if (!formData.businessUrl.trim()) {
        throw new Error("Business url is required");
      }

      if (!formData.accountNumber.trim()) {
        throw new Error("Account number is required");
      }

      if (!formData.routingNumber.trim()) {
        throw new Error("Routing number is required");
      }

      const stripe = await stripePromise;
      if (!stripe) return;
      const result = await stripe.createToken("bank_account", {
        country: "US",
        currency: "usd",
        routing_number: formData.routingNumber,
        account_number: formData.accountNumber,
        account_holder_name: `${formData.accountHolderFirstName} ${formData.accountHolderLastName}`,
        account_holder_type: "individual",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const bankToken = result.token.id;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/store/paymentInformation`,
        {
          vendorID: JSON.parse(userJson)._id,
          bankToken,
          bankName: formData.bankName,
          accountHolderFirstName: formData.accountHolderFirstName,
          accountHolderLastName: formData.accountHolderLastName,
          businessUrl: formData.businessUrl,
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber,
          phoneNumber: formData.phoneNumber,
          addressP: formData.addressP,
          cityP: formData.cityP,
          stateP: formData.stateP,
          postalCodeP: formData.postalCodeP,
          countryP: formData.countryP,
          id_number: formData.id_number,
          dobDay: formData.dobDay,
          dobMonth: formData.dobMonth,
          dobYear: formData.dobYear,
          industry: formData.industry,
        }
      );

      console.log(response);

      // For demo purposes, we'll just show a success message
      toast({
        title: "Payment information updated",
        description: "Your payment information has been updated successfully.",
      });

      document.cookie = `paymentInformation=${encodeURIComponent(
        JSON.stringify(response.data)
      )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
    } catch (error) {
      console.error("Error saving payment information:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update your payment information. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStoreSettings = async () => {};

  const isSubscribed = useMemo(() => {
    return (
      formData.subscription?.status === "active" &&
      new Date(formData.subscription?.endDate) > new Date()
    );
  }, [formData.subscription]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isSubscribed ? "Vendor Account" : "Onboarding"}
        </h2>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="store">Store Information</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="payment">Payment Information</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          {/* <TabsTrigger value="settings">Store Settings</TabsTrigger> */}
        </TabsList>

        {/* Store Information Tab */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Store Logo */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative">
                  <div
                    className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-[#00BFA6]"
                    onClick={handleLogoClick}
                  >
                    {storeLogo ? (
                      <img
                        src={storeLogo}
                        alt="Store Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div
                    className="absolute bottom-0 right-0 bg-[#00BFA6] rounded-full p-1.5 cursor-pointer"
                    onClick={handleLogoClick}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="font-medium">
                    {formData.storeName || "Your Store Name"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formData.category || "Business Category"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Click on the logo to change it.
                    <br />
                    JPG, GIF or PNG. Max size 5MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Store Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="storeName"
                      name="storeName"
                      placeholder="Your store name"
                      className="pl-9"
                      value={formData.storeName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    name="storeDescription"
                    placeholder="Describe your store and what you sell"
                    rows={4}
                    value={formData.storeDescription}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Business Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) =>
                      handleSelectChange("companySize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearFounded">Year Founded</Label>
                  <Input
                    id="yearFounded"
                    name="yearFounded"
                    placeholder="e.g., 2018"
                    value={formData.yearFounded}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      name="website"
                      placeholder="https://yourwebsite.com"
                      className="pl-9"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Social Media */}
              <div>
                <h3 className="text-sm font-medium mb-3">Social Media</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="instagram"
                        name="instagram"
                        placeholder="@yourusername"
                        className="pl-9"
                        value={formData.instagram}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="facebook"
                        name="facebook"
                        placeholder="yourusername"
                        className="pl-9"
                        value={formData.facebook}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">X.com</Label>
                    <div className="relative">
                      <XIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="twitter"
                        name="twitter"
                        placeholder="@yourusername"
                        className="pl-9"
                        value={formData.twitter}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSaveStoreInfo}
                className="bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Store Information"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Business Details Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>
                Update your business information and address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) =>
                      handleSelectChange("businessType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">
                    Tax ID / Business Registration Number
                  </Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    placeholder="e.g., 12-3456789"
                    value={formData.taxId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      placeholder="business@example.com"
                      className="pl-9"
                      value={formData.businessEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessPhone"
                      name="businessPhone"
                      placeholder="(555) 123-4567"
                      className="pl-9"
                      value={formData.businessPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Business Address */}
              <div>
                <h3 className="text-sm font-medium mb-3">Business Address</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        placeholder="123 Business St"
                        className="pl-9"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="State or Province"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="Postal or ZIP code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Store Policies */}
              <div>
                <h3 className="text-sm font-medium mb-3">Store Policies</h3>
                <div className="grid gap-4 sm:grid-cols-1">
                  <div className="space-y-2">
                    <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                    <Textarea
                      id="shippingPolicy"
                      name="shippingPolicy"
                      placeholder="Describe your shipping policy"
                      rows={3}
                      value={formData.shippingPolicy}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returnPolicy">Return Policy</Label>
                    <Textarea
                      id="returnPolicy"
                      name="returnPolicy"
                      placeholder="Describe your return policy"
                      rows={3}
                      value={formData.returnPolicy}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSaveBusinessDetails}
                className="bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Business Details"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Information Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Update your payment and payout details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  Your payment information is securely stored and processed. We
                  never store complete bank account numbers.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="bankName"
                      name="bankName"
                      placeholder="Your bank name"
                      className="pl-9"
                      value={formData.bankName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="•••• •••• •••• 6789"
                    type="password"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolderFirstName">
                    Account Holder First Name
                  </Label>
                  <Input
                    id="accountHolderFirstName"
                    name="accountHolderFirstName"
                    placeholder="First Name on account"
                    value={formData.accountHolderFirstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolderFirstName">
                    Account Holder Last Name
                  </Label>
                  <Input
                    id="accountHolderLastName"
                    name="accountHolderLastName"
                    placeholder="Last Name on account"
                    value={formData.accountHolderLastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    name="routingNumber"
                    placeholder="•••• ••••"
                    type="password"
                    value={formData.routingNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessUrl">Business Url</Label>
                  <Input
                    id="businessUrl"
                    name="businessUrl"
                    value={formData.businessUrl}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressP">Address</Label>
                  <Input
                    id="addressP"
                    name="addressP"
                    value={formData.addressP}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cityP">City</Label>
                  <Input
                    id="cityP"
                    name="cityP"
                    value={formData.cityP}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stateP">State</Label>
                  <Input
                    id="stateP"
                    name="stateP"
                    value={formData.stateP}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCodeP">Postal Code</Label>
                  <Input
                    id="postalCodeP"
                    name="postalCodeP"
                    value={formData.postalCodeP}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countryP">Country</Label>
                  <select
                    id="countryP"
                    name="countryP"
                    value={formData.countryP}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        countryP: e.target.value,
                      }));
                    }}
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dobDay">Date of Birth</Label>
                  <Input
                    id="dobDay"
                    name="dobDay"
                    value={formData.dobDay}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dobMonth">Month of Birth</Label>
                  <Input
                    id="dobMonth"
                    name="dobMonth"
                    value={formData.dobMonth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dobYear">Year of Birth</Label>
                  <Input
                    id="dobYear"
                    name="dobYear"
                    value={formData.dobYear}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_number">SSN / ITIN</Label>
                  <Input
                    id="id_number"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        industry: e.target.value,
                      }));
                    }}
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select your industry</option>
                    {industries.map((industry) => (
                      <option key={industry.mcc} value={industry.mcc}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSavePaymentInfo}
                className="bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Payment Information"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Store Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>
                Configure your store preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                      <Label
                        htmlFor="accept-credit-cards"
                        className="font-medium"
                      >
                        Accept Credit Cards
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Allow customers to pay with credit cards
                    </p>
                  </div>
                  <Switch
                    id="accept-credit-cards"
                    checked={storeSettings.acceptCreditCards}
                    onCheckedChange={() =>
                      handleSettingChange("acceptCreditCards")
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                      <Label htmlFor="accept-paypal" className="font-medium">
                        Accept PayPal
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Allow customers to pay with PayPal
                    </p>
                  </div>
                  <Switch
                    id="accept-paypal"
                    checked={storeSettings.acceptPayPal}
                    onCheckedChange={() => handleSettingChange("acceptPayPal")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Truck className="mr-2 h-4 w-4 text-gray-500" />
                      <Label
                        htmlFor="international-shipping"
                        className="font-medium"
                      >
                        International Shipping
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Enable shipping to international addresses
                    </p>
                  </div>
                  <Switch
                    id="international-shipping"
                    checked={storeSettings.internationalShipping}
                    onCheckedChange={() =>
                      handleSettingChange("internationalShipping")
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                      <Label
                        htmlFor="automatic-payouts"
                        className="font-medium"
                      >
                        Automatic Payouts
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Automatically transfer funds to your bank account
                    </p>
                  </div>
                  <Switch
                    id="automatic-payouts"
                    checked={storeSettings.automaticPayouts}
                    onCheckedChange={() =>
                      handleSettingChange("automaticPayouts")
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gray-500" />
                      <Label
                        htmlFor="display-contact-info"
                        className="font-medium"
                      >
                        Display Contact Information
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Show your business contact information to customers
                    </p>
                  </div>
                  <Switch
                    id="display-contact-info"
                    checked={storeSettings.displayContactInfo}
                    onCheckedChange={() =>
                      handleSettingChange("displayContactInfo")
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSaveStoreSettings}
                className="bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Subscribe to a plan to get started with BTD
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  Your payment information is securely stored and processed. We
                  never store complete bank account numbers.
                </p>
              </div>
              {isSubscribed && (
                <Button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Manage Subscription"
                  )}
                </Button>
              )}
              {isSubscribed && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                  <p className="text-sm text-green-800">
                    You are currently subscribed to a plan.
                    <div>Current plan : {formData.subscription.plan}</div>
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {plans
                    .sort((a, b) => a.price - b.price)
                    .map((plan) => (
                      <Card
                        key={plan.id}
                        className="flex flex-col justify-between"
                      >
                        <CardHeader className="flex flex-col items-center gap-2">
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription className="w-9/12">
                            {plan.description}
                          </CardDescription>
                        </CardHeader>
                        <div>
                          <CardContent className="flex flex-col items-center">
                            <div className="space-y-2">
                              <div className="flex items-center justify-betwee">
                                <span className="text-2xl font-bold">
                                  ${plan.price / 100}
                                </span>
                                <span className="text-sm text-gray-500">
                                  /{plan.interval}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className={`w-full ${
                                isSubscribed
                                  ? "bg-gray-700 cursor-not-allowed opacity-40"
                                  : "bg-[#00BFA6] hover:bg-[#00BFA6]/90 "
                              }`}
                              disabled={isSubscribed}
                              onClick={() =>
                                handleSubscribe(plan.price_id, plan.name)
                              }
                            >
                              {isSubscribed &&
                              plan.price_id == formData.subscription.priceID
                                ? "Current Plan"
                                : "Subscribe"}
                            </Button>
                          </CardFooter>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
