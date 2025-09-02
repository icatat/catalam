'use client';

import WeddingPageLayout from '@/components/WeddingPageLayout';
import { Location } from '@/models/RSVP';

export default function VietnamWedding() {
  return <WeddingPageLayout location={Location.VIETNAM} />;
}