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
        cableCalculator: "Cálculo de Cableado",
        loadSchedule: "Programa de Carga"
      }
    },
    en: {
      title: "Electrical Engineering Tools",
      tabs: {
        currentPower: "Current/Power",
        cableSizing: "Cable Sizing",
        voltageDrop: "Voltage Drop",
        conduitSizing: "Conduit Sizing",
        cableCalculator: "Cable Calculator",
        loadSchedule: "Load Schedule"
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
          <TabsList className="grid w-full h-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
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
            <TabsTrigger value="load-schedule">
              {content[language as SupportedLanguage].tabs.loadSchedule}
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

          <TabsContent value="load-schedule">
            <LoadSchedule language={language as SupportedLanguage} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

