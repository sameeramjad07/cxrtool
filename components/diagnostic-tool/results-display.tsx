"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Printer,
  FileText,
  Download,
  ChevronRight,
  AlertCircle,
  Calendar,
  User,
  FileCheck,
} from "lucide-react";
import type {
  DiagnosticResult,
  PatientInfo,
} from "@/components/diagnostic-tool";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ResultsDisplayProps {
  results: DiagnosticResult;
  imagePreview: string | null;
  patientInfo: PatientInfo;
}

export function ResultsDisplay({
  results,
  imagePreview,
  patientInfo,
}: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("predictions");

  const handlePrint = () => {
    window.print();
  };

  const getConditionSeverity = (probability: number) => {
    if (probability > 0.7) return "severe";
    if (probability > 0.4) return "moderate";
    return "mild";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "moderate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "mild":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getProgressColor = (probability: number) => {
    if (probability > 0.7) {
      return "bg-red-600 dark:bg-red-500";
    } else if (probability > 0.4) {
      return "bg-amber-500 dark:bg-amber-400";
    } else {
      return "bg-green-500 dark:bg-green-400";
    }
  };

  // Get top 3 conditions by probability
  const topConditions = Object.entries(results.probabilities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
                Diagnostic Results
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                AI-powered analysis of chest X-ray completed on{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                asChild
              >
                <a href={results.reportUrl} download="cxr_report.pdf">
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                Patient Information
              </h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Patient ID
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {patientInfo.patientId || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Age
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {patientInfo.age || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Gender
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {patientInfo.gender
                    ? patientInfo.gender.charAt(0).toUpperCase() +
                      patientInfo.gender.slice(1)
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Date
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              {patientInfo.clinicalNotes && (
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Clinical Notes
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {patientInfo.clinicalNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                Primary Findings
              </h3>
            </div>
            <div className="space-y-4">
              {topConditions.map(([condition, probability], index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {condition}
                      </span>
                      <Badge
                        className={`${getSeverityColor(
                          getConditionSeverity(probability)
                        )} font-normal text-xs`}
                      >
                        {getConditionSeverity(probability)}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {(probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={probability * 100}
                    className={`h-2 bg-slate-200 dark:bg-slate-700 ${getProgressColor(
                      probability
                    )}`}
                  />
                </div>
              ))}

              <div className="pt-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <AlertCircle className="inline-block h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                  These findings should be confirmed by a qualified medical
                  professional.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                X-Ray Image
              </h3>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-xs bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shadow-inner">
                <img
                  src={imagePreview || "/placeholder.svg?height=300&width=300"}
                  alt="Chest X-Ray"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-lg p-1 bg-slate-100 dark:bg-slate-800 mb-6">
            <TabsTrigger
              value="predictions"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
            >
              Detailed Findings
            </TabsTrigger>
            <TabsTrigger
              value="report"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
            >
              Medical Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions">
            <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
                <CardTitle>Complete Diagnostic Findings</CardTitle>
                <CardDescription>
                  Comprehensive analysis of potential thoracic conditions
                  detected in the X-ray
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {Object.entries(results.probabilities).map(
                    ([condition, probability], index) => {
                      const diagnosis = results.diagnoses[condition];
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {condition}
                              </span>
                              <Badge
                                className={`${getSeverityColor(
                                  getConditionSeverity(probability)
                                )} font-normal`}
                              >
                                {getConditionSeverity(probability)}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                {diagnosis ? "Present" : "Absent"}
                              </Badge>
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {(probability * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={probability * 100}
                            className={`h-2 bg-slate-200 dark:bg-slate-700 ${getProgressColor(
                              probability
                            )}`}
                          />
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {probability > 0.7
                              ? "Strong evidence detected in the X-ray image."
                              : probability > 0.4
                              ? "Moderate indicators present in the X-ray image."
                              : "Minimal or uncertain indicators in the X-ray image."}
                          </p>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
                <CardTitle>Comprehensive Diagnostic Report</CardTitle>
                <CardDescription>
                  AI-generated medical report based on the X-ray analysis and
                  detected conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Radiological Findings
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Generated on {new Date().toLocaleDateString()} at{" "}
                          {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        AI-Generated
                      </Badge>
                    </div>
                    {/* Placeholder text since report is now a downloadable PDF */}
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      The detailed report is available for download below. It
                      includes a comprehensive analysis of the X-ray findings.
                    </p>
                  </div>

                  <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-1">
                          Important Disclaimer
                        </h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          This AI-generated report is intended to assist medical
                          professionals and should not replace clinical
                          judgment. All findings should be verified by a
                          qualified radiologist or physician.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                      asChild
                    >
                      <a href={results.reportUrl} download="cxr_report.pdf">
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Report as PDF
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
