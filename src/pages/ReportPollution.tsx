
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, UploadCloud } from "lucide-react";
import { usePollution } from "@/contexts/PollutionContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(10, { message: "Please provide more details" }).max(500),
  type: z.enum(["Air", "Water", "Garbage"], { 
    required_error: "Please select pollution type" 
  }),
  severity: z.enum(["Low", "Medium", "High", "Critical"], { 
    required_error: "Please select severity level" 
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ReportPollution = () => {
  const { userLocation } = usePollution();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: undefined,
      severity: undefined,
    },
  });
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...newFiles].slice(0, 3));
    setPreviewUrls(prev => [...prev, ...newUrls].slice(0, 3));
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...previewUrls];
    
    // Revoke object URL to prevent memory leak
    URL.revokeObjectURL(newUrls[index]);
    
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    
    setImages(newImages);
    setPreviewUrls(newUrls);
  };
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Form submitted with values:", values);
    console.log("Uploaded images:", images);
    console.log("User location:", userLocation);
    
    toast({
      title: "Pollution Report Submitted",
      description: "Thank you for helping make Bharat cleaner! Your report has been received.",
      duration: 5000,
    });
    
    // Reset form
    form.reset();
    setImages([]);
    setPreviewUrls([]);
    setIsSubmitting(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-dark-green">
          Report Pollution
        </h1>
        <p className="text-muted-foreground">
          Help identify pollution sources in your area
        </p>
      </div>
      
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Factory emitting black smoke" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the pollution issue in detail..." 
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include details like when you noticed it and how long it's been occurring.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Pollution Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Air" />
                            </FormControl>
                            <FormLabel className="font-normal">Air Pollution</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Water" />
                            </FormControl>
                            <FormLabel className="font-normal">Water Pollution</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Garbage" />
                            </FormControl>
                            <FormLabel className="font-normal">Garbage Dumping</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Severity Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Low" />
                            </FormControl>
                            <FormLabel className="font-normal">Low</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Medium" />
                            </FormControl>
                            <FormLabel className="font-normal">Medium</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="High" />
                            </FormControl>
                            <FormLabel className="font-normal">High</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Critical" />
                            </FormControl>
                            <FormLabel className="font-normal">Critical</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-3">
                <FormLabel>Location</FormLabel>
                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-md">
                  <MapPin className="h-5 w-5 text-eco-green" />
                  <div>
                    <p className="font-medium">
                      {userLocation?.city || "Location not detected"}
                    </p>
                    {userLocation && (
                      <p className="text-sm text-muted-foreground">
                        Lat: {userLocation.lat.toFixed(6)}, Long: {userLocation.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <FormLabel>Upload Images (Max 3)</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  {/* Image previews */}
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative h-32 rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Upload preview ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  
                  {/* Upload button */}
                  {previewUrls.length < 3 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-md cursor-pointer hover:bg-muted/50">
                      <UploadCloud className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <span className="text-sm text-muted-foreground">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || previewUrls.length === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Pollution Report"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ReportPollution;
