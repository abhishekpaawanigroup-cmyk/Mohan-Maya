import HeroSection from './Hero'
import OurStory from './OurStory'
import WhatMakesDifferent from './WhatMakesDifferent'
import MissionVision from './MissionVission'
import CraftingProcess from './Crafting'
import WhyChooseUs from './WhyChoose'
import Statistics from './Statistics'
import { usePageMeta } from '../../../hooks/useHooks'

const About = () => {
  usePageMeta(
    "About Us - Mohan Maya",
    "Learn how Mohan Maya transforms imagination into handcrafted miniatures, capturing emotions, memories and timeless moments."
  );
  return (
    <>
    <HeroSection />
    <OurStory />
    <WhatMakesDifferent />
    <MissionVision />
    <CraftingProcess />
    <WhyChooseUs />
    <Statistics />
    </>
  )
}

export default About