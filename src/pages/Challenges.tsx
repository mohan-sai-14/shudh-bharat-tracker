
import { useState } from "react";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { EcoChallenge } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

const Challenges = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");
  const [challenges] = useState<EcoChallenge[]>([
    {
      id: "1",
      title: "Plant 5 Trees",
      description: "Help increase green cover by planting trees in your neighborhood.",
      points: 500,
      participants: 1245,
      difficulty: "Medium",
      duration: "30 days",
      startDate: "2025-04-15",
      endDate: "2025-05-15",
      type: "Individual",
      isActive: true,
      completedBy: []
    },
    {
      id: "2",
      title: "Zero Plastic Week",
      description: "Eliminate all single-use plastics from your daily routine.",
      points: 300,
      participants: 857,
      difficulty: "Hard",
      duration: "7 days",
      startDate: "2025-04-20",
      endDate: "2025-04-27",
      type: "Individual",
      isActive: true,
      completedBy: []
    },
    {
      id: "3",
      title: "Community Clean-up Drive",
      description: "Organize a community clean-up event in your neighborhood or local park.",
      points: 750,
      participants: 342,
      difficulty: "Medium",
      duration: "1 day",
      startDate: "2025-04-28",
      endDate: "2025-04-28",
      type: "Community",
      isActive: true,
      completedBy: []
    },
    {
      id: "4",
      title: "Water Conservation Week",
      description: "Reduce your daily water consumption by at least 20%.",
      points: 400,
      participants: 623,
      difficulty: "Medium",
      duration: "7 days",
      startDate: "2025-05-01",
      endDate: "2025-05-07",
      type: "Individual",
      isActive: true,
      completedBy: []
    },
    {
      id: "5",
      title: "Go Car-Free",
      description: "Use only public transportation, cycling, or walking for a full week.",
      points: 350,
      participants: 512,
      difficulty: "Hard",
      duration: "7 days",
      startDate: "2025-05-10",
      endDate: "2025-05-17",
      type: "Individual",
      isActive: true,
      completedBy: []
    },
    {
      id: "6",
      title: "E-Waste Collection Drive",
      description: "Collect and properly dispose of electronic waste from your community.",
      points: 600,
      participants: 218,
      difficulty: "Hard",
      duration: "14 days",
      startDate: "2025-05-15",
      endDate: "2025-05-29",
      type: "Community",
      isActive: true,
      completedBy: []
    }
  ]);
  
  const handleChallengeAccept = (challenge: EcoChallenge) => {
    toast({
      title: "Challenge Accepted!",
      description: `You've accepted the "${challenge.title}" challenge. Good luck!`,
      duration: 3000,
    });
  };
  
  const handleChallengeComplete = (challenge: EcoChallenge) => {
    toast({
      title: "Challenge Completed!",
      description: `Congratulations! You've earned ${challenge.points} eco-points.`,
      duration: 3000,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-dark-green">
          Eco Challenges
        </h1>
        <p className="text-muted-foreground">
          Join challenges to earn eco-points and make a difference
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <Tabs 
          defaultValue="all" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "all" | "active" | "completed")}
        >
          <TabsList>
            <TabsTrigger value="all">All Challenges</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Filter
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer">All</Badge>
        <Badge variant="secondary" className="cursor-pointer">Individual</Badge>
        <Badge variant="outline" className="cursor-pointer">Community</Badge>
        <Badge variant="outline" className="cursor-pointer">Easy</Badge>
        <Badge variant="outline" className="cursor-pointer">Medium</Badge>
        <Badge variant="outline" className="cursor-pointer">Hard</Badge>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAccept={handleChallengeAccept}
            onComplete={handleChallengeComplete}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline">Load More Challenges</Button>
      </div>
    </div>
  );
};

export default Challenges;
