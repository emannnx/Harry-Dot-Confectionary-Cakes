import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Users, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const stats = [
  { icon: Heart, value: '500+', label: 'Happy Customers' },
  { icon: Award, value: '5', label: 'Years Experience' },
  { icon: Users, value: '1000+', label: 'Cakes Delivered' },
  { icon: Clock, value: '24/7', label: 'Support Available' },
];

const About: React.FC = () => {
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
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Our Story</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mt-2 mb-6">About Harry-dot</h1>
            <p className="text-xl text-foreground/70">
              A passion for baking that started in a small kitchen has grown into a beloved confectionery brand.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-serif text-4xl font-bold">Our Sweet Beginning</h2>
              <p className="text-foreground/70 leading-relaxed">
                Harry-dot Confectionery & Cakes was born out of a deep passion for creating beautiful, 
                delicious cakes that bring joy to every celebration. What started as a hobby baking 
                for friends and family has blossomed into a full-fledged confectionery business.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                We believe that every cake tells a story. Whether it's a wedding, birthday, anniversary, 
                or any special occasion, we pour our heart and soul into every creation. Our commitment 
                to quality ingredients and artistic design ensures that each cake is not just a dessert, 
                but a memorable experience.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Based in Lagos, Nigeria, we've had the privilege of being part of countless celebrations 
                across the city. Our team of skilled bakers and decorators work tirelessly to turn your 
                cake dreams into reality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <span className="text-8xl mb-4 block">🎂</span>
                  <p className="font-serif text-2xl text-foreground/60">Crafted with Love</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="font-serif text-4xl font-bold text-gradient">{stat.value}</div>
                <p className="text-foreground/60 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">What We Stand For</span>
            <h2 className="font-serif text-4xl font-bold mt-2">Our Values</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                description: 'We never compromise on the quality of our ingredients. Every cake is made with premium, fresh ingredients.',
              },
              {
                title: 'Customer Happiness',
                description: 'Your satisfaction is our priority. We work closely with you to ensure your vision comes to life.',
              },
              {
                title: 'Creativity & Innovation',
                description: 'We constantly push boundaries in cake design and flavors to bring you unique creations.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8 text-center"
              >
                <h3 className="font-serif text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-foreground/60">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;