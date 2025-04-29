import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/types";
import { BookOpen, Camera, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface UserStats {
  reportCount: number;
  commentsCount: number;
  upvotesCount: number;
}

const Profile = () => {
  // Mock user profile data
  const [profile, setProfile] = useState<UserProfile>({
    id: "user123",
    name: "Rohan Kumar",
    email: "rohan.kumar@example.com",
    city: "Bengaluru",
    ecoPoints: 0,
    reportCount: 0,
    challengesCompleted: 0,
    badges: [],
    joinDate: "2024-12-15"
  });

  // Mock user pollution reports
  const [reports, setReports] = useState([
    {
      id: "report1",
      title: "Factory emitting black smoke",
      type: "Air",
      status: "Investigating",
      date: "2025-04-15",
      upvotes: 15
    },
    {
      id: "report2",
      title: "Garbage dump near Koramangala lake",
      type: "Garbage",
      status: "Reported",
      date: "2025-04-10",
      upvotes: 8
    },
    {
      id: "report3",
      title: "Chemical waste in storm drain",
      type: "Water",
      status: "Resolved",
      date: "2025-03-29",
      upvotes: 23
    },
    {
      id: "report4",
      title: "Construction dust pollution",
      type: "Air",
      status: "Investigating",
      date: "2025-03-22",
      upvotes: 12
    }
  ]);

  // Mock completed challenges
  const [completedChallenges, setCompletedChallenges] = useState([
    {
      id: "challenge1",
      title: "Plant 5 Trees",
      points: 500,
      completedDate: "2025-04-05"
    },
    {
      id: "challenge2",
      title: "Zero Plastic Week",
      points: 300,
      completedDate: "2025-03-27"
    },
    {
      id: "challenge3",
      title: "Community Clean-up Drive",
      points: 750,
      completedDate: "2025-03-15"
    }
  ]);

  const [stats, setStats] = useState<UserStats>({
    reportCount: 0,
    commentsCount: 0,
    upvotesCount: 0
  });

  useEffect(() => {
    setProfile({
      id: "user123",
      name: "Rohan Kumar",
      email: "rohan.kumar@example.com",
      city: "Bengaluru",
      ecoPoints: 18 * 100,
      reportCount: 18,
      challengesCompleted: 9,
      badges: [
        "Eco Warrior",
        "Air Guardian",
        "Cleanup Champion",
        "Tree Planter",
        "Water Protector"
      ],
      joinDate: "2024-12-15"
    });
  }, []);

  // Format join date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-2">
                <AvatarImage src="/avatar-placeholder.svg" />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <Badge variant="secondary" className="mx-auto mt-2">
                {profile.badges[0]}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Email</span>
                  <span>{profile.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">City</span>
                  <span>{profile.city}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Member Since</span>
                  <span>{formatDate(profile.joinDate)}</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((badge, index) => (
                  <Badge key={index} variant="outline">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-4 bg-eco-light-green rounded-lg">
                  <div className="text-3xl font-bold text-eco-dark-green">{profile.ecoPoints}</div>
                  <div className="text-sm text-muted-foreground">Total Eco-Points</div>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-eco-light-blue rounded-lg">
                  <div className="text-3xl font-bold text-eco-dark-blue">{profile.reportCount}</div>
                  <div className="text-sm text-muted-foreground">Pollution Reports</div>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-eco-light-earth rounded-lg">
                  <div className="text-3xl font-bold text-eco-earth">{profile.challengesCompleted}</div>
                  <div className="text-sm text-muted-foreground">Challenges Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="reports">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="reports">
                <Camera className="mr-2 h-4 w-4" />
                Your Reports
              </TabsTrigger>
              <TabsTrigger value="activity">
                <BookOpen className="mr-2 h-4 w-4" />
                Your Activity
              </TabsTrigger>
              <TabsTrigger value="badges">
                <Trophy className="mr-2 h-4 w-4" />
                Your Badges
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Pollution Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map(report => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Badge variant={
                              report.type === 'Air' ? "default" : 
                              report.type === 'Water' ? "secondary" : 
                              "outline"
                            }>
                              {report.type}
                            </Badge>
                            <span>{formatDate(report.date)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            report.status === 'Resolved' ? "default" :
                            report.status === 'Investigating' ? "secondary" :
                            "outline"
                          }>
                            {report.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {report.upvotes} upvotes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedChallenges.map(challenge => (
                      <div key={challenge.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{challenge.title}</div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{challenge.points} points</span>
                            <span>{formatDate(challenge.completedDate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Earned Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge, index) => (
                      <Badge key={index} variant="outline">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
