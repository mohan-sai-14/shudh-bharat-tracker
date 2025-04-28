
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Users, Award, CheckCircle } from "lucide-react";
import { useState } from "react";
import { EcoChallenge } from "@/types";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  challenge: EcoChallenge;
  onAccept?: (challenge: EcoChallenge) => void;
  onComplete?: (challenge: EcoChallenge) => void;
}

export function ChallengeCard({ challenge, onAccept, onComplete }: ChallengeCardProps) {
  const [status, setStatus] = useState<'idle' | 'accepted' | 'completed'>('idle');
  
  const handleAccept = () => {
    setStatus('accepted');
    if (onAccept) onAccept(challenge);
  };
  
  const handleComplete = () => {
    setStatus('completed');
    if (onComplete) onComplete(challenge);
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className={cn(
        "h-1.5",
        challenge.difficulty === 'Easy' ? "bg-eco-green" : 
        challenge.difficulty === 'Medium' ? "bg-eco-blue" : 
        "bg-eco-dark-blue"
      )} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{challenge.title}</CardTitle>
          <Badge variant={
            challenge.difficulty === 'Easy' ? "default" : 
            challenge.difficulty === 'Medium' ? "secondary" : 
            "outline"
          }>
            {challenge.difficulty}
          </Badge>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Trophy className="h-4 w-4" />
          <span>{challenge.points} Eco-points</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span>{challenge.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{challenge.participants} participants</span>
        </div>
      </CardContent>
      <CardFooter>
        {status === 'idle' && (
          <Button 
            onClick={handleAccept}
            className="w-full"
            variant="default"
          >
            <Award className="h-4 w-4 mr-2" />
            Accept Challenge
          </Button>
        )}
        {status === 'accepted' && (
          <Button 
            onClick={handleComplete}
            className="w-full"
            variant="outline"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        )}
        {status === 'completed' && (
          <Button 
            className="w-full bg-eco-green hover:bg-eco-dark-green" 
            disabled
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Challenge Completed!
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
