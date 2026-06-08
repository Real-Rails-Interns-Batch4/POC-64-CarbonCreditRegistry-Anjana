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
  Gauge,
  HelpCircle,
  FileText,
  Clock
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  registry: string;
  methodology: string;
  status: string;
  country: string;
  latitude: number;
  longitude: number;
  issuances: number;
  retirements: number;
  controller: string;
  label_type: string;
  net_balance: number;
}

export default function Dashboard() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedRegistry, setSelectedRegistry] = useState("All");
  const [selectedMethodology, setSelectedMethodology] = useState("All");
  const [selectedScenario, setSelectedScenario] = useState("Baseline");

  useEffect(() => {
    // Pipeline fetches adapted structural streams directly
    fetch("http://127.0.0.1:8000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setAllProjects(data);
        setFilteredProjects(data);
      })
      .catch((err) => console.error("Pipeline failure connection error:", err));
  }, []);

  // Multi-tier structural filter adapter logic
  const applyFilters = (registry: string, methodology: string) => {
    let output = allProjects;
    if (registry !== "All") {
      output = output.filter((p) => p.registry === registry);
    }
    if (methodology !== "All") {
      output = output.filter((p) => p.methodology === methodology);
    }
    setFilteredProjects(output);
  };

  const uniqueMethodologies = ["All", ...Array.from(new Set(allProjects.map(p => p.methodology)))];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-[#f4f4f5] font-mono overflow-hidden">
      
      {/* HEADER WITH DATA ATTRIBUTION & SYNTHETIC WATERMARK */}
      <header className="flex items-center justify-between px-6 h-16 border-b border-[#1F2937] bg-[#0B1117] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <h1 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
            Carbon Credit Registry Explorer 
            <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/60 px-2 py-0.5 rounded tracking-normal">
              [CRITICAL: SYNTHETIC DATA LABELING]
            </span>
          </h1>
        </div>

        {/* INPUT INTERACTION CONTROL FILTER BAR */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5">Registry Origin</span>
            <select
              value={selectedRegistry}
              onChange={(e) => {
                setSelectedRegistry(e.target.value);
                applyFilters(e.target.value, selectedMethodology);
              }}
              className="bg-[#030712] border border-[#1F2937] text-[11px] px-2 py-1 rounded focus:outline-none text-zinc-300"
            >
              <option value="All">All Origins</option>
              <option value="Verra">Verra (VCS) Data</option>
              <option value="Gold Standard">Gold Standard Data</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5">Methodology Filter</span>
            <select
              value={selectedMethodology}
              onChange={(e) => {
                setSelectedMethodology(e.target.value);
                applyFilters(selectedRegistry, e.target.value);
              }}
              className="bg-[#030712] border border-[#1F2937] text-[11px] px-2 py-1 rounded focus:outline-none text-zinc-300 max-w-[200px] truncate"
            >
              {uniqueMethodologies.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* TWO COLUMN PRODUCTION LAYOUT */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* LEFT COMPONENT STAGE: 70% WIDTH VIEWPORT FRAME */}
        <div className="w-[70%] h-full relative flex flex-col border-r border-[#1F2937]">
          
          {/* MAP VIEWER PORTION */}
          <div className="flex-1 relative w-full bg-[#030712]">
            <MapComponent projects={filteredProjects} />
            
            {/* FLOATING DATA ORIGIN SOURCES SUMMARY ATTRIBUTION BOX */}
            <div className="absolute top-4 left-4 z-10 bg-[#0B1117]/90 border border-[#1F2937] p-2.5 rounded text-[10px] text-zinc-400 backdrop-blur-sm space-y-1">
              <div className="font-bold text-zinc-300 uppercase tracking-wider mb-1">External Ledger References</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#818cf8]" />
                <span>Verra Registry Attribution (VCS Standards Ecosystem)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                <span>Gold Standard Attribution (GS Premium Pipelines)</span>
              </div>
            </div>

            {/* SIMULATION ENGINE TRIGGER */}
            <div className="absolute bottom-4 left-4 z-10 bg-[#0B1117]/90 border border-[#1F2937] p-3 rounded-md max-w-xs backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2">
                <Sliders size={12} className="text-cyan-400" />
                SIMULATION STRESS TESTING MATRIX
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

          {/* LOWER INTERACTIVE REGISTRY GRID TABLE MODULE */}
          <div className="h-48 border-t border-[#1F2937] bg-[#0B1117] p-4 flex flex-col overflow-hidden">
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>Active Registry Table Ledger</span>
              <span className="text-zinc-600 font-normal">Showing {filteredProjects.length} matching data traces</span>
            </div>
            <div className="flex-1 overflow-auto border border-[#1F2937] rounded bg-[#030712]">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-[#0B1117] text-zinc-400 sticky top-0 border-b border-[#1F2937]">
                  <tr>
                    <th className="p-2 font-bold">UID</th>
                    <th className="p-2 font-bold">Project Scope Asset</th>
                    <th className="p-2 font-bold">Registry</th>
                    <th className="p-2 font-bold">Methodology Taxonomy</th>
                    <th className="p-2 font-bold text-right">Issuances</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]/60 text-zinc-300">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-[#0B1117]/50 transition-colors">
                      <td className="p-2 font-bold text-indigo-400">{p.id}</td>
                      <td className="p-2 truncate max-w-[200px]">{p.name}</td>
                      <td className="p-2">{p.registry}</td>
                      <td className="p-2 text-zinc-400 italic text-[10px]">{p.methodology}</td>
                      <td className="p-2 text-right font-bold text-emerald-500">{(p.issuances / 1000000).toFixed(2)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR PANEL: 30% OVERALL WIDTH STAGE */}
        <div className="w-[30%] h-full bg-[#0B1117] flex flex-col overflow-y-auto divide-y divide-[#1F2937]">
          
          {/* TIMELINE & RETIREMENT STATISTICS LAYER */}
          <div className="p-5 space-y-3">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-between">
              <span>Issuance Timeline & Retirement Stats</span>
              <div className="group relative cursor-help">
                <HelpCircle size={12} className="text-zinc-600 hover:text-zinc-400" />
                <span className="absolute right-0 top-4 scale-0 group-hover:scale-100 bg-[#030712] border border-[#1F2937] p-2 rounded text-[9px] text-zinc-300 w-48 z-50 shadow-xl transition-all">
                  Aggregated structural telemetry showing operational transaction statuses across active nodes.
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#030712] border border-[#1F2937] p-2.5 rounded">
                <span className="text-[9px] text-zinc-500 block uppercase">Total Issuances</span>
                <span className="text-base font-bold text-white">4.32M <span className="text-[10px] text-zinc-600 font-normal">t</span></span>
              </div>
              <div className="bg-[#030712] border border-[#1F2937] p-2.5 rounded">
                <span className="text-[9px] text-zinc-500 block uppercase">Total Retirements</span>
                <span className="text-base font-bold text-amber-500">
                  {selectedScenario === "Max Retirement" ? "2.20M" : "1.45M"}<span className="text-[10px] text-zinc-600 font-normal ml-0.5">t</span>
                </span>
              </div>
            </div>

            <div className="bg-[#030712] border border-[#1F2937] p-3 rounded">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 mb-2">
                <Clock size={12} className="text-indigo-400" />
                VINTAGE ISSUANCE TIMELINE VELOCITY
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">2023 - 2024 Vintages:</span>
                  <span className="text-zinc-300">2.80M t Active Flow</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">2025 - 2026 Vintages:</span>
                  <span className="text-indigo-400 font-bold">1.52M t Minting Contract</span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL: WHY THIS MATTERS */}
          <div className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <FileText size={14} className="text-amber-500" />
              Why This Matters
            </div>
            <div className="bg-[#030712] border border-[#1F2937] p-3 rounded text-[10px] text-zinc-400 leading-relaxed space-y-1.5">
              <p>
                Carbon registries represent the cornerstone of environmental finance infrastructure. Without clear auditing vectors, structural vulnerabilities arise, allowing potential double-counting risks to devalue standard mitigation operations.
              </p>
              <p className="border-t border-[#1F2937]/80 pt-1.5 text-zinc-500 italic">
                By validating the alignment of legal protective covenants alongside physical coordinates, this interface ensures complete capital allocation fidelity.
              </p>
            </div>
          </div>

          {/* PANEL: WHO CONTROLS THE RAIL */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <Users size={14} className="text-indigo-400" />
              Who Controls The Rail
            </div>
            <div className="bg-[#030712] border border-[#1F2937] p-3 rounded space-y-2">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider border-b border-[#1F2937] pb-1">
                Primary Asset Controllers
              </div>
              <div className="space-y-1 text-[10px]">
                {filteredProjects.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-zinc-300">
                    <span className="font-bold text-zinc-400">[{p.id}]</span>
                    <span className="truncate max-w-[150px] text-indigo-300">{p.controller}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-zinc-500 leading-normal pt-1 border-t border-[#1F2937]/50">
                Determines the active entity holding backend proxy rights to edit state changes or execute credit cancellations on public ledgers.
              </p>
            </div>
          </div>

          {/* FOUNDER / INVESTOR CONTROL METER */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <Gauge size={14} className="text-purple-400" />
              Founder / Investor Control Meter
            </div>
            <div className="bg-[#030712] border border-[#1F2937] p-4 rounded space-y-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-purple-400">Founder Share: 55%</span>
                <span className="text-amber-400">Investor Share: 45%</span>
              </div>
              <div className="w-full h-2.5 bg-[#1F2937] rounded-full overflow-hidden flex">
                <div className="h-full bg-purple-500" style={{ width: "55%" }} />
                <div className="h-full bg-amber-500" style={{ width: "45%" }} />
              </div>
            </div>
          </div>

          {/* PROTECTIVE RIGHTS CHECKLIST */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <CheckSquare size={14} className="text-emerald-400" />
              Protective Rights Checklist
            </div>
            <div className="bg-[#030712] border border-[#1F2937] p-3 rounded space-y-2.5">
              <div className="flex items-start gap-2 text-[11px]">
                <input type="checkbox" checked readOnly className="mt-0.5 accent-emerald-500" />
                <span className="text-zinc-300">Veto on Asset Sales</span>
              </div>
              <div className="flex items-start gap-2 text-[11px]">
                <input type="checkbox" checked readOnly className="mt-0.5 accent-emerald-500" />
                <span className="text-zinc-300">Anti-Dilution Protections</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}