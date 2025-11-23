export type MediaAttributes = { url?: string };
export type MediaRef = { data?: { attributes?: MediaAttributes } };
export type MissionCard = {
  image?: MediaRef;
  icon?: MediaRef;
  title?: string;
  description?: string;
};
export type ServiceItem = { name: string; description: string };
export type CounterItem = { count: number; label: string };
export type SeoMetaSocial = {
  socialNetwork?: string;
  title?: string;
  description?: string;
  image?: MediaRef;
};

export interface SeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: MediaRef;
  metaSocial?: SeoMetaSocial[];
  keywords?: string[];
  metaRobots?: string;
  structuredData?: unknown;
  metaViewport?: string;
  canonicalURL?: string;
}

export interface AboutData {
  serviceSec?: {
    title?: string;
    description?: string;
    serviceCrd?: ServiceItem[];
  };
  missionSec?: {
    title?: string;
    sub_description?: string;
    main_description?: string;
    missionCard?: MissionCard;
    VissionCard?: MissionCard;
  };
  HeroSec?: { title?: string; bgImage?: MediaRef };
  SecImage2?: MediaRef;
  CounterSec?: { listCount?: CounterItem[] };
  meta_data?: SeoMetadata;
}
