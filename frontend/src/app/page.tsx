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
  Clock,
  Info,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Synchronized cleanly with your actual real-world projects.json dataset schema
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
}

export default function Dashboard() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedRegistry, setSelectedRegistry] = useState("All");
  const [selectedMethodology, setSelectedMethodology] = useState("All");
  const [selectedScenario, setSelectedScenario] = useState("Baseline");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
    const apiUrl = apiBase.endsWith("/api") ? `${apiBase}/projects` : `${apiBase}/api/projects`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data: Project[]) => {
        setAllProjects(data);
        setFilteredProjects(data);
      })
      .catch((err) => console.error("Pipeline failure connection error:", err));
  }, []);

  const handleDownloadCSV = () => {
    if (filteredProjects.length === 0) return;
    
    // Header Row matching our data interface
    const headers = ["id", "name", "registry", "methodology", "status", "country", "latitude", "longitude", "issuances", "retirements", "controller"];
    
    // Transform rows correctly, escaping strings with commas or quotes
    const csvRows = [
      headers.join(","),
      ...filteredProjects.map((p) => {
        return headers.map((header) => {
          const value = p[header as keyof Project];
          if (value === undefined || value === null) {
            return '""';
          }
          const stringValue = String(value);
          if (stringValue.includes('"') || stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes("\r")) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(",");
      })
    ];
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `carbon_registry_projects.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  // Dynamically calculate production metrics across all three scenario matrices
  const totalIssuances = filteredProjects.reduce((sum, p) => sum + (p.issuances || 0), 0);

  const totalRetirements = filteredProjects.reduce((sum, p) => {
    const baseRetirement = p.retirements || 0;
    
    if (selectedScenario === "Max Retirement") {
      // Max Retirement Vector: Simulates 50% liquidation spike capped at absolute issuance ceilings
      return sum + Math.min(p.issuances, baseRetirement * 1.5);
    } 
    else if (selectedScenario === "Stress Test") {
      // Stress Test Vector: Simulates 25% intermediate compliance market pressure surge
      return sum + Math.min(p.issuances, baseRetirement * 1.25);
    }
    
    // Baseline Vector: Returns real un-modified public ledger records
    return sum + baseRetirement;
  }, 0);

  return (
    <div className="relative h-screen w-screen bg-[#080c0a] text-[#f4f5f4] font-mono overflow-hidden">
      
      {/* MINIMALIST TRANSPARENT HEADER BAR */}
      <header className="absolute top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-gradient-to-b from-[#080c0a]/90 via-[#080c0a]/50 to-transparent backdrop-blur-md border-b border-[#1c2c22]/50 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#05ffb0] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] text-[#05ffb0] font-bold tracking-widest uppercase">
              Infocreon Internship
            </span>
            <h1 className="text-xs md:text-sm font-bold tracking-wider uppercase flex items-center gap-2">
              Carbon Registry Explorer 
              <span className="text-[9px] bg-emerald-950/40 text-[#05ffb0] border border-[#1c2c22] px-2 py-0.5 rounded tracking-normal hidden sm:inline-block">
                [ENERGY RAIL DNA ACTIVE]
              </span>
            </h1>
          </div>
        </div>

        {/* INPUT INTERACTION CONTROL FILTER HUD (HEADER INTEGRATED) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#0f1814]/80 border border-[#1c2c22] px-3 py-1 rounded-md backdrop-blur-md shadow-lg">
            <div className="flex flex-col">
              <span className="text-[8px] text-emerald-500 font-bold uppercase mb-0.5">Registry</span>
              <select
                value={selectedRegistry}
                onChange={(e) => {
                  setSelectedRegistry(e.target.value);
                  applyFilters(e.target.value, selectedMethodology);
                }}
                className="bg-transparent text-[10px] outline-none text-zinc-300 cursor-pointer font-bold border-none p-0 focus:ring-0"
              >
                <option value="All" className="bg-[#0f1814] text-zinc-300">All Origins</option>
                <option value="Verra Registry" className="bg-[#0f1814] text-zinc-300">Verra Registry</option>
                <option value="Gold Standard Registry" className="bg-[#0f1814] text-zinc-300">Gold Standard</option>
              </select>
            </div>

            <div className="h-6 w-px bg-[#1c2c22]" />

            <div className="flex flex-col">
              <span className="text-[8px] text-emerald-500 font-bold uppercase mb-0.5">Methodology</span>
              <select
                value={selectedMethodology}
                onChange={(e) => {
                  setSelectedMethodology(e.target.value);
                  applyFilters(selectedRegistry, e.target.value);
                }}
                className="bg-transparent text-[10px] outline-none text-zinc-300 cursor-pointer font-bold border-none p-0 focus:ring-0 max-w-[120px] md:max-w-[200px] truncate"
              >
                {uniqueMethodologies.map((m) => (
                  <option key={m} value={m} className="bg-[#0f1814] text-zinc-300">{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* DEVELOPER SIGNATURE (i) BUTTON */}
          <button 
            type="button"
            onClick={() => setIsInfoModalOpen(!isInfoModalOpen)}
            className={`p-2 rounded-full border transition-all duration-200 cursor-pointer ${isInfoModalOpen ? "bg-[#10b981]/20 text-[#05ffb0] border-[#10b981]" : "bg-[#0f1814]/80 border-[#1c2c22] text-zinc-400 hover:text-[#05ffb0]"}`}
            aria-label="Developer Signature"
          >
            <Info size={16} />
          </button>
        </div>
      </header>

      {/* DEVELOPER SIGNATURE METADATA MODAL POPOVER */}
      {isInfoModalOpen && (
        <div className="absolute top-20 right-6 w-80 bg-[#0f1814]/95 border border-[#1c2c22] p-5 rounded-lg shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-[#1c2c22] pb-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#05ffb0] uppercase tracking-wider">
              <Shield size={14} />
              System Architect
            </div>
            <button 
              type="button" 
              onClick={() => setIsInfoModalOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          
          <div className="space-y-2.5 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">Architect:</span>
              <span className="text-[#f4f5f4] font-bold">Anjana KS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">POC ID:</span>
              <span className="text-emerald-400 font-bold">POC-64</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">GitHub:</span>
              <span className="text-[#05ffb0] font-bold">
                <a href="https://github.com/anjanaks22" target="_blank" rel="noreferrer" className="hover:underline">
                  anjanaks22
                </a>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Batch:</span>
              <span className="text-zinc-300">Batch 4 Interns</span>
            </div>
            <div className="border-t border-[#1c2c22]/50 pt-2 mt-2">
              <div className="text-zinc-500 mb-1">Architecture Stack:</div>
              <div className="flex flex-wrap gap-1 text-[9px]">
                {["Next.js", "FastAPI", "Tailwind CSS", "MapLibre GL"].map((tech) => (
                  <span key={tech} className="bg-[#1c2c22] text-[#05ffb0] px-1.5 py-0.5 rounded border border-[#1c2c22]/30">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAP COMPONENT 100% LAYOUT STAGE */}
      <div className="absolute inset-0 w-full h-full z-0 bg-[#080c0a]">
        <MapComponent projects={filteredProjects} onProjectSelect={setSelectedProject} />
      </div>

      {/* FLOATING SIMULATION ENGINE CONTROL BOX */}
      <div className="absolute top-20 left-6 z-10 bg-[#0f1814]/90 border border-[#1c2c22] p-3 rounded-lg shadow-xl backdrop-blur-md max-w-[260px] hidden sm:block">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 mb-2 tracking-wider">
          <Sliders size={12} className="text-[#05ffb0]" />
          SIMULATION STRESS TESTING MATRIX
        </div>
        <div className="flex flex-col gap-1.5">
          {["Baseline", "Stress Test", "Max Retirement"].map((scenario) => (
            <button
              key={scenario}
              type="button"
              onClick={() => {
                setSelectedScenario(scenario);
                console.log(`Switched simulation vector to: ${scenario}`);
              }}
              className={`text-[10px] px-2.5 py-1.5 rounded transition-all cursor-pointer font-mono font-bold text-left border ${
                selectedScenario === scenario 
                  ? "bg-[#10b981]/20 text-[#05ffb0] border-[#10b981]/50" 
                  : "bg-transparent text-zinc-400 border-transparent hover:border-[#1c2c22] hover:bg-[#1c2c22]/20 hover:text-zinc-200"
              }`}
            >
              <span className="block text-[9px] uppercase font-bold">{scenario}</span>
              <span className="block text-[8px] font-normal text-zinc-500 leading-normal mt-0.5">
                {scenario === "Baseline" && "Original public ledger records"}
                {scenario === "Stress Test" && "25% compliance pressure"}
                {scenario === "Max Retirement" && "50% liquidation spike vectors"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FLOATING DATA ORIGIN SOURCES SUMMARY ATTRIBUTION BOX */}
      <div className="absolute top-[350px] left-6 z-10 bg-[#0f1814]/90 border border-[#1c2c22] p-3 rounded-lg text-[9px] text-zinc-400 backdrop-blur-md space-y-1 shadow-lg max-w-[260px] hidden md:block">
        <div className="font-bold text-zinc-300 uppercase tracking-wider mb-1.5 border-b border-[#1c2c22]/50 pb-1">Ledger References</div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>Verra Registry (VCS Standards)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#eaff00]" />
          <span>Gold Standard (Premium pipelines)</span>
        </div>
      </div>

      {/* BOTTOM HUD PANEL: COLLAPSIBLE ACTIVE REGISTRY TABLE */}
      <div className="absolute bottom-6 left-6 right-6 md:right-[400px] z-20 bg-[#0f1814]/90 border border-[#1c2c22] rounded-lg shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
        <div 
          className="px-4 py-2.5 bg-[#0f1814]/40 border-b border-[#1c2c22] flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsTableExpanded(!isTableExpanded)}
        >
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            <span>Active Registry Table Ledger</span>
            <span className="text-[9px] bg-[#1c2c22] text-[#05ffb0] px-1.5 py-0.5 rounded font-mono font-normal">
              {filteredProjects.length} matching data traces
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadCSV();
              }}
              className="flex items-center gap-1.5 bg-[#10b981]/25 hover:bg-[#10b981]/40 border border-[#10b981]/50 text-[#05ffb0] text-[9px] px-2.5 py-1 rounded cursor-pointer transition-all font-mono font-bold uppercase tracking-wider"
            >
              <Download size={10} />
              Download CSV
            </button>
            <div className="text-zinc-500 hover:text-zinc-300">
              {isTableExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
          </div>
        </div>

        {isTableExpanded && (
          <div className="h-40 overflow-auto bg-[#080c0a]/50">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-[#0f1814]/90 text-zinc-400 sticky top-0 border-b border-[#1c2c22]">
                <tr>
                  <th className="p-2 font-bold pl-4">UID</th>
                  <th className="p-2 font-bold">Project Scope Asset</th>
                  <th className="p-2 font-bold">Registry</th>
                  <th className="p-2 font-bold">Methodology Taxonomy</th>
                  <th className="p-2 font-bold text-right pr-4">Issuances</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2c22]/50 text-zinc-300">
                {filteredProjects.map((p) => (
                  <tr 
                    key={p.id} 
                    onClick={() => {
                      setSelectedProject(p);
                    }}
                    className={`hover:bg-[#1c2c22]/40 transition-colors cursor-pointer ${selectedProject?.id === p.id ? "bg-[#1c2c22]/60" : ""}`}
                  >
                    <td className="p-2 pl-4 font-bold text-[#05ffb0]">{p.id}</td>
                    <td className="p-2 truncate max-w-[180px] md:max-w-[240px] font-bold text-white">{p.name}</td>
                    <td className="p-2 text-zinc-400">{p.registry}</td>
                    <td className="p-2 text-zinc-500 italic text-[10px]">{p.methodology}</td>
                    <td className="p-2 text-right pr-4 font-bold text-[#10b981]">{(p.issuances / 1000000).toFixed(2)}M</td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-zinc-500 italic">
                      No matching projects found. Check filter credentials.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DYNAMIC SLIDE-OVER INTELLIGENCE PANEL */}
      <div className={`fixed top-0 right-0 h-full w-[380px] bg-[#0f1814]/95 border-l border-[#1c2c22] shadow-2xl backdrop-blur-md z-40 transform transition-transform duration-300 flex flex-col ${selectedProject ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1c2c22] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#05ffb0]" />
            <span className="text-xs font-bold text-[#05ffb0] uppercase tracking-widest">Intelligence Panel</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSelectedProject(null)}
            className="p-1.5 hover:bg-[#1c2c22] rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {selectedProject ? (
          <div className="flex-1 overflow-y-auto divide-y divide-[#1c2c22]/50 pb-6">
            {/* Project details block */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Active Selection</span>
                <h2 className="text-sm font-bold text-white leading-tight">{selectedProject.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-emerald-950/40 text-[#05ffb0] border border-[#1c2c22] px-1.5 py-0.5 rounded font-bold">
                    {selectedProject.id}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${selectedProject.registry === "Verra Registry" ? "bg-emerald-950/20 text-[#10b981] border-[#1c2c22]/30" : "bg-teal-950/20 text-[#05ffb0] border-[#1c2c22]/30"}`}>
                    {selectedProject.registry}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#080c0a] border border-[#1c2c22] p-2.5 rounded">
                  <span className="text-[9px] text-zinc-500 block uppercase">Scenario Issuances</span>
                  <span className="text-sm font-bold text-white">
                    {(selectedProject.issuances / 1000000).toFixed(2)}M <span className="text-[9px] text-zinc-500 font-normal">t</span>
                  </span>
                </div>
                <div className="bg-[#080c0a] border border-[#1c2c22] p-2.5 rounded">
                  <span className="text-[9px] text-zinc-500 block uppercase font-bold">Retirements ({selectedScenario})</span>
                  <span className="text-sm font-bold text-[#05ffb0]">
                    {(() => {
                      const baseRet = selectedProject.retirements || 0;
                      let val = baseRet;
                      if (selectedScenario === "Max Retirement") {
                        val = Math.min(selectedProject.issuances, baseRet * 1.5);
                      } else if (selectedScenario === "Stress Test") {
                        val = Math.min(selectedProject.issuances, baseRet * 1.25);
                      }
                      return (val / 1000000).toFixed(2);
                    })()}M <span className="text-[9px] text-zinc-500 font-normal">t</span>
                  </span>
                </div>
              </div>

              {/* Data specifications */}
              <div className="bg-[#080c0a] border border-[#1c2c22] p-3.5 rounded space-y-2.5 text-[10px]">
                <div className="flex justify-between border-b border-[#1c2c22]/50 pb-1.5">
                  <span className="text-zinc-500">Methodology:</span>
                  <span className="text-zinc-300 text-right font-medium max-w-[180px] truncate" title={selectedProject.methodology}>
                    {selectedProject.methodology}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#1c2c22]/50 pb-1.5">
                  <span className="text-zinc-500">Status:</span>
                  <span className="text-[#05ffb0] font-bold uppercase">{selectedProject.status}</span>
                </div>
                <div className="flex justify-between border-b border-[#1c2c22]/50 pb-1.5">
                  <span className="text-zinc-500">Country/Origin:</span>
                  <span className="text-zinc-300 font-medium">{selectedProject.country}</span>
                </div>
                <div className="flex justify-between border-b border-[#1c2c22]/50 pb-1.5">
                  <span className="text-zinc-500">Controller:</span>
                  <span className="text-emerald-400 font-bold">{selectedProject.controller}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Coordinates:</span>
                  <span className="text-zinc-400 font-mono">
                    {selectedProject.latitude.toFixed(4)}, {selectedProject.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Global Metrics Context */}
            <div className="p-5 space-y-3">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-between">
                <span>Global Metrics & Scenario Context</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#080c0a] border border-[#1c2c22] p-2.5 rounded">
                  <span className="text-[8px] text-zinc-500 block uppercase">Total Issuances</span>
                  <span className="text-xs font-bold text-white">
                    {(totalIssuances / 1000000).toFixed(2)}M <span className="text-[8px] text-zinc-500">t</span>
                  </span>
                </div>
                <div className="bg-[#080c0a] border border-[#1c2c22] p-2.5 rounded">
                  <span className="text-[8px] text-zinc-500 block uppercase">Total Retirements</span>
                  <span className="text-xs font-bold text-[#05ffb0]">
                    {(totalRetirements / 1000000).toFixed(2)}M <span className="text-[8px] text-zinc-500">t</span>
                  </span>
                </div>
              </div>
              <div className="bg-[#080c0a] border border-[#1c2c22] p-3 rounded text-[10px] text-zinc-400 leading-relaxed">
                <div className="flex items-center gap-2 text-[#05ffb0] font-bold mb-1">
                  <Sliders size={12} />
                  SCENARIO: {selectedScenario.toUpperCase()}
                </div>
                <p className="text-[9px]">
                  {selectedScenario === "Baseline" && "Viewing original registry records directly from official volunteer ledgers."}
                  {selectedScenario === "Stress Test" && "Simulates a 25% compliance market pressure surge across active registry systems."}
                  {selectedScenario === "Max Retirement" && "Simulates a 50% liquidation spike capped at absolute issuance ceilings."}
                </p>
              </div>
            </div>

            {/* Project Ownership */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <Gauge size={14} className="text-[#05ffb0]" />
                Project Ownership Allocation
              </div>
              <div className="bg-[#080c0a] border border-[#1c2c22] p-4 rounded space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-400">Founder Share: 55%</span>
                  <span className="text-[#05ffb0]">Investor Share: 45%</span>
                </div>
                <div className="w-full h-2 bg-[#1c2c22] rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: "55%" }} />
                  <div className="h-full bg-[#05ffb0]" style={{ width: "45%" }} />
                </div>
              </div>
            </div>

            {/* Protective Rights */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <CheckSquare size={14} className="text-emerald-400" />
                Protective Rights Checklist
              </div>
              <div className="bg-[#080c0a] border border-[#1c2c22] p-3 rounded space-y-2.5">
                <div className="flex items-start gap-2 text-[11px]">
                  <input type="checkbox" checked readOnly className="mt-0.5 accent-emerald-500 bg-[#080c0a] border-[#1c2c22]" />
                  <span className="text-zinc-300">Veto on Asset Sales</span>
                </div>
                <div className="flex items-start gap-2 text-[11px]">
                  <input type="checkbox" checked readOnly className="mt-0.5 accent-emerald-500 bg-[#080c0a] border-[#1c2c22]" />
                  <span className="text-zinc-300">Anti-Dilution Protections</span>
                </div>
              </div>
            </div>

            {/* Why This Matters */}
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <FileText size={14} className="text-[#05ffb0]" />
                Why This Matters
              </div>
              <div className="bg-[#080c0a] border border-[#1c2c22] p-3 rounded text-[10px] text-zinc-400 leading-relaxed space-y-1.5">
                <p>
                  Carbon registries represent the cornerstone of environmental finance infrastructure. Without clear auditing vectors, double-counting risks devalue standard mitigation operations.
                </p>
                <p className="border-t border-[#1c2c22]/50 pt-1.5 text-zinc-500 italic text-[9px]">
                  By validating the alignment of legal protective covenants alongside physical coordinates, this interface ensures complete capital allocation fidelity.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-500 font-mono text-xs">
            <Sliders className="w-8 h-8 text-zinc-700 animate-pulse mb-3" />
            <span>Select a project marker from the map or a row in the table to display project intelligence.</span>
          </div>
        )}
      </div>

    </div>
  );
}