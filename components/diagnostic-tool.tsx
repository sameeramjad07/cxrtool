"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/diagnostic-tool/image-uploader";
import { ResultsDisplay } from "@/components/diagnostic-tool/results-display";
import { PatientInfoForm } from "@/components/diagnostic-tool/patient-info-form";
import {
  Loader2,
  ArrowRight,
  FileImage,
  UserCircle,
  Microscope,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export type DiagnosticResult = {
  predictions: number[];
  inference_time: number;
  probabilities: Record<string, number>;
  diagnoses: Record<string, number>;
  reportUrl: string; // URL for the downloadable PDF report
};

export type PatientInfo = {
  patientId: string;
  age: string;
  gender: string;
  clinicalNotes: string;
};

export function DiagnosticTool() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DiagnosticResult | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    patientId: "",
    age: "",
    gender: "",
    clinicalNotes: "",
  });
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setResults(null);
  };

  const handlePatientInfoChange = (info: PatientInfo) => {
    setPatientInfo(info);
  };

  const runDiagnosis = async () => {
    if (!selectedImage) {
      toast("No image selected");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress while API calls are made
      const simulateProgress = () => {
        const interval = setInterval(() => {
          setAnalysisProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 5;
          });
        }, 100);
        return interval;
      };

      const progressInterval = simulateProgress();

      // Step 1: Call the /predict endpoint
      const formData = new FormData();
      formData.append("file", selectedImage);
      Object.entries(patientInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const predictResponse = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!predictResponse.ok) {
        throw new Error(`Prediction failed: ${predictResponse.statusText}`);
      }

      const predictData = await predictResponse.json();

      // Step 2: Call the /generate-report endpoint with predictions
      const reportResponse = await fetch(
        "http://localhost:8000/generate-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ predictions: predictData.predictions }),
        }
      );

      if (!reportResponse.ok) {
        throw new Error(
          `Report generation failed: ${reportResponse.statusText}`
        );
      }

      const reportBlob = await reportResponse.blob();
      const reportUrl = window.URL.createObjectURL(reportBlob);

      // Combine results
      const diagnosticResults: DiagnosticResult = {
        predictions: predictData.predictions,
        inference_time: predictData.inference_time,
        probabilities: predictData.probabilities,
        diagnoses: predictData.diagnoses,
        reportUrl: reportUrl,
      };

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Wait a moment to show 100% before showing results
      await new Promise((resolve) => setTimeout(resolve, 500));

      setResults(diagnosticResults);
      setActiveTab("results");
      toast("Analysis complete");
    } catch (error) {
      console.error("Error during diagnosis:", error);
      toast("An error occurred during the analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-3">
            AI-Powered Chest X-Ray Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload a chest X-ray image to get instant AI-powered diagnosis and
            detailed medical reports.
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center gap-4 mb-8 rounded-xl p-2 bg-slate-100 dark:bg-slate-800 max-w-xl mx-auto shadow-sm">
            <TabsTrigger
              value="upload"
              className="px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium bg-transparent data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all flex items-center gap-2"
            >
              <FileImage className="h-4 w-4" />
              <span>Upload & Patient Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!results}
              className="px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium bg-transparent data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all flex items-center gap-2"
            >
              <Microscope className="h-4 w-4" />
              <span>Diagnostic Results</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent key="upload" value="upload" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg rounded-xl bg-white dark:bg-slate-900">
                  <div className="p-6 md:p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            <UserCircle className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Patient Information
                          </h2>
                        </div>
                        <PatientInfoForm
                          patientInfo={patientInfo}
                          onChange={handlePatientInfoChange}
                        />
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            <FileImage className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Upload Chest X-Ray
                          </h2>
                        </div>
                        <ImageUploader
                          onImageSelect={handleImageSelect}
                          imagePreview={imagePreview}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center">
                      {isAnalyzing && (
                        <div className="w-full max-w-md mb-4">
                          <Progress value={analysisProgress} className="h-2" />
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 text-center">
                            Analyzing image... {analysisProgress}%
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={runDiagnosis}
                        disabled={!selectedImage || isAnalyzing}
                        className="w-full md:w-auto px-8 py-6 text-base rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        size="lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing X-Ray...
                          </>
                        ) : (
                          <>
                            Run Diagnostic Analysis
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent key="results" value="results" className="mt-0">
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResultsDisplay
                    results={results}
                    imagePreview={imagePreview}
                    patientInfo={patientInfo}
                  />
                </motion.div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
