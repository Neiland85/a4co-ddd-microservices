"use client"

import { FeaturedBusinessesSection } from "./featured-businesses-section"
import { FestivalAnnouncement } from "./festival-announcement"

export function FeaturedBusinessesAndFestival() {
  return (
    <div className="space-y-0">
      <FeaturedBusinessesSection />
      <FestivalAnnouncement />
    </div>
  )
}
