import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Navbar } from '@/components/layout/Navbar';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/hooks/use-toast';
import {
  fetchAllCakes,
  createCake,
  updateCake,
  deleteCake,
  uploadCakeImage,
  deleteCakeImage,
  Cake,
} from '@/lib/supabase';

const categories = ['wedding', 'birthday', 'custom', 'anniversary', 'celebration'];

interface CakeFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  is_published: boolean;
  image_url: string | null;
}

const initialFormData: CakeFormData = {
  title: '',
  description: '',
  price: '',
  category: 'custom',
  is_published: true,
  image_url: null,
};

const Admin: React.FC = () => {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [deletingCake, setDeletingCake] = useState<Cake | null>(null);
  const [formData, setFormData] = useState<CakeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadCakes();
  }, [isAdmin, navigate]);

  const loadCakes = async () => {
    try {
      const data = await fetchAllCakes();
      setCakes(data);
    } catch (error) {
      console.error('Error loading cakes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cakes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const openCreateDialog = () => {
    setEditingCake(null);
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (cake: Cake) => {
    setEditingCake(cake);
    setFormData({
      title: cake.title,
      description: cake.description || '',
      price: cake.price.toString(),
      category: cake.category,
      is_published: cake.is_published,
      image_url: cake.image_url,
    });
    setImageFile(null);
    setImagePreview(cake.image_url);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (cake: Cake) => {
    setDeletingCake(cake);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadCakeImage(imageFile);
      }

      const cakeData = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category: formData.category,
        is_published: formData.is_published,
        image_url: imageUrl,
      };

      if (editingCake) {
        // If editing and new image uploaded, delete old image
        if (imageFile && editingCake.image_url) {
          try {
            await deleteCakeImage(editingCake.image_url);
          } catch (e) {
            console.error('Error deleting old image:', e);
          }
        }
        await updateCake(editingCake.id, cakeData);
        toast({ title: 'Success', description: 'Cake updated successfully' });
      } else {
        await createCake(cakeData);
        toast({ title: 'Success', description: 'Cake created successfully' });
      }

      setIsDialogOpen(false);
      loadCakes();
    } catch (error) {
      console.error('Error saving cake:', error);
      toast({
        title: 'Error',
        description: 'Failed to save cake',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCake) return;

    setIsSubmitting(true);
    try {
      // Delete image from storage
      if (deletingCake.image_url) {
        try {
          await deleteCakeImage(deletingCake.image_url);
        } catch (e) {
          console.error('Error deleting image:', e);
        }
      }
      await deleteCake(deletingCake.id);
      toast({ title: 'Success', description: 'Cake deleted successfully' });
      setIsDeleteDialogOpen(false);
      loadCakes();
    } catch (error) {
      console.error('Error deleting cake:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete cake',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublish = async (cake: Cake) => {
    try {
      await updateCake(cake.id, { is_published: !cake.is_published });
      loadCakes();
      toast({
        title: 'Success',
        description: `Cake ${cake.is_published ? 'hidden' : 'published'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cake',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-serif text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-foreground/60 mt-1">Manage your cake inventory</p>
            </div>
            <Button variant="hero" onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Cake
            </Button>
          </div>

          {/* Cakes Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : cakes.length > 0 ? (
            <div className="card-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-foreground/60">Image</th>
                      <th className="text-left p-4 font-medium text-foreground/60">Title</th>
                      <th className="text-left p-4 font-medium text-foreground/60">Category</th>
                      <th className="text-left p-4 font-medium text-foreground/60">Price</th>
                      <th className="text-left p-4 font-medium text-foreground/60">Status</th>
                      <th className="text-right p-4 font-medium text-foreground/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cakes.map((cake) => (
                      <motion.tr
                        key={cake.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border/50 hover:bg-card/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-foreground/5">
                            {cake.image_url ? (
                              <img
                                src={cake.image_url}
                                alt={cake.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                🎂
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{cake.title}</div>
                          <div className="text-sm text-foreground/60 line-clamp-1">
                            {cake.description}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="capitalize">
                            {cake.category}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium">₦{cake.price.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge
                            variant={cake.is_published ? 'default' : 'outline'}
                            className={cake.is_published ? 'bg-green-500/20 text-green-500' : ''}
                          >
                            {cake.is_published ? 'Published' : 'Hidden'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePublish(cake)}
                              title={cake.is_published ? 'Hide' : 'Publish'}
                            >
                              {cake.is_published ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(cake)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(cake)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 card-elevated">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">🎂</span>
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-2">No Cakes Yet</h3>
              <p className="text-foreground/60 mb-6">Start by adding your first cake</p>
              <Button variant="hero" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Cake
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingCake ? 'Edit Cake' : 'Add New Cake'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingCake ? 'update' : 'create'} a cake.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Cake Image</label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-foreground/5">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                    <span className="text-sm text-foreground/60">Click to upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Chocolate Dream Cake"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A rich, decadent chocolate cake..."
                rows={3}
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (₦) *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="15000"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({ ...formData, is_published: e.target.checked })
                }
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="is_published" className="text-sm">
                Publish immediately (visible in shop)
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingCake ? (
                  'Update Cake'
                ) : (
                  'Create Cake'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cake</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCake?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;