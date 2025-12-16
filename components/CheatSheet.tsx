import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  ArrowLeft, 
  Code, 
  Terminal, 
  Cloud, 
  Database, 
  Layers, 
  FileJson, 
  Workflow, 
  BookOpen,
  Download,
  Loader2,
  Command,
  CheckSquare,
  RefreshCw,
  ArrowDownUp
} from 'lucide-react';

interface CheatSheetProps {
  onBack: () => void;
}

export const CheatSheet: React.FC<CheatSheetProps> = ({ onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    
    try {
      setIsGenerating(true);
      
      // 1. Capture the DOM element as a high-quality canvas
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => element.classList.contains('no-print')
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // 2. Create a PDF with dimensions matching the content (Single Long Page)
      // We convert pixels to points for PDF (1px = 0.75pt roughly), or just use 'px' unit in jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [imgWidth / 2, imgHeight / 2] // Scale down by 2 to match screen size visually in PDF
      });

      // 3. Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth / 2, imgHeight / 2);
      
      // 4. Save
      pdf.save('Terraform_Associate_003_CheatSheet.pdf');
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Toolbar / Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sticky top-0 z-10 bg-slate-50/90 backdrop-blur py-4 border-b border-slate-200">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        
        <button 
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-sm transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" /> Generating PDF...
            </>
          ) : (
            <>
              <Download size={18} className="mr-2" /> Download PDF
            </>
          )}
        </button>
      </div>

      {/* Printable Area Wrapper */}
      <div ref={printRef} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        {/* Document Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
          <div className="p-3 bg-indigo-50 rounded-xl">
             <BookOpen className="text-indigo-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Exam Cheat Sheet</h1>
            <p className="text-slate-500">Official Objectives for Terraform Associate (003)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Domain 1: IaC Concepts */}
          <section className="overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">1. IaC Concepts</h2>
            </div>
            <div className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100 text-slate-700 text-sm leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Idempotence:</strong> Applying the same configuration multiple times results in the same final state (convergent).</li>
                <li><strong>Benefits of IaC:</strong>
                  <ul className="list-circle pl-5 mt-1 text-slate-500">
                     <li>Consistency (prevents config drift).</li>
                     <li>Reusability (Modules).</li>
                     <li>Auditability (Version Control/Git).</li>
                  </ul>
                </li>
                <li><strong>Day 0 vs Day 1 vs Day 2:</strong>
                  <ul className="list-circle pl-5 mt-1 text-slate-500">
                     <li>Day 0: Design & Arch.</li>
                     <li>Day 1: Initial Provisioning.</li>
                     <li>Day 2: Maintenance/Updates.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          {/* Domain 2: Purpose */}
          <section className="overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <Layers className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">2. Purpose of Terraform</h2>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 text-slate-700 text-sm leading-relaxed shadow-sm">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <h3 className="font-semibold text-slate-900 mb-2">Platform Agnostic</h3>
                   <p>Terraform can manage resources across multiple cloud providers (AWS, Azure, GCP) in a single workflow, unlike CloudFormation (AWS only) or ARM (Azure only).</p>
                 </div>
                 <div>
                   <h3 className="font-semibold text-slate-900 mb-2">Immutable Infrastructure</h3>
                   <p>Terraform tends to replace resources rather than modify them in place. New server = new machine image, not a patch.</p>
                 </div>
               </div>
            </div>
          </section>

          {/* Domain 3: Basics */}
          <section className="overflow-hidden">
             <div className="flex items-center gap-3 mb-3">
              <Code className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">3. Terraform Basics</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Code Snippet */}
                  <div className="bg-slate-900 p-4 rounded-lg text-xs font-mono text-indigo-300 overflow-x-auto">
    {`terraform {
  # 1. Terraform Settings
  required_version = ">= 1.3.0"
  
  # 2. Provider Requirements (Constraints)
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# 3. Provider Configuration (Auth/Region)
provider "aws" {
  region = "us-west-2"
  alias  = "west" # For multiple regions
}`}
                  </div>

                  {/* Explanation */}
                  <div className="space-y-4 text-sm text-slate-700">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Terraform Block vs Provider Block</h3>
                      <div className="space-y-3">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <code className="text-indigo-700 font-bold block text-xs">terraform {'{ required_providers { ... } }'}</code>
                          <p className="text-xs text-slate-600 mt-1">
                            Defines <strong>WHAT</strong> you need. Specifies the source (e.g., hashicorp/aws) and version constraints. Does not authenticate.
                          </p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <code className="text-indigo-700 font-bold block text-xs">provider "name" {'{ ... }'}</code>
                          <p className="text-xs text-slate-600 mt-1">
                            Defines <strong>HOW</strong> to connect. Configures credentials, regions, and API endpoints. This is where you configure the plugin downloaded by init.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Domain 4: CLI */}
          <section className="overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <Terminal className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">4. Terraform CLI Reference</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm">
               
               {/* 4.1 Core Workflow */}
               <div className="mb-6">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                    <Workflow size={16} /> Core Workflow
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-3 bg-slate-50 rounded border border-slate-100">
                       <div>
                          <code className="text-indigo-700 font-bold block">terraform init</code>
                          <span className="text-xs text-slate-500">Initialize directory</span>
                       </div>
                       <div className="text-slate-600 text-xs space-y-1">
                          <p>Required first command. Downloads plugins/modules.</p>
                          <div className="flex flex-wrap gap-2">
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-upgrade</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-reconfigure</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-migrate-state</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-backend=false</code>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-3 bg-slate-50 rounded border border-slate-100">
                       <div>
                          <code className="text-indigo-700 font-bold block">terraform plan</code>
                          <span className="text-xs text-slate-500">Generate execution plan</span>
                       </div>
                       <div className="text-slate-600 text-xs space-y-1">
                          <p>Compares config to state. Checks for drift.</p>
                          <div className="flex flex-wrap gap-2">
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-out=path</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-refresh-only</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-target=addr</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-var 'k=v'</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-var-file=file</code>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-3 bg-slate-50 rounded border border-slate-100">
                       <div>
                          <code className="text-indigo-700 font-bold block">terraform apply</code>
                          <span className="text-xs text-slate-500">Apply changes</span>
                       </div>
                       <div className="text-slate-600 text-xs space-y-1">
                          <p>Provision resources. Updates state file.</p>
                          <div className="flex flex-wrap gap-2">
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-auto-approve</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-input=false</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-replace=addr</code>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-3 bg-slate-50 rounded border border-slate-100">
                       <div>
                          <code className="text-indigo-700 font-bold block">terraform destroy</code>
                          <span className="text-xs text-slate-500">Destroy infrastructure</span>
                       </div>
                       <div className="text-slate-600 text-xs space-y-1">
                          <p>Removes all managed resources.</p>
                          <div className="flex flex-wrap gap-2">
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-auto-approve</code>
                             <code className="bg-white px-1.5 py-0.5 border rounded text-slate-700">-target=addr</code>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               {/* 4.2 State Management */}
               <div className="mb-6">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                    <Database size={16} /> State Management
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <div className="p-2 border border-slate-100 rounded">
                        <code className="text-indigo-700 font-bold text-xs">terraform state list</code>
                        <p className="text-xs text-slate-500 mt-1">List all resources in the state file.</p>
                     </div>
                     <div className="p-2 border border-slate-100 rounded">
                        <code className="text-indigo-700 font-bold text-xs">terraform state show &lt;addr&gt;</code>
                        <p className="text-xs text-slate-500 mt-1">Show details of a single resource.</p>
                     </div>
                     <div className="p-2 border border-slate-100 rounded">
                        <code className="text-indigo-700 font-bold text-xs">terraform state mv &lt;src&gt; &lt;dst&gt;</code>
                        <p className="text-xs text-slate-500 mt-1">Rename/Move resource in state (preserves real resource).</p>
                     </div>
                     <div className="p-2 border border-slate-100 rounded">
                        <code className="text-indigo-700 font-bold text-xs">terraform state rm &lt;addr&gt;</code>
                        <p className="text-xs text-slate-500 mt-1">Stop tracking resource (does not destroy real resource).</p>
                     </div>
                     <div className="p-2 border border-slate-100 rounded">
                        <code className="text-indigo-700 font-bold text-xs">terraform state pull</code>
                        <p className="text-xs text-slate-500 mt-1">Output remote state to stdout.</p>
                     </div>
                     <div className="p-2 border border-slate-100 rounded">
                        <code className="text-indigo-700 font-bold text-xs">terraform state push</code>
                        <p className="text-xs text-slate-500 mt-1">Overwrite remote state with local file (Dangerous).</p>
                     </div>
                     <div className="p-2 border border-slate-100 rounded col-span-1 md:col-span-2">
                        <code className="text-indigo-700 font-bold text-xs">terraform import &lt;addr&gt; &lt;id&gt;</code>
                        <p className="text-xs text-slate-500 mt-1">Bring existing real-world resource into Terraform management.</p>
                     </div>
                  </div>
               </div>

               {/* 4.3 Utilities & Workspaces */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                       <Command size={16} /> Utilities & Code Quality
                    </h3>
                    <ul className="space-y-3 text-xs text-slate-600">
                       <li>
                          <code className="text-indigo-700 font-bold block">terraform fmt</code>
                          Rewrites config to canonical format.<br/>
                          Flags: <code className="bg-slate-50 border rounded px-1">-recursive</code>, <code className="bg-slate-50 border rounded px-1">-check</code>, <code className="bg-slate-50 border rounded px-1">-diff</code>
                       </li>
                       <li>
                          <code className="text-indigo-700 font-bold block">terraform validate</code>
                          Checks syntax and internal references (no API calls).<br/>
                          Flags: <code className="bg-slate-50 border rounded px-1">-json</code>
                       </li>
                       <li>
                          <code className="text-indigo-700 font-bold block">terraform console</code>
                          Interactive REPL for testing expressions.
                       </li>
                       <li>
                          <code className="text-indigo-700 font-bold block">terraform output</code>
                          Print output variables. <code className="bg-slate-50 border rounded px-1">-json</code>
                       </li>
                       <li>
                          <code className="text-indigo-700 font-bold block">terraform force-unlock &lt;id&gt;</code>
                          Manually release a stuck state lock.
                       </li>
                       <li>
                          <code className="text-indigo-700 font-bold block">terraform login</code>
                          Authenticate with Terraform Cloud/Enterprise.
                       </li>
                    </ul>
                  </div>

                  <div>
                     <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                       <Layers size={16} /> Workspaces
                    </h3>
                    <div className="bg-slate-50 rounded p-3 text-xs space-y-2 border border-slate-100">
                       <p className="text-slate-500 italic mb-2">Manage multiple state files for the same config (e.g., dev, prod).</p>
                       <div className="grid grid-cols-[1fr_auto] gap-2 items-center border-b border-slate-200 pb-1">
                          <code className="font-bold text-indigo-700">terraform workspace list</code>
                          <span>List all workspaces</span>
                       </div>
                       <div className="grid grid-cols-[1fr_auto] gap-2 items-center border-b border-slate-200 pb-1">
                          <code className="font-bold text-indigo-700">terraform workspace new &lt;name&gt;</code>
                          <span>Create & switch</span>
                       </div>
                       <div className="grid grid-cols-[1fr_auto] gap-2 items-center border-b border-slate-200 pb-1">
                          <code className="font-bold text-indigo-700">terraform workspace select &lt;name&gt;</code>
                          <span>Switch workspace</span>
                       </div>
                       <div className="grid grid-cols-[1fr_auto] gap-2 items-center border-b border-slate-200 pb-1">
                          <code className="font-bold text-indigo-700">terraform workspace show</code>
                          <span>Show current</span>
                       </div>
                       <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                          <code className="font-bold text-indigo-700">terraform workspace delete &lt;name&gt;</code>
                          <span>Delete empty ws</span>
                       </div>
                    </div>
                  </div>
               </div>

            </div>
          </section>

          {/* Domain 5: Modules */}
          <section className="overflow-hidden">
             <div className="flex items-center gap-3 mb-3">
              <FileJson className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">5. Modules</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm text-slate-700 space-y-4">
               
               {/* Definitions */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <strong className="text-indigo-700 block mb-1">Root Module</strong>
                    <p className="text-xs text-slate-600">The current working directory where you run <code>terraform plan/apply</code>. It is the entry point.</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <strong className="text-indigo-700 block mb-1">Child Module</strong>
                    <p className="text-xs text-slate-600">A module called by another module. Sourced from local paths (<code>./app</code>), Registry, or Git.</p>
                 </div>
               </div>

               {/* Data Flow Diagram */}
               <div>
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
                    <ArrowDownUp size={16} /> Module Data Flow
                  </h3>
                  <div className="flex items-center justify-center gap-8 py-2 text-center text-xs">
                     <div className="border border-slate-300 rounded p-2 bg-slate-100 w-32">
                        <strong>Root Module</strong><br/>
                        (Main config)
                     </div>
                     <div className="flex flex-col gap-2 w-32">
                        <div className="relative border-b border-slate-300">
                           <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-1 text-slate-500">Variables</span>
                           <span className="block text-right text-indigo-600 font-bold">&darr;</span>
                        </div>
                        <div className="relative border-t border-slate-300">
                           <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-1 text-slate-500">Outputs</span>
                           <span className="block text-left text-green-600 font-bold">&uarr;</span>
                        </div>
                     </div>
                     <div className="border border-slate-300 rounded p-2 bg-slate-100 w-32">
                        <strong>Child Module</strong><br/>
                        (Resource definitions)
                     </div>
                  </div>
                  <div className="mt-3 bg-slate-900 p-3 rounded text-xs font-mono text-indigo-300">
{`# 1. Root sends data via variables
module "network" {
  source = "./modules/vpc"
  cidr_block = "10.0.0.0/16" # Passing value DOWN
}

# 2. Child defines outputs (in ./modules/vpc/outputs.tf)
# output "vpc_id" { value = aws_vpc.main.id }

# 3. Root reads output (Passing value UP)
resource "aws_instance" "app" {
  subnet_id = module.network.vpc_id 
}`}
                  </div>
               </div>
            </div>
          </section>

          {/* Domain 6: Workflow */}
          <section className="overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <Workflow className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">6. Workflow & Lifecycle</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm text-slate-700">
               <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
                  <div className="flex-shrink-0 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 font-semibold">Write</div>
                  <ArrowLeft className="rotate-180 text-slate-400" size={16} />
                  <div className="flex-shrink-0 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 font-semibold">Plan</div>
                  <ArrowLeft className="rotate-180 text-slate-400" size={16} />
                  <div className="flex-shrink-0 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 font-semibold">Apply</div>
               </div>
               <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Standard Workflow:</strong> Init -&gt; Plan -&gt; Apply.</li>
                 <li><strong>Drift Detection:</strong> <code className="text-xs bg-slate-50 px-1 border rounded">plan -refresh-only</code> compares state to real infrastructure without modifying resources.</li>
                 <li><strong>Resource Replacement:</strong> Use <code className="text-xs bg-slate-50 px-1 border rounded">-replace="resource.addr"</code> to force recreation. (Replaces deprecated <code className="text-xs">taint</code> command).</li>
               </ul>
            </div>
          </section>

          {/* Domain 7: State */}
          <section className="overflow-hidden">
             <div className="flex items-center gap-3 mb-3">
              <Database className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">7. State Management & Migration</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm text-slate-700">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">State Basics</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Maps configuration to real-world resources.</li>
                      <li>Tracks metadata (dependencies) and performance cache.</li>
                      <li><strong>Locking:</strong> Prevents concurrent writes (e.g., DynamoDB for S3).</li>
                      <li><strong>Security:</strong> Encrypt state (S3 bucket policies) as it contains secrets.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <RefreshCw size={14} className="text-indigo-600"/> Migration & Backends
                    </h3>
                    <div className="space-y-2">
                       <p className="text-xs">
                         <strong>To migrate state:</strong> Change <code>backend</code> config, run <code>terraform init</code>, answer "yes" to copy.
                       </p>
                       <p className="text-xs">
                         <strong>Flags:</strong><br/>
                         <code className="bg-slate-100 px-1 rounded">-migrate-state</code>: Copies existing state to new backend.<br/>
                         <code className="bg-slate-100 px-1 rounded">-reconfigure</code>: Discards old state linkage (starts fresh).
                       </p>
                    </div>
                  </div>
               </div>
               
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">Migration Scenarios</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                     <div className="bg-white p-3 rounded border border-slate-200">
                        <strong className="block mb-1 text-indigo-700">Local &rarr; S3</strong>
                        1. Add <code>backend "s3"</code> block.<br/>
                        2. Run <code>terraform init</code>.<br/>
                        3. Confirm copy.
                     </div>
                     <div className="bg-white p-3 rounded border border-slate-200">
                        <strong className="block mb-1 text-indigo-700">S3 &rarr; Local</strong>
                        1. Remove <code>backend</code> block.<br/>
                        2. Run <code>terraform init -migrate-state</code>.<br/>
                        3. State moves to local file.
                     </div>
                     <div className="bg-white p-3 rounded border border-slate-200">
                        <strong className="block mb-1 text-indigo-700">Local &rarr; HCP (Cloud)</strong>
                        1. Add <code>cloud {'{ organization = "..." }'}</code> block.<br/>
                        2. Run <code>terraform init</code>.<br/>
                        3. Workspace created in TFC.
                     </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 italic">
                     * HCP Terraform replaces the backend. You generally do not use S3 backend *with* HCP Terraform unless running locally (CLI-driven) and just using TFC for other features, but standard TFC stores state itself.
                  </div>
               </div>
            </div>
          </section>

          {/* Domain 8: Config */}
          <section className="overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <FileJson className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">8. Configuration & HCL</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm">
              
              {/* Types Grid */}
              <div className="mb-6">
                 <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">HCL Data Types</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                       <strong className="text-indigo-700 text-xs block mb-1">Primitive Types</strong>
                       <ul className="text-xs space-y-1 text-slate-700">
                          <li><span className="font-mono bg-white px-1 border rounded">string</span>: <code>"ami-123"</code></li>
                          <li><span className="font-mono bg-white px-1 border rounded">number</span>: <code>5</code>, <code>2.5</code></li>
                          <li><span className="font-mono bg-white px-1 border rounded">bool</span>: <code>true</code>, <code>false</code></li>
                       </ul>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                       <strong className="text-indigo-700 text-xs block mb-1">Collection Types</strong>
                       <ul className="text-xs space-y-1 text-slate-700">
                          <li><span className="font-mono bg-white px-1 border rounded">list</span>: <code>["a", "b"]</code> (Ordered, same type)</li>
                          <li><span className="font-mono bg-white px-1 border rounded">map</span>: <code>{'{ foo = "bar" }'}</code> (Key/Value, same type)</li>
                          <li><span className="font-mono bg-white px-1 border rounded">set</span>: <code>["a", "b"]</code> (Unordered, unique)</li>
                       </ul>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 md:col-span-2">
                       <strong className="text-indigo-700 text-xs block mb-1">Structural Types</strong>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="text-xs">
                             <span className="font-mono bg-white px-1 border rounded">object</span>: Named attributes of different types.
                             <div className="font-mono text-slate-500 mt-1">object({'{ name=string, age=number }'})</div>
                          </div>
                          <div className="text-xs">
                             <span className="font-mono bg-white px-1 border rounded">tuple</span>: Ordered elements of different types.
                             <div className="font-mono text-slate-500 mt-1">tuple([string, number, bool])</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Syntax & Blocks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                 <div>
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Syntax & Logic</h3>
                    <div className="space-y-4">
                       <div>
                          <strong className="text-xs text-indigo-700">Interpolation vs Directives</strong>
                          <ul className="mt-1 space-y-2 text-xs text-slate-600">
                             <li>
                                <strong>Interpolation <code>${'{...}'}</code></strong>: Inserts a value into a string.
                                <br/><code className="bg-slate-50">"Hello ${'{var.name}'}"</code>
                             </li>
                             <li>
                                <strong>Directives <code>%{'{}'}</code></strong>: Control logic (loops/conditionals) inside strings (heredoc).
                                <br/><code className="bg-slate-50">"%{'{if var.enabled}'} value %{'{endif}'}"</code>
                             </li>
                          </ul>
                       </div>
                       
                       <div>
                          <strong className="text-xs text-indigo-700">Resource Meta-Arguments</strong>
                          <ul className="mt-1 space-y-1 text-xs text-slate-600">
                             <li><code className="font-bold">count</code>: Creates N instances (uses index).</li>
                             <li><code className="font-bold">for_each</code>: Creates instances from map/set (uses key).</li>
                             <li><code className="font-bold">depends_on</code>: Explicit dependency definition.</li>
                             <li><code className="font-bold">lifecycle</code>: <code>create_before_destroy</code>, <code>prevent_destroy</code>, <code>ignore_changes</code>.</li>
                             <li><code className="font-bold">provider</code>: Select non-default provider alias.</li>
                          </ul>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Top-Level Blocks</h3>
                    <div className="overflow-hidden rounded border border-slate-200">
                       <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-500 font-semibold">
                             <tr>
                                <th className="p-2 border-b">Block</th>
                                <th className="p-2 border-b">Purpose</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             <tr>
                                <td className="p-2 font-mono text-indigo-700">terraform</td>
                                <td className="p-2">Settings (backend, required_version).</td>
                             </tr>
                             <tr>
                                <td className="p-2 font-mono text-indigo-700">provider</td>
                                <td className="p-2">Configure plugin (region, creds).</td>
                             </tr>
                             <tr>
                                <td className="p-2 font-mono text-indigo-700">resource</td>
                                <td className="p-2">Manage infra object (EC2, S3).</td>
                             </tr>
                             <tr>
                                <td className="p-2 font-mono text-indigo-700">data</td>
                                <td className="p-2">Read external object.</td>
                             </tr>
                             <tr>
                                <td className="p-2 font-mono text-indigo-700">variable</td>
                                <td className="p-2">Input parameters.</td>
                             </tr>
                             <tr>
                                <td className="p-2 font-mono text-indigo-700">output</td>
                                <td className="p-2">Return values.</td>
                             </tr>
                             <tr>
                                <td className="p-2 font-mono text-indigo-700">locals</td>
                                <td className="p-2">Internal constants/expressions.</td>
                             </tr>
                             <tr>
                                <td className="p-2 font-mono text-indigo-700">module</td>
                                <td className="p-2">Call child module.</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>

              {/* Dynamic Blocks */}
              <div className="mb-6">
                 <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Dynamic Blocks</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-xs text-slate-600 space-y-2">
                       <p>
                          <strong>Usage:</strong> Dynamically construct repeatable nested blocks (like <code>ingress</code> rules in security groups or <code>tag</code> blocks) based on a collection (list or map).
                       </p>
                       <p>
                          <strong>Key Components:</strong>
                       </p>
                       <ul className="list-disc pl-4 space-y-1">
                          <li><code>dynamic "name"</code>: The name of the nested block to generate.</li>
                          <li><code>for_each</code>: The collection to iterate over.</li>
                          <li><code>content</code>: The body of each generated block.</li>
                          <li><code>iterator</code> (optional): Custom name for the loop variable (default is block name).</li>
                       </ul>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-indigo-300 overflow-x-auto">
{`resource "aws_security_group" "example" {
  name = "example"

  # Generates multiple 'ingress' blocks
  dynamic "ingress" {
    for_each = var.service_ports # [80, 443]
    iterator = port              # Optional rename
    content {
      from_port = port.value
      to_port   = port.value
      protocol  = "tcp"
    }
  }
}`}
                    </div>
                 </div>
              </div>

            </div>
          </section>

          {/* Domain 9: Cloud (Expanded) */}
          <section className="overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <Cloud className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">9. Terraform Cloud (HCP Terraform)</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm">
              
              {/* Feature Comparison */}
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">CLI (OSS) vs. HCP Terraform</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <strong className="text-slate-700 block mb-2">Terraform CLI (OSS)</strong>
                    <ul className="list-disc pl-4 text-xs space-y-1 text-slate-600">
                      <li>State stored locally or manually in Remote Backend (S3/Azure).</li>
                      <li>Execution happens on <strong>local machine</strong> or CI server.</li>
                      <li><strong>Workspaces:</strong> Just different state files in the same backend.</li>
                      <li>Secrets managed via local ENV vars or vault.</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <strong className="text-indigo-900 block mb-2">HCP Terraform (Cloud)</strong>
                    <ul className="list-disc pl-4 text-xs space-y-1 text-indigo-800">
                      <li>State stored & versioned automatically in Cloud.</li>
                      <li>Execution happens remotely on <strong>ephemeral VMs</strong>.</li>
                      <li><strong>Workspaces:</strong> Full environments (State + Config + Variables + Access Control).</li>
                      <li><strong>Private Registry</strong> for sharing modules/providers internally.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 9.2 Organization & Workspaces */}
                <div>
                   <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
                     <Layers size={16} className="text-indigo-600" /> Structure & Workspaces
                   </h3>
                   <div className="space-y-3 text-xs text-slate-700">
                     <div className="p-2 border border-slate-200 rounded">
                        <strong>Hierarchy:</strong> Organization &rarr; Projects &rarr; Workspaces
                     </div>
                     <p>
                       <strong>HCP Workspace vs CLI Workspace:</strong><br/>
                       In CLI, a workspace is just a state file separation (e.g., `default`, `prod`). 
                       In HCP Terraform, a Workspace is a major unit of organization that connects to a VCS repo, holds specific variable sets, has granular RBAC, and maintains a run history.
                     </p>
                     <ul className="list-disc pl-4 space-y-1">
                       <li><strong>VCS-Driven:</strong> Connect Git repo. PRs trigger Speculative Plans. Merges trigger Apply.</li>
                       <li><strong>CLI-Driven:</strong> Run `terraform apply` locally, but execution streams to Cloud.</li>
                       <li><strong>API-Driven:</strong> Trigger via API calls (CI/CD pipelines).</li>
                     </ul>
                   </div>
                </div>

                {/* 9.3 Governance (Sentinel) */}
                <div>
                   <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
                     <CheckSquare size={16} className="text-indigo-600" /> Governance & Policy
                   </h3>
                   <div className="space-y-3 text-xs text-slate-700">
                      <p>
                        <strong>Sentinel (Policy as Code):</strong> Logic that runs <em>between</em> Plan and Apply phases. It accesses the plan data to enforce rules (e.g., "Instance type must be t2.micro", "Must have tags").
                      </p>
                      
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <strong>Enforcement Levels:</strong>
                        <ul className="mt-1 space-y-1">
                          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> <strong>Hard Mandatory:</strong> Prevents apply. Cannot be overridden.</li>
                          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> <strong>Soft Mandatory:</strong> Prevents apply, but admin can override.</li>
                          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <strong>Advisory:</strong> Warns user, but allows apply.</li>
                        </ul>
                      </div>
                      
                      <p>
                        <strong>Cost Estimation:</strong> Predicts monthly cost of resources in the Plan before applying.
                      </p>
                   </div>
                </div>
              </div>

            </div>
          </section>

          {/* Section 10: Debugging & Env Vars */}
          <section className="overflow-hidden">
             <div className="flex items-center gap-3 mb-3">
              <Terminal className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">10. Debugging & Environment</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Logging */}
                  <div>
                     <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Terraform Logging</h3>
                     <p className="text-slate-600 mb-2">Enabled via Environment Variables. Use when Terraform crashes or for provider debugging.</p>
                     
                     <div className="space-y-3">
                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                           <code className="text-indigo-700 font-bold block mb-1">TF_LOG</code>
                           <p className="text-xs text-slate-600 mb-2">Sets the verbosity level.</p>
                           <div className="flex flex-wrap gap-1 text-[10px] uppercase font-bold text-white">
                              <span className="bg-slate-400 px-1.5 py-0.5 rounded">OFF</span>
                              <span className="bg-slate-400 px-1.5 py-0.5 rounded">ERROR</span>
                              <span className="bg-slate-400 px-1.5 py-0.5 rounded">WARN</span>
                              <span className="bg-slate-400 px-1.5 py-0.5 rounded">INFO</span>
                              <span className="bg-slate-500 px-1.5 py-0.5 rounded">DEBUG</span>
                              <span className="bg-indigo-600 px-1.5 py-0.5 rounded">TRACE</span>
                           </div>
                           <p className="text-[10px] text-slate-500 mt-2">
                             <strong>TRACE</strong> is the most verbose (internal TF logs).<br/>
                             <strong>DEBUG</strong> is standard for troubleshooting.
                           </p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                           <code className="text-indigo-700 font-bold block mb-1">TF_LOG_PATH</code>
                           <p className="text-xs text-slate-600">
                             Path to save the log file (e.g., <code className="bg-white px-1 border rounded">./terraform.log</code>). 
                             Without this, logs stream to stderr.
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Common Env Vars */}
                  <div>
                     <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Environment Variables</h3>
                     <ul className="space-y-3">
                        <li className="flex flex-col gap-1">
                           <code className="text-indigo-700 font-bold text-xs bg-indigo-50 w-fit px-2 py-0.5 rounded">TF_VAR_name</code>
                           <span className="text-xs text-slate-600">Sets input variable <code className="font-mono">var.name</code>. Useful for automation/CI.</span>
                        </li>
                        <li className="flex flex-col gap-1">
                           <code className="text-indigo-700 font-bold text-xs bg-indigo-50 w-fit px-2 py-0.5 rounded">TF_INPUT</code>
                           <span className="text-xs text-slate-600">Set to <code className="font-mono">0</code> or <code className="font-mono">false</code> to disable interactive prompts (for CI/CD automation). Fails if input is required but missing.</span>
                        </li>
                        <li className="flex flex-col gap-1">
                           <code className="text-indigo-700 font-bold text-xs bg-indigo-50 w-fit px-2 py-0.5 rounded">TF_CLI_ARGS</code>
                           <span className="text-xs text-slate-600">Append arguments to command. E.g. <code className="font-mono">TF_CLI_ARGS_plan="-refresh-only"</code>.</span>
                        </li>
                        <li className="flex flex-col gap-1">
                           <code className="text-indigo-700 font-bold text-xs bg-indigo-50 w-fit px-2 py-0.5 rounded">TF_DATA_DIR</code>
                           <span className="text-xs text-slate-600">Change location of <code className="font-mono">.terraform</code> directory (plugins/modules).</span>
                        </li>
                        <li className="flex flex-col gap-1">
                           <code className="text-indigo-700 font-bold text-xs bg-indigo-50 w-fit px-2 py-0.5 rounded">TF_WORKSPACE</code>
                           <span className="text-xs text-slate-600">Selects workspace for non-interactive environments.</span>
                        </li>
                     </ul>
                  </div>

               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};