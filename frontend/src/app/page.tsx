"use client";

import React, { useState, useEffect } from "react";
import MapComponent from "@/components/MapComponent";
import { 
  Shield, 
  Layers, 
  Sliders, 
  Download, 
  Users, 
  CheckSquare, 
  GitCompare, 
  Gauge 
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  registry: string;
  status: string;
  country: string;
  latitude: number;
  longitude: number;
  issuances: number;
  retirements: number;
}

export default function Dashboard() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedRegistry, setSelectedRegistry] = useState("All");
  const [selectedScenario, setSelectedScenario] = useState("Baseline");

  useEffect(() => {
    // Fetch data from our FastAPI backend pipeline
    fetch("http://127.0.0.1:8000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setAllProjects(data);
        setFilteredProjects(data);
      })
      .catch((err) => print("Error streaming backend records:", err));
  }, []);

  const handleRegistryChange = (registry: string) => {
    setSelectedRegistry(registry);
    if (registry === "All") {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(allProjects.filter((p) => p.registry === registry));
    }
  };

  // Build dynamic CSV package download based on state variables
  const downloadCSV = () => {
    const headers = ["ID,Name,Registry,Status,Country,Latitude,Longitude\n"];
    const rows = filteredProjects.map(
      (p) => `${p.id},"${p.name}",${p.registry},${p.status},${p.country},${p.latitude},${p.longitude}`
    );
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `carbon_registry_${selectedRegistry.toLowerCase()}_ledger.csv`);
    a.click();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-[#f4f4f5] font-mono overflow-hidden">
      
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between px-6 h-16 border-b border-[#1F2937] bg-[#0B1117] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-sm font-bold tracking-wider uppercase">
            Carbon Credit Registry Explorer <span className="text-xs text-zinc-500 font-normal ml-2">POC-64</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedRegistry}
            onChange={(e) => handleRegistryChange(e.target.value)}
            className="bg-[#030712] border border-[#1F2937] text-xs px-3 py-1.5 rounded focus:outline-none focus:border-indigo-500 text-zinc-300"
          >
            <option value="All">All Registries</option>
            <option value="Verra">Verra (VCS)</option>
            <option value="Gold Standard">Gold Standard</option>
          </select>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/80 text-xs px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            <Download size={14} />
            Download Sample Data
          </button>
        </div>
      </header>

      {/* CORE TWO-COLUMN split STAGE */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* LEFT COLUMN: MAIN MAP VIEWPORT STAGE (70% WIDTH) */}
        <div className="w-[70%] h-full relative border-r border-[#1F2937]">
          <MapComponent projects={filteredProjects} />
          
          {/* Quick Floating Scenario Switcher Matrix on Map Stage */}
          <div className="absolute bottom-4 left-4 z-10 bg-[#0B1117]/90 border border-[#1F2937] p-3 rounded-md max-w-xs backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2">
              <Sliders size={12} className="text-cyan-400" />
              MAP SIMULATION MATRIX
            </div>
            <div className="flex gap-2">
              {["Baseline", "Stress Test", "Max Retirement"].map((scenario) => (
                <button
                  key={scenario}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`text-[10px] px-2 py-1 rounded transition-all cursor-pointer ${
                    selectedScenario === scenario 
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50" 
                      : "bg-[#030712] text-zinc-500 border border-transparent hover:border-zinc-800"
                  }`}
                >
                  {scenario}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GOVERNANCE & INTELLIGENCE SIDEBAR (30% WIDTH) */}
        <div className="w-[30%] h-full bg-[#0B1117] flex flex-col overflow-y-auto divide-y divide-[#1F2937]">
          
          {/* PANEL 1: HIGHEST LEVEL LIVE LEDGER TRACKING METRICS */}
          <div className="p-5">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Live Ledger Pipeline</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#030712] border border-[#1F2937] p-3 rounded">
                <div className="text-[10px] text-zinc-400 mb-1">Active Nodes</div>
                <div className="text-xl font-bold text-white">{filteredProjects.length}</div>
              </div>
              <div className="bg-[#030712] border border-[#1F2937] p-3 rounded">
                <div className="text-[10px] text-zinc-400 mb-1">Total Volume</div>
                <div className="text-xl font-bold text-emerald-400">
                  {selectedScenario === "Max Retirement" ? "2.1M" : "4.3M"}<span className="text-xs text-zinc-500 font-normal ml-0.5">t</span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 2: FOUNDER / INVESTOR CONTROL METER */}
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">
              <Gauge size={14} className="text-purple-400" />
              Founder / Investor Control Meter
            </div>
            <div className="bg-[#030712] border border-[#1F2937] p-4 rounded space-y-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-purple-400">Founder Control: 55%</span>
                <span className="text-amber-400">Investor Control: 45%</span>
              </div>
              <div className="w-full h-2.5 bg-[#1F2937] rounded-full overflow-hidden flex">
                <div className="h-full bg-purple-500" style={{ width: "55%" }} />
                <div className="h-full bg-amber-500" style={{ width: "45%" }} />
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Voting balance snapshot dictates capital allocation priorities. A 55% threshold retains founder veto alignment over project development trajectories.
              </p>
            </div>
          </div>

          {/* PANEL 3: BOARD SEAT MAP MATRIX */}
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">
              <Users size={14} className="text-indigo-400" />
              Board Seat Allocation Map
            </div>
            <div className="bg-[#030712] border border-[#1F2937] p-3 rounded space-y-2">
              <div className="grid grid-cols-5 gap-1.5">
                {["F1", "F2", "F3", "I1", "I2"].map((seat, i) => (
                  <div 
                    key={seat}
                    className={`p-2 rounded text-center text-[10px] font-bold border ${
                      i < 3 
                        ? "bg-purple-950/40 text-purple-300 border-purple-800/60" 
                        : "bg-amber-950/40 text-amber-300 border-amber-800/60"
                    }`}
                  >
                    {seat}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-zinc-500 pt-1">
                <span>F1-F3: Founder Nominees</span>
                <span>I1-I2: Investor Appointees</span>
              </div>
            </div>
          </div>

          {/* PANEL 4: PROTECTIVE RIGHTS CHECKLIST */}
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">
              <CheckSquare size={14} className="text-emerald-400" />
              Protective Rights Checklist
            </div>
            <div className="bg-[#030712] border border-[#1F2937] p-3 rounded space-y-2.5">
              <div className="flex items-start gap-2 text-[11px]">
                <input type="checkbox" checked readOnly className="mt-0.5 accent-emerald-500" />
                <span className="text-zinc-300">Veto on Asset Liquidation / Sales</span>
              </div>
              <div className="flex items-start gap-2 text-[11px]">
                <input type="checkbox" checked readOnly className="mt-0.5 accent-emerald-500" />
                <span className="text-zinc-300">Anti-Dilution Issuance Adjustments</span>
              </div>
              <div className="flex items-start gap-2 text-[11px]">
                <input type="checkbox" checked readOnly className="mt-0.5 accent-emerald-500" />
                <span className="text-zinc-300">Registry Transfer Consent Clauses</span>
              </div>
            </div>
          </div>

          {/* PANEL 5: SCENARIO COMPARE ENGINE */}
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">
              <GitCompare size={14} className="text-cyan-400" />
              Scenario Compare Engine
            </div>
            <div className="bg-[#030712] border border-[#1F2937] p-3 rounded space-y-2">
              <div className="flex justify-between text-[11px] border-b border-[#1F2937] pb-1.5">
                <span className="text-zinc-400">Current Model:</span>
                <span className="text-cyan-400 font-bold">{selectedScenario}</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Risk Profile:</span>
                  <span className={selectedScenario === "Stress Test" ? "text-amber-400" : "text-emerald-400"}>
                    {selectedScenario === "Stress Test" ? "Elevated Veto Risk" : "Stable Matrix"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Supply Pipeline:</span>
                  <span className="text-zinc-300">
                    {selectedScenario === "Baseline" ? "100% Flow Rate" : selectedScenario === "Stress Test" ? "45% Collateralized" : "Max Liquidation"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 6: INDEXED NODES FEED */}
          <div className="p-5">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Indexed Nodes</div>
            <div className="space-y-2">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-[#030712] border border-[#1F2937] p-2.5 rounded text-xs hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-indigo-400">[{project.id}]</span>
                    <span className="text-[10px] text-zinc-500">{project.country}</span>
                  </div>
                  <div className="text-zinc-300 text-[11px] truncate">{project.name}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}