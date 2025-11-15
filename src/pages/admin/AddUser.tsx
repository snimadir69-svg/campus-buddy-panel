import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useAuth, User } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import QRScanner from '@/components/QRScanner';

const userSchema = z.object({
  surname: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak').max(50, 'Ism 50 ta belgidan oshmasligi kerak'),
  lastname: z.string().min(2, 'Familya kamida 2 ta belgidan iborat bo\'lishi kerak').max(50, 'Familya 50 ta belgidan oshmasligi kerak'),
  username: z.string().min(3, 'Username kamida 3 ta belgidan iborat bo\'lishi kerak').max(30, 'Username 30 ta belgidan oshmasligi kerak'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak').max(100),
  phone_number: z.string().regex(/^\+998\d{9}$/, 'Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  tg_username: z.string().max(50).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced'], { required_error: 'Level tanlang' }),
  course: z.string().min(1, 'Kurs tanlang'),
  direction: z.string().min(2, 'Yo\'nalish kamida 2 ta belgidan iborat bo\'lishi kerak').max(100),
  uuid: z.string().regex(/^ITC\d{3}$/, 'UUID ITC + 3 raqam formatida bo\'lishi kerak (masalan: ITC003)'),
  photo: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function AddUser() {
  const navigate = useNavigate();
  const { user, addUser } = useAuth();
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      surname: '',
      lastname: '',
      username: '',
      password: '',
      phone_number: '+998',
      tg_username: '',
      level: undefined,
      course: '',
      direction: '',
      uuid: '',
      photo: '',
    },
  });

  const handleQRScan = (decodedText: string) => {
    form.setValue('uuid', decodedText);
    toast({
      title: 'QR kod muvaffaqiyatli skanerlandi',
      description: `UUID: ${decodedText}`,
    });
  };

  const onSubmit = (data: UserFormData) => {
    const newUser: User = {
      id: data.uuid,
      username: data.username,
      password: data.password,
      role: 'student',
      surname: data.surname,
      lastname: data.lastname,
      phone_number: data.phone_number,
      tg_username: data.tg_username,
      level: data.level,
      course: data.course,
      direction: data.direction,
      photo: data.photo,
    };
    
    addUser(newUser);
    toast({
      title: 'Foydalanuvchi qo\'shildi',
      description: 'Yangi foydalanuvchi muvaffaqiyatli qo\'shildi',
    });
    navigate('/dashboard/admin/users');
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/admin/users')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Yangi foydalanuvchi qo'shish</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Foydalanuvchi ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="surname">Ism *</Label>
                  <Input
                    id="surname"
                    {...form.register('surname')}
                  />
                  {form.formState.errors.surname && (
                    <p className="text-sm text-destructive">{form.formState.errors.surname.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastname">Familya *</Label>
                  <Input
                    id="lastname"
                    {...form.register('lastname')}
                  />
                  {form.formState.errors.lastname && (
                    <p className="text-sm text-destructive">{form.formState.errors.lastname.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    {...form.register('username')}
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Parol *</Label>
                  <Input
                    id="password"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Telefon raqami *</Label>
                  <Input
                    id="phone_number"
                    placeholder="+998901234567"
                    {...form.register('phone_number')}
                  />
                  {form.formState.errors.phone_number && (
                    <p className="text-sm text-destructive">{form.formState.errors.phone_number.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tg_username">Telegram username</Label>
                  <Input
                    id="tg_username"
                    placeholder="@username"
                    {...form.register('tg_username')}
                  />
                  {form.formState.errors.tg_username && (
                    <p className="text-sm text-destructive">{form.formState.errors.tg_username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={form.watch('level')}
                    onValueChange={(value) => form.setValue('level', value as 'beginner' | 'intermediate' | 'advanced')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Level tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Boshlang'ich (Yashil)</SelectItem>
                      <SelectItem value="intermediate">O'rta (Sariq)</SelectItem>
                      <SelectItem value="advanced">Yuksak (Qizil)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.level && (
                    <p className="text-sm text-destructive">{form.formState.errors.level.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Kurs *</Label>
                  <Select
                    value={form.watch('course')}
                    onValueChange={(value) => form.setValue('course', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kurs tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kurs 1">Kurs 1</SelectItem>
                      <SelectItem value="Kurs 2">Kurs 2</SelectItem>
                      <SelectItem value="Kurs 3">Kurs 3</SelectItem>
                      <SelectItem value="Kurs 4">Kurs 4</SelectItem>
                      <SelectItem value="Kurs 5">Kurs 5</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.course && (
                    <p className="text-sm text-destructive">{form.formState.errors.course.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direction">Yo'nalish *</Label>
                  <Input
                    id="direction"
                    placeholder="Masalan: Dasturiy injinering"
                    {...form.register('direction')}
                  />
                  {form.formState.errors.direction && (
                    <p className="text-sm text-destructive">{form.formState.errors.direction.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uuid">UUID (QR kod orqali) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="uuid"
                      {...form.register('uuid')}
                      placeholder="QR kod skanerlang"
                      readOnly
                    />
                    <QRScanner onScanSuccess={handleQRScan} />
                  </div>
                  {form.formState.errors.uuid && (
                    <p className="text-sm text-destructive">{form.formState.errors.uuid.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Rasm URL (majburiy emas)</Label>
                  <Input
                    id="photo"
                    type="url"
                    placeholder="https://..."
                    {...form.register('photo')}
                  />
                  {form.formState.errors.photo && (
                    <p className="text-sm text-destructive">{form.formState.errors.photo.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/admin/users')}
                >
                  Bekor qilish
                </Button>
                <Button type="submit">
                  Saqlash
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
