import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateAdminPin } from '@/lib/supabase';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter the PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await validateAdminPin(pin);
      
      if (result.success) {
        setIsAdmin(true);
        toast({
          title: 'Welcome, Admin!',
          description: 'You now have access to the admin dashboard.',
        });
        onClose();
        navigate('/admin');
        setPin('');
      } else {
        setError(result.error || 'Invalid PIN');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Centered Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex justify-center items-center z-50"
          >
            <div className="card-elevated p-8 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold">Admin Access</h2>
                    <p className="text-sm text-foreground/60">Enter PIN to continue</p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-card transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter admin PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="h-12 text-center text-lg tracking-widest"
                    maxLength={20}
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Access Dashboard'
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
