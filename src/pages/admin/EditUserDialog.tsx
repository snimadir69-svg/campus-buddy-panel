import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authFetch } from '@/lib/authFetch';

const userSchema = z.object({
  first_name: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak').max(50),
  last_name: z.string().min(2, 'Familya kamida 2 ta belgidan iborat bo\'lishi kerak').max(50),
  username: z.string().min(3, 'Username kamida 3 ta belgidan iborat bo\'lishi kerak').max(30),
  phone_number: z.string().min(1, 'Telefon raqam kiriting'),
  tg_username: z.string().max(50).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  course: z.string().min(1),
  direction: z.string().min(2).max(100),
  coins: z.number().min(0, 'Tangalar 0 dan kam bo\'lmasligi kerak').optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: Partial<User>) => void;
}

export default function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        phone_number: user.phone_number,
        tg_username: user.tg_username || '',
        level: (user.level || 'beginner') as 'beginner' | 'intermediate' | 'advanced',
        course: user.course || '',
        direction: user.direction || '',
        coins: user.coins || 0,
      });
      setPhotoFile(null);
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormData) => {
    if (!user || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('surname', data.first_name);
      formData.append('lastname', data.last_name);
      formData.append('username', data.username);
      formData.append('phone_number', data.phone_number);
      formData.append('tg_username', data.tg_username || '');
      formData.append('level', data.level);
      formData.append('course', data.course);
      formData.append('direction', data.direction);
      
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await authFetch(`/users/users/${user.id}/`, {
        method: 'PATCH',
        headers: {},
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Foydalanuvchini yangilashda xatolik');
      }

      const updatedUser = await response.json();
      onSave(user.id, updatedUser);
      
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Foydalanuvchi ma\'lumotlari yangilandi',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Xato',
        description: error instanceof Error ? error.message : 'Foydalanuvchini yangilashda xatolik',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Foydalanuvchi ma'lumotlarini tahrirlash</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-first_name">Ism *</Label>
              <Input id="edit-first_name" {...form.register('first_name')} />
              {form.formState.errors.first_name && (
                <p className="text-sm text-destructive">{form.formState.errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-last_name">Familya *</Label>
              <Input id="edit-last_name" {...form.register('last_name')} />
              {form.formState.errors.last_name && (
                <p className="text-sm text-destructive">{form.formState.errors.last_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username *</Label>
              <Input id="edit-username" {...form.register('username')} />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefon raqami *</Label>
              <Input id="edit-phone" {...form.register('phone_number')} />
              {form.formState.errors.phone_number && (
                <p className="text-sm text-destructive">{form.formState.errors.phone_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tg">Telegram username</Label>
              <Input id="edit-tg" placeholder="@username" {...form.register('tg_username')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-level">Level *</Label>
              <Select
                value={form.watch('level')}
                onValueChange={(value) => form.setValue('level', value as 'beginner' | 'intermediate' | 'advanced')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Boshlang'ich (Yashil)</SelectItem>
                  <SelectItem value="intermediate">O'rta (Sariq)</SelectItem>
                  <SelectItem value="advanced">Yuksak (Qizil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course">Kurs *</Label>
              <Select
                value={form.watch('course')}
                onValueChange={(value) => form.setValue('course', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kurs 1">Kurs 1</SelectItem>
                  <SelectItem value="Kurs 2">Kurs 2</SelectItem>
                  <SelectItem value="Kurs 3">Kurs 3</SelectItem>
                  <SelectItem value="Kurs 4">Kurs 4</SelectItem>
                  <SelectItem value="Kurs 5">Kurs 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-direction">Yo'nalish *</Label>
              <Input id="edit-direction" {...form.register('direction')} />
              {form.formState.errors.direction && (
                <p className="text-sm text-destructive">{form.formState.errors.direction.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-photo">Foydalanuvchi rasmi</Label>
              <Input
                id="edit-photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhotoFile(file);
                  }
                }}
              />
              {photoFile && (
                <p className="text-sm text-muted-foreground">
                  Tanlangan: {photoFile.name}
                </p>
              )}
            </div>
            </div>

            <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="edit-coins">Tangalar (Coins)</Label>
              <Input 
                id="edit-coins" 
                type="number" 
                min="0"
                placeholder="0" 
                {...form.register('coins', { valueAsNumber: true })} 
              />
              {form.formState.errors.coins && (
                <p className="text-sm text-destructive">{form.formState.errors.coins.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
