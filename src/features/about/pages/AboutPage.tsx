"use client";

import { AboutHero } from "../components/AboutHero";
import { AboutStats } from "../components/AboutStats";
import { AboutHistory } from "../components/AboutHistory";
import { AboutVisionMission } from "../components/AboutVisionMission";
import { AboutValues } from "../components/AboutValues";

export const AboutPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <AboutHero />
            <AboutStats />
            <AboutHistory />
            <AboutVisionMission />
            <AboutValues />
        </div>
    );
};
