export interface VehicleSpecs {
  chassisCompatibility: string;
  sheetMaterial: string;
  floorPlate: string;
  paintFinish: string;
  dimensions: string;
  warranty: string;
}

export interface VehicleItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  categoryColor?: string;
  badge?: string;
  badgeColor?: string;
  coverImage: string;
  gallery: string[];
  galleryImages?: string[];
  description: string;
  specs: VehicleSpecs;
  standardOptions: string[];
  availableOptions?: { id: string; name: string; price: number; defaultSelected?: boolean }[];
  isPopular?: boolean;
  basePrice: number;
  leadTime: string;
}

export interface LeadItem {
  id: string;
  type: 'quotation' | 'contact';
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerCity?: string;
  vehicleCategory?: string;
  vehicleName?: string;
  selectedOptions?: string[];
  estimatedPrice?: number;
  quotationRef?: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Converted' | 'Completed' | 'Closed' | 'Archived';
  smsStatus: 'Sent' | 'Failed' | 'Simulated' | 'Pending';
  subject?: string;
  message?: string;
  customerNotes?: string;
}

export interface SiteContent {
  theme: {
    primaryColor: string;
    primaryHover: string;
    accentColor: string;
    accentHover: string;
    defaultMode: 'light' | 'dark';
    headerStyle: string;
    topAnnouncementText?: string;
    topBarLeftBadge?: string;
    topBarLocationText?: string;
    topBarWhatsAppText?: string;
  };
  company: {
    name: string;
    brandName: string;
    tagline: string;
    phone: string;
    secondaryPhone: string;
    whatsapp: string;
    email: string;
    brcNumber: string;
    headOffice: string;
    factoryWorkshop: string;
    operatingHours: string;
    logoUrl?: string;
    facebookUrl?: string;
    youtubeUrl?: string;
    copyrightText?: string;
  };
  home: {
    heroBadge: string;
    heroBadgeColor?: string;
    heroTitle: string;
    heroTitleColor?: string;
    heroSubtitle: string;
    heroPrimaryBtnText: string;
    heroPrimaryBtnColor?: string;
    heroSecondaryBtnText: string;
    heroSecondaryBtnColor?: string;
    heroBannerImage: string;
    heroBannerImages?: string[];
    stats: { label: string; value: string; description: string }[];
    highlights: { title: string; description: string; icon: string }[];
    ctaTitle: string;
    ctaSubtitle: string;
    ctaBtnText: string;
    ctaBtnColor?: string;
  };
  about: {
    title: string;
    subtitle: string;
    story: string;
    mission: string;
    vision: string;
    image: string;
    values: string[];
  };
  services: {
    title: string;
    subtitle: string;
    list: {
      id: string;
      name: string;
      description: string;
      image: string;
    }[];
  };
  contact: {
    title: string;
    subtitle: string;
    branches: {
      name: string;
      address: string;
      phone: string;
      badge: string;
      googleMapUrl: string;
    }[];
  };
}
