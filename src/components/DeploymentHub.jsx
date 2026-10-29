import React, { useState } from 'react';
import { 
  Server, 
  Cloud, 
  ExternalLink, 
  Check, 
  Copy, 
  Terminal, 
  Activity, 
  Cpu, 
  ShieldCheck,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function DeploymentHub() {
  const [activePlatform, setActivePlatform] = useState('render');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [pingStatus, setPingStatus] = useState(null);
  const [pingLoading, setPingLoading] = useState(false);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const testApiConnection = async () => {
    setPingLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/health');
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setPingStatus({
          online: true,
          latency,
          message: `Connected to FastAPI Backend (${latency}ms) — Model loaded: ${data.model_loaded}`
        });
      } else {
        setPingStatus({
          online: false,
          latency,
          message: `Backend returned status ${res.status}`
        });
      }
    } catch (err) {
      setPingStatus({
        online: false,
        latency: 0,
        message: "No live AWS backend connected yet. Running seamlessly in resilient client-side offline mode."
      });
    } finally {
      setPingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Deployment Command Center: AWS & Render
            </h2>
            <p className="text-xs text-slate-400">
              Production configuration for hosting the React frontend on Render and the FastAPI ML inference backend on AWS.
            </p>
          </div>
        </div>

        {/* Live Backend Ping Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={testApiConnection}
            disabled={pingLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-ocean-900 hover:bg-ocean-800 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all"
          >
            <Activity className={`w-3.5 h-3.5 ${pingLoading ? 'animate-spin' : ''}`} />
            <span>Test Backend API Ping</span>
          </button>
        </div>
      </div>

      {/* Ping Status Alert */}
      {pingStatus && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
          pingStatus.online 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${pingStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{pingStatus.message}</span>
          </div>
          {pingStatus.latency > 0 && (
            <span className="font-mono font-bold">{pingStatus.latency} ms</span>
          )}
        </div>
      )}

      {/* Platform Switcher */}
      <div className="flex space-x-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActivePlatform('render')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePlatform === 'render'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-ocean-900/40'
          }`}
        >
          <Cloud className="w-4 h-4 text-cyan-400" />
          <span>Deploy Frontend on Render</span>
        </button>

        <button
          onClick={() => setActivePlatform('aws')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePlatform === 'aws'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-ocean-900/40'
          }`}
        >
          <Server className="w-4 h-4 text-amber-400" />
          <span>Deploy Backend on AWS</span>
        </button>
      </div>

      {/* Render Frontend Deployment Guide */}
      {activePlatform === 'render' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Step-by-Step Render.com Frontend Deployment</span>
            </h3>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="p-3 bg-ocean-900/80 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-cyan-400">Step 1: Push Project to GitHub</span>
                <p className="text-slate-400">
                  Commit and push your changes to your GitHub repository:
                </p>
                <div className="bg-ocean-950 p-2 rounded font-mono text-[11px] text-slate-300 flex justify-between items-center mt-1">
                  <code>git add . && git commit -m "Add modern React frontend" && git push</code>
                  <button 
                    onClick={() => copyToClipboard('git add . && git commit -m "Add modern React frontend" && git push', 1)}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-ocean-900/80 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-cyan-400">Step 2: Create Static Site on Render</span>
                <p className="text-slate-400">
                  Go to <a href="https://dashboard.render.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Render Dashboard</a> &rarr; Click <b>New +</b> &rarr; Select <b>Static Site</b> &rarr; Connect your GitHub repository.
                </p>
              </div>

              <div className="p-3 bg-ocean-900/80 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-cyan-400">Step 3: Configure Build & Publish Settings</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-ocean-950 p-2 rounded">
                    <span className="text-slate-500 block">Root Directory:</span>
                    <span className="text-white font-semibold">frontend</span>
                  </div>
                  <div className="bg-ocean-950 p-2 rounded">
                    <span className="text-slate-500 block">Build Command:</span>
                    <span className="text-cyan-300 font-semibold">npm install && npm run build</span>
                  </div>
                  <div className="bg-ocean-950 p-2 rounded">
                    <span className="text-slate-500 block">Publish Directory:</span>
                    <span className="text-cyan-300 font-semibold">dist</span>
                  </div>
                  <div className="bg-ocean-950 p-2 rounded">
                    <span className="text-slate-500 block">Node.js Version:</span>
                    <span className="text-white font-semibold">20.x or 22.x</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-ocean-900/80 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-cyan-400">Step 4: Environment Variables (Optional)</span>
                <p className="text-slate-400">
                  In Render's <b>Environment</b> tab, add:
                </p>
                <div className="bg-ocean-950 p-2 rounded font-mono text-[11px] text-cyan-300">
                  VITE_API_BASE_URL = https://your-backend.awsapprunner.com
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  * Note: If not set, the frontend will automatically run using its self-contained high-accuracy client-side inference engine!
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Render Blueprint (`render.yaml`)</span>
            </h3>

            <p className="text-xs text-slate-400">
              You can also deploy via Render Blueprint for automated 1-click provisioning:
            </p>

            <pre className="p-3 bg-ocean-950 rounded-xl border border-white/5 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`services:
  - type: web
    name: floodsight-frontend
    env: static
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_BASE_URL
        value: https://your-backend.awsapprunner.com`}
            </pre>
          </div>
        </div>
      )}

      {/* AWS Backend Deployment Guide */}
      {activePlatform === 'aws' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <Server className="w-4 h-4 text-amber-400" />
                <span>AWS EC2 Free Tier (t2.micro / t3.micro) — Zero ECR</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                100% Free Tier Eligible
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Deploy directly on a single EC2 virtual machine without needing Amazon ECR, ECS, App Runner, or any other paid services.
            </p>

            <div className="space-y-3 pt-1 text-xs text-slate-300">
              <div className="p-3 bg-ocean-900/80 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-amber-400">Step 1: Launch EC2 Instance on AWS Console</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 mt-1 text-[11px]">
                  <li>OS: <b>Ubuntu Server 24.04 or 22.04 LTS</b> (Free tier eligible)</li>
                  <li>Instance Type: <b>t2.micro</b> or <b>t3.micro</b> (1 vCPU, 1 GB RAM)</li>
                  <li>Security Group: Allow <b>SSH (22)</b>, <b>HTTP (80)</b>, and <b>HTTPS (443)</b> from anywhere</li>
                  <li>Storage: <b>20 GiB gp3</b> (free tier includes up to 30 GiB)</li>
                </ul>
              </div>

              <div className="p-3 bg-ocean-900/80 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-amber-400">Step 2: SSH into your EC2 Instance</span>
                <div className="bg-ocean-950 p-2 rounded font-mono text-[11px] text-slate-300 flex justify-between items-center mt-1">
                  <code>ssh -i floodsight-key.pem ubuntu@&lt;YOUR-EC2-PUBLIC-IP&gt;</code>
                  <button 
                    onClick={() => copyToClipboard('ssh -i floodsight-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>', 2)}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-ocean-900/80 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-amber-400">Step 3: Run the 1-Command Automated Setup Script</span>
                <p className="text-[11px] text-slate-400">
                  Clones the repo and automatically configures 2GB swap memory, Python venv, Systemd auto-restart, and Nginx reverse proxy on port 80:
                </p>
                <div className="bg-ocean-950 p-2.5 rounded font-mono text-[11px] text-cyan-300 flex justify-between items-center mt-1 overflow-x-auto">
                  <code>git clone https://github.com/&lt;USERNAME&gt;/FloodSight.git && cd FloodSight/backend && bash ec2_setup.sh</code>
                  <button 
                    onClick={() => copyToClipboard('git clone https://github.com/<USERNAME>/FloodSight.git && cd FloodSight/backend && bash ec2_setup.sh', 3)}
                    className="text-slate-400 hover:text-white ml-2"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-ocean-900/80 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-amber-400">Step 4: Connect Render Frontend</span>
                <p className="text-[11px] text-slate-400">
                  In your Render Static Site Dashboard &rarr; Environment Variables:
                </p>
                <div className="bg-ocean-950 p-2 rounded font-mono text-[11px] text-emerald-400">
                  VITE_API_BASE_URL = http://&lt;YOUR-EC2-PUBLIC-IP&gt;
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Free Tier Optimization Highlights</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-400">
              <div className="bg-ocean-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-white font-semibold block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Ultra Low Memory Footprint (~155 MB)
                </span>
                <p className="text-[11px]">
                  The backend uses pure LightGBM booster without heavy PyCaret runtime overhead, leaving ~850 MB of physical RAM completely free on your t2.micro instance.
                </p>
              </div>

              <div className="bg-ocean-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-white font-semibold block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Automatic 2GB Swap Space
                </span>
                <p className="text-[11px]">
                  The setup script creates a 2GB virtual memory swapfile so npm/pip package updates and model operations never trigger Out-Of-Memory (OOM) errors.
                </p>
              </div>

              <div className="bg-ocean-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-white font-semibold block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Zero Container Registry (No ECR)
                </span>
                <p className="text-[11px]">
                  Code runs natively via Linux Systemd + Nginx on port 80, or optionally via local <code className="text-cyan-300">docker compose up -d --build</code> directly on the instance.
                </p>
              </div>

              <div className="p-3 bg-ocean-950 rounded-xl border border-white/5 text-[11px]">
                <span className="text-cyan-400 font-semibold block mb-1">Detailed Guide Included:</span>
                See <span className="font-mono text-white">AWS_EC2_FREE_TIER_GUIDE.md</span> in the root directory for troubleshooting, Nginx tuning, and free SSL certification.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
