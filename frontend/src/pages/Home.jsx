import ImpactSection from '@/components/Brand'
import Hero from '@/components/Hero'
import PromoCards from '@/components/Offer'
import ProductSection from '@/components/Product'

import React from 'react'

const Home = () => {
  return (
    <div>
    <Hero />
    <ProductSection />
    <PromoCards />
  <ImpactSection />
    </div>
  )
}

export default Home
