import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CakeCard } from '@/components/CakeCard';
import { CakeCardSkeleton } from '@/components/CakeCardSkeleton';
import { CakeDetailsModal } from '@/components/CakeDetailsModal';
import { ShopFilters } from '@/components/ShopFilters';
import { fetchPublishedCakes, Cake } from '@/lib/supabase';
import { Cake as CakeIcon } from 'lucide-react';

const Shop: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loadCakes = async () => {
      try {
        const data = await fetchPublishedCakes();
        setCakes(data);
      } catch (error) {
        console.error('Error loading cakes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCakes();
  }, []);

  const filteredCakes = useMemo(() => {
    let result = [...cakes];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (cake) =>
          cake.title.toLowerCase().includes(query) ||
          cake.description?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (category !== 'all') {
      result = result.filter((cake) => cake.category === category);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [cakes, searchQuery, category, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(326_84%_44%/0.1),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Our Collection</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mt-2 mb-6">Shop Cakes</h1>
            <p className="text-xl text-foreground/70">
              Browse our delicious selection of handcrafted cakes. Click "Buy" to order via WhatsApp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <ShopFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={category}
            onCategoryChange={setCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <CakeCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCakes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCakes.map((cake, index) => (
                <CakeCard
                  key={cake.id}
                  cake={cake}
                  onViewDetails={setSelectedCake}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <CakeIcon className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-2">No Cakes Found</h3>
              <p className="text-foreground/60">
                {searchQuery || category !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Check back soon for new arrivals!'}
              </p>
            </motion.div>
          )}

          {/* Results count */}
          {!isLoading && filteredCakes.length > 0 && (
            <div className="mt-8 text-center text-foreground/60">
              Showing {filteredCakes.length} cake{filteredCakes.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CakeDetailsModal cake={selectedCake} onClose={() => setSelectedCake(null)} />
    </div>
  );
};

export default Shop;