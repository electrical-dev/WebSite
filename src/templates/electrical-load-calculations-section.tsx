"use client"

import React from "react";
import { useLanguage } from "../hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import { CurrentPowerCalculator } from "../calculators/current-power-calculator";
import { CableSizingCalculator } from "../calculators/cable-sizing-calculator";
import { VoltageDrop } from "../calculators/voltage-drop";
import { ConduitSizing } from "../calculators/conduit-sizing";
import { CableCalculator } from "../calculators/cable-calculator";
import { LoadSchedule } from "../calculators/load-schedule";

// Define the language type
type SupportedLanguage = "en" | "es";

export function ElectricalLoadCalculationsSection() {
  const { language } = useLanguage();

  const content = {
    es: {
      title: "Saca tu Cuadro de Cargas",
    },
    en: {
      title: "Get your Load Schedule",
    }
  };

  return (
    <section id="electrical-tools" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {content[language as SupportedLanguage].title}
        </h2>
        <LoadSchedule language={language as SupportedLanguage} />
      </div>
    </section>
  );
}

