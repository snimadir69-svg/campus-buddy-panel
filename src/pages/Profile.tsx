import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, User as UserIcon, Trophy, Coins, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Profile() {
  const { user, users } = useAuth();

  if (!user) {
    return null;
  }

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

  // Calculate student rankings
  const studentUsers = users.filter(u => u.role === 'student');
  const sortedStudents = [...studentUsers].sort((a, b) => (b.coins || 0) - (a.coins || 0));
  const userRank = sortedStudents.findIndex(u => u.id === user.id) + 1;
  const totalStudents = studentUsers.length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Profil</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photo} alt={user.surname} />
                  <AvatarFallback className="text-lg">
                    {user.surname[0]}{user.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {user.surname} {user.lastname}
                  </h3>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user.phone_number}</span>
                </div>
                
                {user.tg_username && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{user.tg_username}</span>
                  </div>
                )}

                {user.role === 'student' && (
                  <>
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{user.course}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-muted-foreground">Level:</span>
                      <Badge className={getLevelColor(user.level || 'beginner')}>
                        {getLevelText(user.level || 'beginner')}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-muted-foreground">Yo'nalish:</span>
                      <span className="text-foreground">{user.direction}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {user.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Statistika
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-yellow-500" />
                      <span className="text-muted-foreground">Tangalar:</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{user.coins || 0}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span className="text-muted-foreground">O'rningiz:</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        {userRank}-o'rin
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {totalStudents} talabadan
                      </div>
                    </div>
                  </div>
                  <Progress value={(1 - (userRank - 1) / totalStudents) * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Top 3 talabalar:</div>
                  <div className="space-y-2">
                    {sortedStudents.slice(0, 3).map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            'bg-orange-600'
                          } text-white text-xs font-bold`}>
                            {index + 1}
                          </div>
                          <span className="text-sm">
                            {student.surname} {student.lastname}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">{student.coins || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Qo'shimcha ma'lumotlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UUID:</span>
                    <span className="font-mono text-foreground">{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rol:</span>
                    <Badge variant="secondary">Admin</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
