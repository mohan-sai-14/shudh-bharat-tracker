
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/types";
import { Search } from "lucide-react";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock news articles
  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title: "Air Pollution Levels Drop 15% in Delhi Following New Regulations",
      summary: "Recent implementation of stricter emission norms and expanded public transport has led to a significant improvement in Delhi's air quality.",
      source: "The Hindu",
      url: "#",
      publishedDate: "2025-04-27",
      image: "https://picsum.photos/seed/news1/800/400",
      category: "Air"
    },
    {
      id: "2",
      title: "Ganga Cleanup Project Shows Promising Results in Water Quality",
      summary: "The ambitious Namami Gange project reports significant improvement in water quality at several monitoring stations along the river.",
      source: "Down To Earth",
      url: "#",
      publishedDate: "2025-04-25",
      image: "https://picsum.photos/seed/news2/800/400",
      category: "Water"
    },
    {
      id: "3",
      title: "New Plastic Ban to Take Effect Nationwide Next Month",
      summary: "The comprehensive ban on single-use plastics will be enforced across all states, with hefty penalties for violations.",
      source: "Times of India",
      url: "#",
      publishedDate: "2025-04-23",
      image: "https://picsum.photos/seed/news3/800/400",
      category: "Policy"
    },
    {
      id: "4",
      title: "Youth-Led Clean India Drive Collects 10 Tons of Waste in Mumbai",
      summary: "Over 5,000 volunteers participated in a massive cleanup drive organized by college students across Mumbai beaches.",
      source: "Mumbai Mirror",
      url: "#",
      publishedDate: "2025-04-21",
      image: "https://picsum.photos/seed/news4/800/400",
      category: "Community"
    },
    {
      id: "5",
      title: "New Air Quality Monitoring Network Launched in 50 Cities",
      summary: "The government has deployed next-generation air quality monitoring stations with real-time data access for citizens.",
      source: "Indian Express",
      url: "#",
      publishedDate: "2025-04-19",
      image: "https://picsum.photos/seed/news5/800/400",
      category: "Technology"
    },
    {
      id: "6",
      title: "Bengaluru Lakes Show Signs of Recovery After Restoration Efforts",
      summary: "Several lakes in Bengaluru are showing improved water quality and return of native species following community-led restoration.",
      source: "Deccan Herald",
      url: "#",
      publishedDate: "2025-04-17",
      image: "https://picsum.photos/seed/news6/800/400",
      category: "Water"
    }
  ];
  
  // Filter articles based on search query
  const filteredArticles = newsArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-dark-green">
          Environmental News
        </h1>
        <p className="text-muted-foreground">
          Latest updates on pollution control and environmental initiatives
        </p>
      </div>
      
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search news articles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map(article => (
          <Card key={article.id} className="overflow-hidden flex flex-col">
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform hover:scale-105" 
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <Badge variant="outline" className="mb-2">
                  {article.category}
                </Badge>
                <CardDescription>{article.publishedDate}</CardDescription>
              </div>
              <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {article.summary}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground">Source: {article.source}</span>
              <Button variant="outline" size="sm" asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No news articles found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default News;
