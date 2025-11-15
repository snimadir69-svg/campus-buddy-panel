import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { useAuth, User } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EditUserDialog from './EditUserDialog';

export default function UserManagement() {
  const navigate = useNavigate();
  const { user, users, updateUser, deleteUser } = useAuth();
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleEdit = (userToEdit: User) => {
    setEditingUser(userToEdit);
  };

  const handleSave = (id: string, data: Partial<User>) => {
    updateUser(id, data);
    toast({
      title: 'Saqlandi',
      description: 'Foydalanuvchi ma\'lumotlari yangilandi',
    });
  };

  const handleDelete = () => {
    if (deletingUserId) {
      deleteUser(deletingUserId);
      toast({
        title: 'O\'chirildi',
        description: 'Foydalanuvchi o\'chirildi',
      });
      setDeletingUserId(null);
    }
  };
  
  const studentUsers = users.filter(u => u.role === 'student');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Boshlang\'ich';
      case 'intermediate':
        return 'O\'rta';
      case 'advanced':
        return 'Yuksak';
      default:
        return level;
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Foydalanuvchilar</h1>
          <Button onClick={() => navigate('/dashboard/admin/add-user')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Yangi foydalanuvchi
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Barcha foydalanuvchilar</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ism</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Kurs</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Yo'nalish</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentUsers.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.surname} {student.lastname}
                    </TableCell>
                    <TableCell>{student.username}</TableCell>
                    <TableCell>{student.phone_number}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(student.level || 'beginner')}>
                        {getLevelText(student.level || 'beginner')}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.direction}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setDeletingUserId(student.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSave={handleSave}
      />

      <AlertDialog open={!!deletingUserId} onOpenChange={(open) => !open && setDeletingUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Foydalanuvchini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni bekor qilib bo'lmaydi. Foydalanuvchi butunlay o'chiriladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
