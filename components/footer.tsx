import { Stethoscope, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                <span className="text-blue-600 dark:text-blue-400">Medi</span>
                Scan CXR
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Advanced AI-powered diagnostic tool for medical practitioners to
              analyze chest X-rays with precision and confidence.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {["Dashboard", "Upload", "Patients", "Analytics"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Documentation",
                "API Reference",
                "Model Information",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              {["Help Center", "Contact Us", "Feedback", "System Status"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            &copy; {new Date().getFullYear()} MediScan CXR. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0 text-sm text-slate-600 dark:text-slate-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500" />
            <span>for healthcare professionals</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
