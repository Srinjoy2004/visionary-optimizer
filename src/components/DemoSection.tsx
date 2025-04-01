
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const DemoSection: React.FC = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setIsComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const handleReset = () => {
    setUrl("");
    setIsAnalyzing(false);
    setIsComplete(false);
    setProgress(0);
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
            Experience the power of WebVision AI with a live demo. Enter your website URL below to get an instant analysis.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-webvision-darker border border-webvision-blue/20 p-6 rounded-xl shadow-lg">
            {!isComplete ? (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="url"
                    placeholder="Enter your website URL (e.g., https://example.com)"
                    className="flex-1 bg-webvision-dark border-webvision-blue/30 focus:border-webvision-blue focus:ring-webvision-blue/50"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
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
                          Analyze Website <ArrowRight className="ml-2" size={18} />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
                
                {isAnalyzing && (
                  <div className="mt-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">Analyzing website...</span>
                      <span className="text-sm text-webvision-blue">{progress}%</span>
                    </div>
                    <div className="w-full bg-webvision-blue/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-webvision-blue to-webvision-purple h-2 rounded-full transition-all duration-300 animate-pulse" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {["Design", "Performance", "SEO", "Content"].map((item, index) => (
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
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle className="text-green-500" size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Analysis Complete!</h3>
                <p className="text-gray-300 mb-6">
                  We've analyzed {url} and prepared a comprehensive report
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-webvision-blue/10 border border-webvision-blue/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Overall Score</div>
                    <div className="text-3xl font-bold text-webvision-blue">78<span className="text-xl">/100</span></div>
                  </div>
                  <div className="bg-webvision-blue/10 border border-webvision-blue/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Improvement Potential</div>
                    <div className="text-3xl font-bold text-webvision-purple">+23%</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { name: "Design", score: 82 },
                    { name: "Performance", score: 67 },
                    { name: "SEO", score: 75 },
                    { name: "Content", score: 88 }
                  ].map((category) => (
                    <div key={category.name} className="bg-webvision-blue/10 border border-webvision-blue/30 p-4 rounded-lg">
                      <div className="text-xs uppercase text-gray-400 mb-1">{category.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-webvision-blue/20 rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-webvision-blue to-webvision-purple rounded-full" 
                            style={{ width: `${category.score}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-bold">{category.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="neon-button">
                    <span>Get Full Report</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-webvision-blue/50 hover:border-webvision-blue text-white bg-transparent hover:bg-webvision-blue/10"
                    onClick={handleReset}
                  >
                    Analyze Another Website
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
