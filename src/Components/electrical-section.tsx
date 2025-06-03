"use client"

import React from "react";
import { useLanguage } from "../hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CurrentPowerCalculator } from "./current-power-calculator";
import { CableSizingCalculator } from "./cable-sizing-calculator";
import { VoltageDrop } from "./voltage-drop";
import { ConduitSizing } from "./conduit-sizing";
import { CableCalculator } from "./cable-calculator";

// Define the language type
type SupportedLanguage = "en" | "es";

export function ElectricalSection() {
  const { language } = useLanguage();

  const content = {
    es: {
      title: "Herramientas de Ingeniería Eléctrica",
      tabs: {
        currentPower: "Corriente/Potencia",
        cableSizing: "Dimensionamiento de Cable",
        voltageDrop: "Caída de Tensión",
        conduitSizing: "Dimensionamiento de Ducteria",
        cableCalculator: "Cálculo de Cableado"
      }
    },
    en: {
      title: "Electrical Engineering Tools",
      tabs: {
        currentPower: "Current/Power",
        cableSizing: "Cable Sizing",
        voltageDrop: "Voltage Drop",
        conduitSizing: "Conduit Sizing",
        cableCalculator: "Cable Calculator"
      }
    }
  };

  return (
    <section id="electrical-tools" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {content[language as SupportedLanguage].title}
        </h2>

        <Tabs defaultValue="current-power">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="current-power">
              {content[language as SupportedLanguage].tabs.currentPower}
            </TabsTrigger>
            <TabsTrigger value="cable-sizing">
              {content[language as SupportedLanguage].tabs.cableSizing}
            </TabsTrigger>
            <TabsTrigger value="voltage-drop">
              {content[language as SupportedLanguage].tabs.voltageDrop}
            </TabsTrigger>
            <TabsTrigger value="conduit-sizing">
              {content[language as SupportedLanguage].tabs.conduitSizing}
            </TabsTrigger>
            <TabsTrigger value="cable-calculator">
              {content[language as SupportedLanguage].tabs.cableCalculator}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current-power">
            <CurrentPowerCalculator language={language as SupportedLanguage} />
          </TabsContent>

          <TabsContent value="cable-sizing">
            <CableSizingCalculator language={language as SupportedLanguage} />
          </TabsContent>

          <TabsContent value="voltage-drop">
            <VoltageDrop language={language as SupportedLanguage} />
          </TabsContent>

          <TabsContent value="conduit-sizing">
            <ConduitSizing language={language as SupportedLanguage} />
          </TabsContent>

          <TabsContent value="cable-calculator">
            <CableCalculator language={language as SupportedLanguage} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

