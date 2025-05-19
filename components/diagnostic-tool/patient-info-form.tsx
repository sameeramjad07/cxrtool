"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PatientInfo } from "@/components/diagnostic-tool";
import { motion } from "framer-motion";

interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  onChange: (info: PatientInfo) => void;
}

export function PatientInfoForm({
  patientInfo,
  onChange,
}: PatientInfoFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...patientInfo,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    onChange({
      ...patientInfo,
      gender: value,
    });
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="space-y-5"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div
        className="grid grid-cols-2 gap-4"
        variants={formItemVariants}
      >
        <div className="space-y-2">
          <Label
            htmlFor="patientId"
            className="text-slate-700 dark:text-slate-300"
          >
            Patient ID
          </Label>
          <Input
            id="patientId"
            name="patientId"
            placeholder="e.g., P12345"
            value={patientInfo.patientId}
            onChange={handleChange}
            className="border-slate-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age
          </Label>
          <Input
            id="age"
            name="age"
            type="number"
            placeholder="e.g., 45"
            value={patientInfo.age}
            onChange={handleChange}
            className="border-slate-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
      </motion.div>

      <motion.div className="space-y-2" variants={formItemVariants}>
        <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300">
          Gender
        </Label>
        <Select value={patientInfo.gender} onValueChange={handleSelectChange}>
          <SelectTrigger
            id="gender"
            className="border-slate-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div className="space-y-2" variants={formItemVariants}>
        <Label
          htmlFor="clinicalNotes"
          className="text-slate-700 dark:text-slate-300"
        >
          Clinical Notes
        </Label>
        <Textarea
          id="clinicalNotes"
          name="clinicalNotes"
          placeholder="Enter relevant clinical information, symptoms, or medical history..."
          value={patientInfo.clinicalNotes}
          onChange={handleChange}
          rows={4}
          className="resize-none border-slate-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </motion.div>
    </motion.div>
  );
}
