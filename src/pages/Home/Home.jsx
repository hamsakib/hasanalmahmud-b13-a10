import { Helmet } from 'react-helmet-async';
import Hero from './sections/Hero';
import FeaturedProducts from './sections/FeaturedProducts';
import PopularCategories from './sections/PopularCategories';
import SuccessStories from './sections/SuccessStories';
import MarketplaceStats from './sections/MarketplaceStats';
import Sustainability from './sections/Sustainability';
import TrustedSellers from './sections/TrustedSellers';

const Home = () => (
  <>
    <Helmet>
      <title>ReSell Hub | Buy & Sell Pre-Owned Products</title>
    </Helmet>
    <Hero />
    <MarketplaceStats />
    <PopularCategories />
    <FeaturedProducts />
    <Sustainability />
    <SuccessStories />
    <TrustedSellers />
  </>
);

export default Home;
