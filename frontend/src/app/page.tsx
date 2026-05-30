"use client";

import React, { useState, useEffect } from "react";
import { Download, ShieldCheck, Activity } from "lucide-react";
import MapComponent from "../components/MapComponent";

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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedRegistry, setSelectedRegistry] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize data layer ingestion from your FastAPI local server
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error linking to backend API:", err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = selectedRegistry === "all" 
    ? projects 
    : projects.filter(p => p.registry.toLowerCase() === selectedRegistry.toLowerCase());

  // Real Rails mandatory feature: Download Sample Data
  const downloadSampleData = () => {
    const headers = "ID,Name,Registry,Status,Country,Latitude,Longitude\n";
    const csvRows = filteredProjects.map(p => 
      `"${p.id}","${p.name}","${p.registry}","${p.status}","${p.country}",${p.latitude},${p.longitude}`
    ).join("\n");
    
    const blob = new Blob([headers + csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carbon_registry_${selectedRegistry}_export.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-zinc-50 font-sans overflow-hidden">
      
      {/* High-Density Header Segment */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-[#030712] z-10">
        <div className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h1 className="text-base font-bold tracking-tight text-zinc-100">
            CARBON CREDIT REGISTRY EXPLORER
          </h1>
          <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">
            POC-64
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedRegistry}
            onChange={(e) => setSelectedRegistry(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded px-3 py-1.5 focus:outline-none focus:border-zinc-700"
          >
            <option value="all">All Registries</option>
            <option value="verra">Verra (VCS)</option>
            <option value="gold standard">Gold Standard</option>
          </select>
          
          <button 
            onClick={downloadSampleData}
            className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 px-3 py-1.5 rounded transition"
          >
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-medium">Download Sample Data</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame (2-Column Split Layout) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Intelligence Sidebar (Exactly 30% Width Layout) */}
        <aside className="w-[30%] min-w-[320px] border-r border-zinc-900 bg-[#0B1117] flex flex-col justify-between overflow-y-auto z-10 p-5 space-y-6">
          <div className="space-y-6">
            
            {/* Metric Displays */}
            <div className="space-y-3">
              <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                Live Ledger Pipeline
              </h2>
              {loading ? (
                <div className="text-xs text-zinc-500 animate-pulse font-mono">Syncing states...</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/40 border border-zinc-800 p-3 rounded">
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Active Nodes</div>
                    <div className="text-lg font-bold text-zinc-200 mt-1">{filteredProjects.length}</div>
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-800 p-3 rounded">
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Total Volume</div>
                    <div className="text-lg font-bold text-green-400 mt-1">4.3M<span className="text-[10px] text-zinc-500 ml-0.5">t</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Why This Matters Panel */}
            <div className="border border-zinc-800 bg-zinc-900/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2 text-green-400">
                <Activity className="h-4 w-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider font-mono">Why This Matters</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Carbon registries form the structural supply ledger for the global voluntary carbon market (VCM). 
                By converting abstract ecological claims into verifiable, serial-numbered tradeable assets, 
                this rail establishes the trust foundation required for corporate capital allocation toward climate mitigation.
              </p>
            </div>

            {/* Who Controls the Rail Panel */}
            <div className="border border-zinc-800 bg-zinc-900/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2 text-blue-400">
                <ShieldCheck className="h-4 w-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider font-mono">Who Controls the Rail</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The supply architecture is primarily governed by independent non-profit standard-setting bodies—most 
                notably Verra (managing the VCS registry) and the Gold Standard Foundation. These entities establish 
                the baseline methodologies, authorize validation bodies, and host the final transactional state ledgers.
              </p>
            </div>
          </div>

          {/* High-Density Item Stream */}
          <div className="space-y-3 pt-4 border-t border-zinc-900">
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
              Indexed Nodes
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredProjects.map((project) => (
                <div key={project.id} className="p-2 bg-zinc-900/30 border border-zinc-800 rounded text-xs flex justify-between items-center">
                  <span className="font-mono text-zinc-300 font-semibold">{project.id}</span>
                  <span className="text-zinc-400 truncate max-w-[120px]">{project.name}</span>
                  <span className="text-zinc-500 font-mono text-[10px]">{project.country}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Stage Interactive Viewport Map (70% Width Layout) */}
        <main className="w-[70%] h-full relative bg-zinc-900">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-xs text-zinc-500 font-mono">
              Initializing spatial canvas matrices...
            </div>
          ) : (
            <MapComponent projects={filteredProjects} />
          )}
        </main>

      </div>
    </div>
  );
}
