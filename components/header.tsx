"use client";

import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/header/mode-toggle";
import { Stethoscope, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/80 backdrop-blur-md dark:bg-slate-900/80 border-slate-200 dark:border-slate-800"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -20, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Stethoscope className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href="/" className="flex items-center">
                <h1 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  <span className="text-blue-600 dark:text-blue-400">Medi</span>
                  Scan CXR
                </h1>
              </Link>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-8">
                {["Dashboard", "Patients", "Analytics", "Help"].map(
                  (item, i) => (
                    <motion.li
                      key={item}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * i }}
                    >
                      <Link
                        href="#"
                        className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 font-medium transition-colors"
                      >
                        {item}
                      </Link>
                    </motion.li>
                  )
                )}
              </ul>
            </nav>
            <ModeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-4">
                {["Dashboard", "Patients", "Analytics", "Help"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="block py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
