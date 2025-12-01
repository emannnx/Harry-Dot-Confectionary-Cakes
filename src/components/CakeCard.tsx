import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Cake } from '@/lib/supabase';

interface CakeCardProps {
  cake: Cake;
  onViewDetails: (cake: Cake) => void;
  index: number;
}

export const CakeCard: React.FC<CakeCardProps> = ({ cake, onViewDetails, index }) => {
  const handleBuy = () => {
    const message = encodeURIComponent(
      `Hello, I would like to purchase this cake:\n\nCake Name: ${cake.title}\nPrice: ₦${cake.price.toLocaleString()}\nImage: ${cake.image_url || 'No image available'}\n\nThank you.`
    );
    window.open(`https://wa.me/2348029443598?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-elegant group"
    >
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(cake)}
      >
        {cake.image_url ? (
          <img
            src={cake.image_url}
            alt={cake.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary/30" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <Button variant="glass" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        </div>

        <span className="absolute top-4 left-4 badge-elegant capitalize">
          {cake.category}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <h3 className="font-serif text-xl font-semibold line-clamp-1">{cake.title}</h3>

        {cake.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{cake.description}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold gradient-text">
            ₦{cake.price.toLocaleString()}
          </span>
          <Button variant="hero" size="sm" className="gap-2" onClick={handleBuy}>
            <ShoppingBag className="w-4 h-4" />
            Buy
          </Button>
        </div>
      </div>
    </motion.div>
  );
};