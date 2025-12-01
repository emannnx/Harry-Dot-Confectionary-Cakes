import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cake } from '@/lib/supabase';

interface CakeDetailsModalProps {
  cake: Cake | null;
  onClose: () => void;
}

export const CakeDetailsModal: React.FC<CakeDetailsModalProps> = ({ cake, onClose }) => {
  if (!cake) return null;

  const handleBuy = () => {
    const message = encodeURIComponent(
      `Hello, I would like to purchase this cake:\n\nCake Name: ${cake.title}\nPrice: ₦${cake.price.toLocaleString()}\nImage: ${cake.image_url || 'No image available'}\n\nThank you.`
    );
    window.open(`https://wa.me/2348029443598?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {cake && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-auto"
          >
            <div className="card-elevated mx-4 overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-square md:aspect-auto">
                  {cake.image_url ? (
                    <img
                      src={cake.image_url}
                      alt={cake.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="font-serif text-6xl">🎂</span>
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground capitalize">
                    {cake.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold mb-2">{cake.title}</h2>
                      <p className="text-3xl font-bold text-primary">
                        ₦{cake.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-card transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {cake.description || 'A delicious handcrafted cake made with the finest ingredients and lots of love.'}
                    </p>
                  </div>

                  <div className="mt-8 space-y-3">
                    <Button
                      variant="hero"
                      size="xl"
                      className="w-full gap-2"
                      onClick={handleBuy}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Order via WhatsApp
                    </Button>
                    <p className="text-center text-sm text-foreground/50">
                      Click to message us directly on WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};