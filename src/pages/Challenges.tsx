import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const Challenges = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-dark-green">
          Environmental Challenges
        </h1>
        <p className="text-muted-foreground">
          Take action to improve our environment
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Environmental challenges and initiatives will be available here soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Challenges;