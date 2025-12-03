import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Truck, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CakeCard } from '@/components/CakeCard';
import { CakeCardSkeleton } from '@/components/CakeCardSkeleton';
import { CakeDetailsModal } from '@/components/CakeDetailsModal';
import { fetchPublishedCakes, Cake } from '@/lib/supabase';

const features = [
  {
    icon: Sparkles,
    title: 'Handcrafted',
    description: 'Made with love and attention to every detail',
  },
  {
    icon: Heart,
    title: 'Premium Quality',
    description: 'Only the finest ingredients in our creations',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Fresh delivery right to your doorstep',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized for excellence in taste',
  },
];

const Index: React.FC = () => {
  const [featuredCakes, setFeaturedCakes] = useState<Cake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  useEffect(() => {
    const loadCakes = async () => {
      try {
        const cakes = await fetchPublishedCakes();
        setFeaturedCakes(cakes.slice(0, 4));
      } catch (error) {
        console.error('Error loading cakes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCakes();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      {/* Hero Section */}
<section
  className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/fabulous_chocolate_and_74789_16x9.jpg')",
  }}
>
  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/50 z-0" />

  {/* Decorative Elements */}
  <div className="absolute inset-0 section-pattern z-[1]" />
  <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft z-[1]" />
  <div
    className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft z-[1]"
    style={{ animationDelay: "1.5s" }}
  />
  <div
    className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft z-[1]"
    style={{ animationDelay: "0.75s" }}
  />

  {/* HERO CONTENT */}
  <div className="container mx-auto px-4 relative z-[2]">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <Star className="w-4 h-4 fill-current" />
          Welcome to Harry-dot Confectionery
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1]"
      >
        Creating Sweet
        <span className="block gradient-text">Memories</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        Handcrafted cakes and confections made with love, premium ingredients,
        and artistic passion. Let us make your celebrations unforgettable.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/shop">
          <Button variant="hero" size="xl" className="w-full sm:w-auto">
            Browse Our Cakes
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

        <Link to="/services">
          <Button variant="outline" size="xl" className="w-full sm:w-auto">
            Our Services
          </Button>
        </Link>
      </motion.div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.5 }}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2]"
  >
    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-primary"
      />
    </div>
  </motion.div>
</section>


      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="feature-icon mx-auto mb-5">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge-elegant mb-4 inline-block">Our Collection</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-4">Featured Cakes</h2>
            <div className="divider-elegant my-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover our most loved creations, each one a masterpiece of flavor and artistry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CakeCardSkeleton key={i} />
              ))
            ) : featuredCakes.length > 0 ? (
              featuredCakes.map((cake, index) => (
                <CakeCard
                  key={cake.id}
                  cake={cake}
                  onViewDetails={setSelectedCake}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">No cakes available yet. Check back soon!</p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link to="/shop">
              <Button variant="outline" size="lg">
                View All Cakes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 section-pattern bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="badge-elegant mb-4 inline-block">Let's Create Together</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 mt-4">
              Ready to Make Your Event Special?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Contact us today to discuss your custom cake order. We'll work with you to create the perfect centerpiece for your celebration.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="xl">
                Order Your Cake Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <CakeDetailsModal cake={selectedCake} onClose={() => setSelectedCake(null)} />
    </div>
  );
};

export default Index;
