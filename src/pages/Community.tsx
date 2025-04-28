
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PollutionReport {
  id: string;
  location: string;
  description: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
  userName: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

const Community = () => {
  const [reports, setReports] = useState<PollutionReport[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: "User",
      message: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-dark-green">Community</h1>
        <p className="text-muted-foreground">Connect with other environmental warriors</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {reports.map(report => (
                <div key={report.id} className="mb-4 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{report.location}</span>
                    <Badge>{report.severity}</Badge>
                  </div>
                  <p className="mt-2 text-sm">{report.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Reported by {report.userName} on {new Date(report.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] mb-4">
              {messages.map(msg => (
                <div key={msg.id} className="mb-3 flex gap-2">
                  <Avatar />
                  <div>
                    <div className="font-medium">{msg.user}</div>
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
