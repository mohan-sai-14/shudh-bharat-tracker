import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function EducationalContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learn About Pollution</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pollutants" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pollutants">Pollutants</TabsTrigger>
            <TabsTrigger value="prevention">Prevention</TabsTrigger>
            <TabsTrigger value="health">Health Effects</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <TabsContent value="pollutants" className="space-y-4">
              <h3 className="text-lg font-semibold">Common Air Pollutants</h3>
              <ul className="space-y-2">
                <li>
                  <strong>PM2.5 & PM10</strong>
                  <p>Fine particulate matter that can penetrate deep into lungs.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health" target="_blank" rel="noopener noreferrer">
                      Learn more about particulate matter <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
                <li>
                  <strong>NO2 (Nitrogen Dioxide)</strong>
                  <p>A toxic gas from vehicle exhaust and power plants.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.epa.gov/no2-pollution" target="_blank" rel="noopener noreferrer">
                      EPA guide on NO2 <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
                <li>
                  <strong>SO2 (Sulfur Dioxide)</strong>
                  <p>A harmful gas produced by burning fossil fuels.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.epa.gov/so2-pollution" target="_blank" rel="noopener noreferrer">
                      Understanding SO2 pollution <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="prevention" className="space-y-4">
              <h3 className="text-lg font-semibold">Prevention Methods</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Use Public Transportation</strong>
                  <p>Reduce vehicle emissions by using public transit or carpooling.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.c40.org/benefits-of-public-transport" target="_blank" rel="noopener noreferrer">
                      Benefits of public transport <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
                <li>
                  <strong>Energy Conservation</strong>
                  <p>Use energy-efficient appliances and reduce power consumption.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.energy.gov/energysaver/energy-saver" target="_blank" rel="noopener noreferrer">
                      Energy saving tips <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
                <li>
                  <strong>Plant Trees</strong>
                  <p>Increase green cover to naturally filter air pollutants.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.unep.org/news-and-stories/story/how-trees-act-citys-lungs" target="_blank" rel="noopener noreferrer">
                      Trees as city lungs <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <h3 className="text-lg font-semibold">Health Effects</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Respiratory Issues</strong>
                  <p>Air pollution can cause or worsen respiratory problems.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.who.int/teams/environment-climate-change-and-health/air-quality-and-health/health-impacts" target="_blank" rel="noopener noreferrer">
                      WHO health impacts guide <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
                <li>
                  <strong>Cardiovascular Disease</strong>
                  <p>Long-term exposure can lead to heart problems.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.heart.org/en/health-topics/consumer-healthcare/air-pollution-and-heart-disease" target="_blank" rel="noopener noreferrer">
                      Air pollution and heart health <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
                <li>
                  <strong>Children's Health</strong>
                  <p>Children are particularly vulnerable to air pollution.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://www.unicef.org/stories/air-pollution-and-children" target="_blank" rel="noopener noreferrer">
                      UNICEF on children and air pollution <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </li>
              </ul>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
