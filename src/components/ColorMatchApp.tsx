import { useState } from "react";
import { Copy, Palette, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ColorMatch {
  name: string;
  hex: string;
  distance: number;
}

const ColorMatchApp = () => {
  const [hexInput, setHexInput] = useState("#ff0000");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ColorMatch | null>({
    name: "Red",
    hex: "#ff0000",
    distance: 0
  });
  const { toast } = useToast();

  const validateHex = (hex: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
  };

  const formatHex = (hex: string): string => {
    // Remove # and convert to uppercase
    const cleaned = hex.replace("#", "").toUpperCase();
    // If 3 characters, expand to 6
    if (cleaned.length === 3) {
      return "#" + cleaned.split("").map(char => char + char).join("");
    }
    return "#" + cleaned;
  };

  const handleInputChange = (value: string) => {
    let formatted = value;
    if (!value.startsWith("#")) {
      formatted = "#" + value;
    }
    setHexInput(formatted);
  };

  const findNearestColor = async () => {
    if (!validateHex(hexInput)) {
      toast({
        title: "Invalid hex code",
        description: "Please enter a valid hex color code (e.g., #ff0000)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Mock API call - replace with actual Supabase API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - replace with actual API call to Pantone database
      const mockResponse: ColorMatch = {
        name: "PANTONE 18-1763 TPX Red",
        hex: "#C8102E",
        distance: 12.5
      };
      
      setResult(mockResponse);
      toast({
        title: "Color match found!",
        description: `Found nearest Pantone color: ${mockResponse.name}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find nearest color. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${text} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const normalizedInput = formatHex(hexInput);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-medium">
              <Palette className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Color Nearest Match
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter a hex code to find the nearest named Pantone color and compare them visually.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-medium border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Enter Hex Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={hexInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="#ff0000"
                  className="text-lg font-mono border-2 focus:border-primary transition-colors"
                  maxLength={7}
                />
              </div>
              <Button
                onClick={findNearestColor}
                disabled={isLoading}
                className="px-6 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold shadow-medium"
              >
                {isLoading ? "Finding..." : "Find Nearest"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Original Color */}
            <Card className="shadow-color border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Original</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(normalizedInput)}
                    className="h-8 w-8 p-0 hover:bg-secondary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="w-full h-32 rounded-lg border-2 border-color-preview-border shadow-soft"
                  style={{ backgroundColor: normalizedInput }}
                />
                <p className="text-center font-mono text-sm bg-color-preview px-3 py-2 rounded-md border">
                  {normalizedInput}
                </p>
              </CardContent>
            </Card>

            {/* Nearest Color */}
            <Card className="shadow-color border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Nearest</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{result.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.hex)}
                    className="h-8 w-8 p-0 hover:bg-secondary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="w-full h-32 rounded-lg border-2 border-color-preview-border shadow-soft"
                  style={{ backgroundColor: result.hex }}
                />
                <p className="text-center font-mono text-sm bg-color-preview px-3 py-2 rounded-md border">
                  {result.hex}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Distance Score */}
        {result && (
          <Card className="shadow-medium border-0 bg-gradient-to-r from-card to-secondary/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Color Distance Score</p>
                <p className="text-2xl font-bold text-foreground">{result.distance}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Lower scores indicate closer color matches
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Notice */}
        <div className="mt-12 text-center">
          <Card className="border-primary/20 bg-primary/5 shadow-soft">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                💡 This demo uses mock data. Connect to Supabase to access the real Pantone color database.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColorMatchApp;