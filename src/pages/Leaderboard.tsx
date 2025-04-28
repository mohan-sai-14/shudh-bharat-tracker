
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Leaderboard = () => {
  const userLeaderboard = [
    {
      id: 1,
      name: "Arjun Sharma",
      city: "Delhi",
      points: 4850,
      reports: 32,
      challenges: 12,
      avatar: "",
      badge: "Eco Champion"
    },
    {
      id: 2,
      name: "Priya Patel",
      city: "Mumbai",
      points: 4210,
      reports: 28,
      challenges: 11,
      avatar: "",
      badge: "Eco Warrior"
    },
    {
      id: 3,
      name: "Rahul Singh",
      city: "Bengaluru",
      points: 3920,
      reports: 25,
      challenges: 10,
      avatar: "",
      badge: "Eco Guardian"
    },
    {
      id: 4,
      name: "Ananya Desai",
      city: "Kolkata",
      points: 3750,
      reports: 22,
      challenges: 9,
      avatar: "",
      badge: "Green Defender"
    },
    {
      id: 5,
      name: "Vikram Gupta",
      city: "Chennai",
      points: 3580,
      reports: 21,
      challenges: 9,
      avatar: "",
      badge: "Eco Protector"
    },
    {
      id: 6,
      name: "Kavita Reddy",
      city: "Hyderabad",
      points: 3350,
      reports: 19,
      challenges: 8,
      avatar: "",
      badge: "Nature Guardian"
    },
    {
      id: 7,
      name: "Aditya Kumar",
      city: "Pune",
      points: 3210,
      reports: 18,
      challenges: 8,
      avatar: "",
      badge: "Earth Defender"
    },
    {
      id: 8,
      name: "Meera Joshi",
      city: "Ahmedabad",
      points: 2980,
      reports: 17,
      challenges: 7,
      avatar: "",
      badge: "Green Pioneer"
    },
    {
      id: 9,
      name: "Sameer Khanna",
      city: "Jaipur",
      points: 2850,
      reports: 16,
      challenges: 7,
      avatar: "",
      badge: "Eco Hero"
    },
    {
      id: 10,
      name: "Neha Verma",
      city: "Lucknow",
      points: 2740,
      reports: 15,
      challenges: 6,
      avatar: "",
      badge: "Earth Savior"
    }
  ];

  const cityLeaderboard = [
    { id: 1, name: "Bengaluru", points: 42500, reports: 256, challenges: 128, improvement: "+12%" },
    { id: 2, name: "Pune", points: 38700, reports: 231, challenges: 119, improvement: "+9%" },
    { id: 3, name: "Chandigarh", points: 35600, reports: 198, challenges: 112, improvement: "+15%" },
    { id: 4, name: "Indore", points: 33200, reports: 187, challenges: 103, improvement: "+18%" },
    { id: 5, name: "Mysuru", points: 31800, reports: 176, challenges: 97, improvement: "+7%" },
    { id: 6, name: "Surat", points: 29500, reports: 168, challenges: 92, improvement: "+11%" },
    { id: 7, name: "Coimbatore", points: 28400, reports: 153, challenges: 88, improvement: "+8%" },
    { id: 8, name: "Bhopal", points: 26900, reports: 142, challenges: 83, improvement: "+6%" },
    { id: 9, name: "Visakhapatnam", points: 25300, reports: 139, challenges: 79, improvement: "+10%" },
    { id: 10, name: "Nagpur", points: 24100, reports: 132, challenges: 75, improvement: "+5%" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-dark-green">
          Eco Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Top contributors making India clean and green
        </p>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Top Citizens</TabsTrigger>
          <TabsTrigger value="cities">Top Cities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Citizen Champions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userLeaderboard.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      index === 0 ? "bg-yellow-50" : 
                      index === 1 ? "bg-gray-50" : 
                      index === 2 ? "bg-amber-50" : 
                      ""
                    }`}
                  >
                    <div className="flex items-center justify-center w-8">
                      <span className={`text-lg font-bold ${
                        index === 0 ? "text-yellow-600" : 
                        index === 1 ? "text-gray-600" : 
                        index === 2 ? "text-amber-800" : 
                        "text-gray-500"
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        <Badge variant="outline">{user.badge}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{user.city}</span>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-eco-dark-green">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.reports} reports · {user.challenges} challenges
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cities" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">City Champions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cityLeaderboard.map((city, index) => (
                  <div 
                    key={city.id} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      index === 0 ? "bg-yellow-50" : 
                      index === 1 ? "bg-gray-50" : 
                      index === 2 ? "bg-amber-50" : 
                      ""
                    }`}
                  >
                    <div className="flex items-center justify-center w-8">
                      <span className={`text-lg font-bold ${
                        index === 0 ? "text-yellow-600" : 
                        index === 1 ? "text-gray-600" : 
                        index === 2 ? "text-amber-800" : 
                        "text-gray-500"
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-green-600">{city.improvement} improvement</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-eco-dark-green">{city.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {city.reports} reports · {city.challenges} challenges
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
