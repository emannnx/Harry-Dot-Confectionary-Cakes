import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cake, Heart, Truck, Palette, PartyPopper, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const services = [
  {
    icon: Cake,
    title: 'Wedding Cakes',
    description: 'Elegant, multi-tiered wedding cakes that make your special day even more memorable. Custom designs to match your theme.',
    features: ['Multi-tier options', 'Custom flavors', 'Elegant decorations', 'Consultation included'],
  },
  {
    icon: PartyPopper,
    title: 'Birthday Cakes',
    description: 'Fun, creative birthday cakes for all ages. From superhero themes to elegant adult celebrations.',
    features: ['Character designs', 'Photo printing', 'Custom themes', 'All ages'],
  },
  {
    icon: Heart,
    title: 'Anniversary Cakes',
    description: 'Celebrate your love with beautifully crafted anniversary cakes that symbolize your journey together.',
    features: ['Romantic designs', 'Personalized messages', 'Premium flavors', 'Elegant presentation'],
  },
  {
    icon: Palette,
    title: 'Custom Designs',
    description: 'Have a unique vision? We bring your imagination to life with fully customized cake designs.',
    features: ['Unlimited creativity', 'Personal consultation', '3D designs', 'Any occasion'],
  },
  {
    icon: Gift,
    title: 'Corporate Events',
    description: 'Professional cakes for corporate events, product launches, and business celebrations.',
    features: ['Logo cakes', 'Bulk orders', 'Professional presentation', 'Timely delivery'],
  },
  {
    icon: Truck,
    title: 'Delivery Service',
    description: 'Safe and timely delivery to your doorstep. We handle your cake with utmost care.',
    features: ['Same-day delivery', 'Careful handling', 'Temperature controlled', 'Lagos coverage'],
  },
];

const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(326_84%_44%/0.1),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">What We Offer</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mt-2 mb-6">Our Services</h1>
            <p className="text-xl text-foreground/70">
              From intimate gatherings to grand celebrations, we have the perfect cake solution for every occasion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8 group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-foreground/60 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">How It Works</span>
            <h2 className="font-serif text-4xl font-bold mt-2">Our Process</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', description: 'Tell us about your event and cake vision' },
              { step: '02', title: 'Design', description: 'We create a custom design for your approval' },
              { step: '03', title: 'Creation', description: 'Our bakers craft your cake with love' },
              { step: '04', title: 'Delivery', description: 'We deliver fresh to your doorstep' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-foreground/60 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-serif text-4xl font-bold mb-6">Ready to Order?</h2>
            <p className="text-xl text-foreground/70 mb-8">
              Browse our collection of delicious cakes and place your order via WhatsApp for a seamless experience.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="xl">
                Browse Our Cakes
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;