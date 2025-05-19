"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreview: string | null;
}

export function ImageUploader({
  onImageSelect,
  imagePreview,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidImageFile(file)) {
        onImageSelect(file);
        setSelectedImage(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidImageFile(file)) {
        onImageSelect(file);
        setSelectedImage(file);
      }
    }
  };

  const isValidImageFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    return validTypes.includes(file.type);
  };

  const clearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelect(null as unknown as File);
    setSelectedImage(null);
  };

  return (
    <div className="space-y-4">
      {!imagePreview ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 p-4">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
              Upload your X-Ray
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
              Drag and drop your CXR image here, or click to browse files
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
            />
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
              Supported formats: JPG, PNG
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 rounded-xl shadow-md">
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-3 right-3 z-10 rounded-full shadow-md"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="aspect-square relative bg-slate-100 dark:bg-slate-800">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Chest X-Ray Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                {selectedImage?.name || "Chest X-Ray Image"}
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
