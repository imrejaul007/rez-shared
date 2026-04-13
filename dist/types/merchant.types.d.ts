/**
 * Canonical Merchant and Store types for the REZ platform.
 *
 * Source of truth:
 *   rezbackend/src/models/Merchant.ts  (Merchant)
 *   rezbackend/src/models/Store.ts     (Store)
 *
 * Do NOT redefine these types in frontend apps — import from @rez/shared instead.
 */
/**
 * Canonical verification status.
 * Note: use 'rejected' — never 'failed'.
 */
export type MerchantVerificationStatus = 'pending' | 'verified' | 'rejected';
export type OnboardingStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';
export interface MerchantBusinessAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
export interface Merchant {
    _id: string;
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
    description?: string;
    logo?: string;
    website?: string;
    businessAddress: MerchantBusinessAddress;
    verificationStatus: MerchantVerificationStatus;
    /** Computed status — may reflect onboarding stage before full verification */
    computedStatus?: string;
    isActive: boolean;
    isFeatured?: boolean;
    categories?: string[];
    tags?: string[];
    taxId?: string;
    businessLicense?: string;
    onboarding?: {
        status: OnboardingStatus;
        currentStep: number;
        completedSteps: number[];
    };
    verification?: {
        isVerified?: boolean;
    };
    createdAt: string;
    updatedAt: string;
}
export interface StoreLocation {
    address: string;
    city: string;
    state?: string;
    pincode?: string;
    coordinates?: [number, number];
    deliveryRadius?: number;
    landmark?: string;
}
export interface StoreRatings {
    average: number;
    count: number;
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}
export interface StoreServiceCapabilities {
    homeDelivery: {
        enabled: boolean;
        deliveryRadius?: number;
        minOrder?: number;
        deliveryFee?: number;
        freeDeliveryAbove?: number;
        estimatedTime?: string;
    };
    driveThru: {
        enabled: boolean;
        estimatedTime?: string;
        menuType?: 'full' | 'limited';
    };
    tableBooking: {
        enabled: boolean;
    };
    dineIn: {
        enabled: boolean;
    };
    storePickup: {
        enabled: boolean;
        estimatedTime?: string;
    };
}
export interface Store {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    image?: string;
    banner?: string[];
    category: string;
    location: StoreLocation;
    ratings: StoreRatings;
    tags: string[];
    isActive: boolean;
    isFeatured: boolean;
    isVerified: boolean;
    merchantId?: string;
    serviceCapabilities?: StoreServiceCapabilities;
    bookingType?: 'RESTAURANT' | 'SERVICE' | 'CONSULTATION' | 'RETAIL' | 'HYBRID';
    offers?: {
        cashback?: number;
        minOrderAmount?: number;
        maxCashback?: number;
        isPartner: boolean;
        partnerLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
    };
    hasMenu?: boolean;
    is60MinDelivery?: boolean;
    hasStorePickup?: boolean;
    priceForTwo?: number;
    createdAt: string;
    updatedAt: string;
}
export declare function isMerchantVerificationStatus(value: string): value is MerchantVerificationStatus;
//# sourceMappingURL=merchant.types.d.ts.map