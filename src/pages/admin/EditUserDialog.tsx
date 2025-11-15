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
import QRScanner from '@/components/QRScanner';

const userSchema = z.object({
  surname: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak').max(50),
  lastname: z.string().min(2, 'Familya kamida 2 ta belgidan iborat bo\'lishi kerak').max(50),
  username: z.string().min(3, 'Username kamida 3 ta belgidan iborat bo\'lishi kerak').max(30),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak').max(100),
  phone_number: z.string().regex(/^\+998\d{9}$/, 'Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  tg_username: z.string().max(50).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  course: z.string().min(1),
  direction: z.string().min(2).max(100),
  uuid: z.string().regex(/^ITC\d{3}$/, 'UUID ITC + 3 raqam formatida bo\'lishi kerak (masalan: ITC003)'),
  photo: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: Partial<User>) => void;
}

export default function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        surname: user.surname,
        lastname: user.lastname,
        username: user.username,
        password: user.password,
        phone_number: user.phone_number,
        tg_username: user.tg_username || '',
        level: user.level || 'beginner',
        course: user.course || '',
        direction: user.direction || '',
        uuid: user.id,
        photo: user.photo || '',
      });
    }
  }, [user, form]);

  const handleQRScan = (decodedText: string) => {
    form.setValue('uuid', decodedText);
  };

  const onSubmit = (data: UserFormData) => {
    if (user) {
      onSave(user.id, data);
      onOpenChange(false);
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
              <Label htmlFor="edit-surname">Ism *</Label>
              <Input id="edit-surname" {...form.register('surname')} />
              {form.formState.errors.surname && (
                <p className="text-sm text-destructive">{form.formState.errors.surname.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lastname">Familya *</Label>
              <Input id="edit-lastname" {...form.register('lastname')} />
              {form.formState.errors.lastname && (
                <p className="text-sm text-destructive">{form.formState.errors.lastname.message}</p>
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
              <Label htmlFor="edit-password">Parol *</Label>
              <Input id="edit-password" type="password" {...form.register('password')} />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
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
              <Label htmlFor="edit-uuid">UUID (ITC + 3 raqam) *</Label>
              <div className="flex gap-2">
                <Input id="edit-uuid" {...form.register('uuid')} placeholder="ITC003" readOnly />
                <QRScanner onScanSuccess={handleQRScan} />
              </div>
              {form.formState.errors.uuid && (
                <p className="text-sm text-destructive">{form.formState.errors.uuid.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-photo">Rasm URL</Label>
              <Input id="edit-photo" type="url" placeholder="https://..." {...form.register('photo')} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Bekor qilish
            </Button>
            <Button type="submit">Saqlash</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
