
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Loader2, X, Globe, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import RevealOnScroll from "./RevealOnScroll";

const DemoSection: React.FC = () => {
  const [urls, setUrls] = useState(["", "", ""]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFullReport, setShowFullReport] = useState(false);
  const [compareResults, setCompareResults] = useState<any>(null);
  const { toast } = useToast();

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const validateUrls = () => {
    // Check if at least two URLs are provided
    const filledUrls = urls.filter(url => url.trim() !== "");
    if (filledUrls.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least two URLs for comparison",
        variant: "destructive",
      });
      return false;
    }
    
    // Basic check if domains match
    try {
      const domains = filledUrls.map(url => {
        const urlObj = new URL(url);
        return urlObj.hostname;
      });
      
      const uniqueDomains = new Set(domains);
      if (uniqueDomains.size > 1) {
        toast({
          title: "Warning",
          description: "For best results, compare websites from the same domain",
        });
      }
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Please enter valid URLs (e.g., https://example.com)",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrls()) return;

    setIsAnalyzing(true);
    setProgress(0);
    setShowFullReport(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setIsComplete(true);
          
          // Generate comparison data
          generateComparisonResults();
          
          return 100;
        }
        return prev + 5;
      });
    }, 250);
  };

  const generateComparisonResults = () => {
    // Generate mock comparison data for the demo
    const categories = ["Design", "Performance", "SEO", "Content"];
    const elements = ["Header", "Navigation", "Images", "Typography", "Color Scheme"];
    
    const siteScores = urls.map((url, idx) => {
      if (!url) return null;
      
      return {
        url,
        overallScore: Math.floor(65 + Math.random() * 25),
        categoryScores: categories.map(cat => ({
          name: cat,
          score: Math.floor(60 + Math.random() * 30)
        })),
        elementRankings: elements.map(elem => ({
          name: elem,
          score: Math.floor(60 + Math.random() * 30)
        }))
      };
    }).filter(Boolean);
    
    // Calculate best elements from each site
    const bestElements = elements.map(element => {
      const scores = siteScores.map((site, idx) => ({
        siteIndex: idx,
        url: site.url,
        score: site.elementRankings.find(e => e.name === element)?.score || 0
      }));
      
      scores.sort((a, b) => b.score - a.score);
      
      return {
        element,
        bestSite: scores[0]
      };
    });
    
    setCompareResults({
      siteScores,
      bestElements
    });
  };

  const handleReset = () => {
    setUrls(["", "", ""]);
    setIsAnalyzing(false);
    setIsComplete(false);
    setProgress(0);
    setShowFullReport(false);
    setCompareResults(null);
  };

  const handleGetFullReport = () => {
    setShowFullReport(true);
    toast({
      title: "Full Comparison Report Generated",
      description: "Your comprehensive website comparison analysis is ready!",
      duration: 3000,
    });
  };

  return (
    <section id="demo" className="py-20 bg-webvision-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-webvision-blue/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-webvision-blue to-webvision-purple text-transparent bg-clip-text">
              Try It Now
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Experience the power of WebVision AI with a live demo. Enter multiple website URLs below to compare and get the best elements from each.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-webvision-darker border border-webvision-blue/20 p-6 rounded-xl shadow-lg">
            {!isComplete ? (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 mb-4">
                  {urls.map((url, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-2 items-center">
                      <span className="text-webvision-blue font-semibold w-20 text-center md:text-right">
                        Site {index + 1}:
                      </span>
                      <Input
                        type="url"
                        placeholder={`Enter website URL ${index + 1} (e.g., https://example.com)`}
                        className="flex-1 bg-webvision-dark border-webvision-blue/30 focus:border-webvision-blue focus:ring-webvision-blue/50"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    type="submit" 
                    className="neon-button whitespace-nowrap"
                    disabled={isAnalyzing}
                  >
                    <span className="flex items-center">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={18} />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Compare Websites <ArrowRight className="ml-2" size={18} />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
                
                {isAnalyzing && (
                  <div className="mt-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">Analyzing websites...</span>
                      <span className="text-sm text-webvision-blue">{progress}%</span>
                    </div>
                    <div className="w-full bg-webvision-blue/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-webvision-blue to-webvision-purple h-2 rounded-full transition-all duration-300 animate-pulse" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {["Comparing Designs", "Analyzing Performance", "Evaluating Content", "Ranking Elements"].map((item, index) => (
                        <div 
                          key={item} 
                          className={`p-4 rounded-lg bg-webvision-blue/10 border border-webvision-blue/30 
                                     ${progress > index * 25 ? "animate-pulse" : ""}`}
                        >
                          <div className="text-xs uppercase text-gray-400 mb-1">{item}</div>
                          <div className="h-2 bg-webvision-blue/20 rounded-full w-full">
                            {progress > index * 25 && (
                              <div 
                                className="h-2 bg-gradient-to-r from-webvision-blue to-webvision-purple rounded-full transition-all duration-1000" 
                                style={{ 
                                  width: `${Math.min(100, Math.max(0, (progress - index * 25) * 4))}%`
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div>
                {!showFullReport && compareResults ? (
                  <>
                    <div className="flex items-center justify-center mb-6">
                      <CheckCircle className="text-green-500" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-center">Analysis Complete!</h3>
                    <p className="text-gray-300 mb-6 text-center">
                      We've compared the websites and prepared a comprehensive report
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {compareResults.siteScores.map((site: any, idx: number) => (
                        <div key={idx} className="bg-webvision-blue/10 border border-webvision-blue/30 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe size={16} className="text-webvision-blue" />
                            <div className="text-sm text-gray-400 truncate">{new URL(site.url).hostname}</div>
                          </div>
                          <div className="text-3xl font-bold text-webvision-blue">
                            {site.overallScore}<span className="text-xl">/100</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-webvision-blue/5 border border-webvision-blue/20 p-4 rounded-lg mb-8">
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <Award size={18} className="text-webvision-purple mr-2" />
                        Best Elements From Each Site
                      </h4>
                      
                      <div className="space-y-3">
                        {compareResults.bestElements.slice(0, 5).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-webvision-blue/10 rounded-lg">
                            <span className="font-medium">{item.element}</span>
                            <span className="text-sm text-gray-300">
                              Best from: <span className="text-webvision-blue font-semibold">{new URL(item.bestSite.url).hostname}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        className="neon-button"
                        onClick={handleGetFullReport}
                      >
                        <span>Get Full Report</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-webvision-blue/50 hover:border-webvision-blue text-white bg-transparent hover:bg-webvision-blue/10"
                        onClick={handleReset}
                      >
                        Compare Other Websites
                      </Button>
                    </div>
                  </>
                ) : (
                  <RevealOnScroll>
                    <div className="pb-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Detailed Comparison Report</h3>
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowFullReport(false)}
                          className="hover:bg-webvision-blue/10"
                        >
                          <X size={20} />
                        </Button>
                      </div>
                      
                      <div className="mb-8">
                        <h4 className="text-xl font-semibold mb-4 flex items-center">
                          <Award className="mr-2 text-webvision-purple" size={20} />
                          Ultimate Website Recommendations
                        </h4>
                        
                        <div className="p-4 bg-webvision-blue/10 rounded-lg mb-6 border border-webvision-purple/30">
                          <p className="text-gray-300 mb-4">
                            Based on our analysis, here's how you should combine elements from each site for the best results:
                          </p>
                          
                          <div className="space-y-4">
                            {compareResults.bestElements.map((item: any, idx: number) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <div className="font-semibold text-webvision-blue w-32">{item.element}:</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-300">Take from </span>
                                  <span className="px-2 py-1 bg-webvision-blue/20 rounded-md text-white">
                                    {new URL(item.bestSite.url).hostname}
                                  </span>
                                  <span className="text-gray-300">(Score: {item.bestSite.score})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {compareResults.siteScores.map((site: any, siteIdx: number) => (
                          <div key={siteIdx} className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                              <Globe size={18} className="text-webvision-blue" />
                              <h4 className="text-lg font-semibold">{new URL(site.url).hostname}</h4>
                              <span className="ml-auto text-webvision-blue font-bold">{site.overallScore}/100</span>
                            </div>
                            
                            <div className="space-y-3">
                              {site.categoryScores.map((cat: any, catIdx: number) => (
                                <RevealOnScroll key={catIdx} threshold={0.1} delay={catIdx * 100}>
                                  <div className="p-3 bg-webvision-blue/5 border border-webvision-blue/20 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium">{cat.name}</span>
                                      <span className={`${cat.score >= 80 ? 'text-green-500' : cat.score >= 70 ? 'text-yellow-500' : 'text-red-500'} font-bold`}>
                                        {cat.score}/100
                                      </span>
                                    </div>
                                    <div className="h-1.5 bg-webvision-blue/20 rounded-full">
                                      <div 
                                        className="h-1.5 bg-gradient-to-r from-webvision-blue to-webvision-purple rounded-full" 
                                        style={{ width: `${cat.score}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </RevealOnScroll>
                              ))}
                            </div>
                            
                            <div className="mt-4 p-3 bg-webvision-blue/10 border border-webvision-blue/30 rounded-lg">
                              <h5 className="text-sm font-semibold mb-2">Strong Elements:</h5>
                              <div className="flex flex-wrap gap-2">
                                {site.elementRankings
                                  .filter((el: any) => el.score >= 75)
                                  .map((el: any, elIdx: number) => (
                                    <span 
                                      key={elIdx} 
                                      className="px-2 py-0.5 bg-webvision-blue/20 rounded-md text-sm">
                                      {el.name}
                                    </span>
                                  ))
                                }
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-webvision-blue/10 border border-webvision-blue/30 rounded-lg">
                        <h4 className="text-lg font-semibold mb-3">Implementation Plan</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                          <li>Copy the header structure from {compareResults.bestElements[0].bestSite ? new URL(compareResults.bestElements[0].bestSite.url).hostname : "Site 1"}</li>
                          <li>Implement the navigation menu from {compareResults.bestElements[1].bestSite ? new URL(compareResults.bestElements[1].bestSite.url).hostname : "Site 2"}</li>
                          <li>Use the image style and quality from {compareResults.bestElements[2].bestSite ? new URL(compareResults.bestElements[2].bestSite.url).hostname : "Site 3"}</li>
                          <li>Adopt the typography from {compareResults.bestElements[3].bestSite ? new URL(compareResults.bestElements[3].bestSite.url).hostname : "Site 1"}</li>
                          <li>Implement the color scheme from {compareResults.bestElements[4].bestSite ? new URL(compareResults.bestElements[4].bestSite.url).hostname : "Site 2"}</li>
                        </ol>
                      </div>
                      
                      <div className="flex justify-between mt-8">
                        <Button 
                          variant="outline" 
                          className="border-webvision-blue/50 hover:border-webvision-blue text-white bg-transparent hover:bg-webvision-blue/10"
                          onClick={() => setShowFullReport(false)}
                        >
                          Back to Summary
                        </Button>
                        
                        <Button 
                          className="neon-button"
                          onClick={() => {
                            toast({
                              title: "Comparison Report Downloaded",
                              description: "Your full comparison report has been downloaded as PDF.",
                              duration: 3000,
                            });
                          }}
                        >
                          Download PDF Report
                        </Button>
                      </div>
                    </div>
                  </RevealOnScroll>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
