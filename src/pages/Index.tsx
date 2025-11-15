import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const Index = () => {
  const { user, users } = useAuth();

  if (!user) return null;

  const studentCount = users.filter(u => u.role === 'student').length;
  const totalCoins = users.reduce((sum, u) => sum + (u.coins || 0), 0);
  const avgCoins = studentCount > 0 ? Math.round(totalCoins / studentCount) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Xush kelibsiz, {user.surname} {user.lastname}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Bu yerda umumiy ma'lumotlar va statistikalarni ko'rishingiz mumkin
          </p>
        </div>

        {user.role === 'admin' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jami talabalar</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jami tangalar</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCoins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">O'rtacha tangalar</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgCoins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktiv kurslar</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>
          </div>
        )}

        {user.role === 'student' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sizning ma'lumotlaringiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kurs:</span>
                  <span className="font-medium">{user.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yo'nalish:</span>
                  <span className="font-medium">{user.direction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tangalar:</span>
                  <span className="font-medium text-yellow-500">{user.coins || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tez havolalar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Profilingizni ko'rish va statistikalaringizni tekshirish uchun chap tomondagi menyudan foydalaning.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
