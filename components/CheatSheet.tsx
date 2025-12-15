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
  Command
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
                  <div className="bg-slate-900 p-4 rounded-lg text-xs font-mono text-indigo-300 overflow-x-auto">
    {`terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "web" {
  ami = "ami-12345"
}

data "aws_ami" "ubuntu" {
  most_recent = true
}`}
                  </div>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><strong>Provider:</strong> A plugin that allows Terraform to interact with an API (AWS, Azure, etc).</p>
                    <p><strong>Resource:</strong> <code className="bg-slate-100 px-1 rounded">resource "type" "name"</code>. Creates infrastructure.</p>
                    <p><strong>Data Source:</strong> <code className="bg-slate-100 px-1 rounded">data "type" "name"</code>. Reads <em>existing</em> infrastructure.</p>
                    <p><strong>Terraform Block:</strong> Configures Terraform itself (required version, backend).</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Domain 4: CLI (Expanded) */}
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
               <p><strong>Root Module:</strong> The working directory where you run Terraform commands.</p>
               <p><strong>Child Module:</strong> A module called by another module.</p>
               <div className="bg-slate-900 p-4 rounded-lg text-xs font-mono text-indigo-300">
{`module "servers" {
  source = "./app-cluster" # Local path, Registry, or Git URL
  
  # Inputs (Variables defined in child module)
  instance_count = 5 
}

# Accessing Outputs from child module
output "ip" {
  value = module.servers.public_ip
}`}
               </div>
               <p><strong>Terraform Registry:</strong> Public repository for providers and modules. Syntax: <code className="bg-slate-100 px-1 rounded">namespace/name/provider</code>.</p>
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
              <h2 className="text-xl font-bold text-indigo-900">7. State Management</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm text-slate-700">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Why State?</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Maps configuration to real-world resources.</li>
                      <li>Tracks metadata (dependencies).</li>
                      <li>Performance (caches attribute values).</li>
                      <li>Syncing for collaboration.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Remote State</h3>
                    <p className="mb-2">Stored in S3, Azure Blob, Terraform Cloud.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Locking:</strong> Prevents concurrent writes (e.g., using DynamoDB for S3).</li>
                      <li><strong>Security:</strong> State contains sensitive data in plain text! Encrypt the bucket.</li>
                    </ul>
                  </div>
               </div>
               <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded border border-amber-100">
                 <strong>Important:</strong> Never commit <code className="font-mono text-xs">terraform.tfstate</code> to Git. Use <code className="font-mono text-xs">.gitignore</code>.
               </div>
            </div>
          </section>

          {/* Domain 8: Config */}
          <section className="overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <FileJson className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-indigo-900">8. Configuration & HCL</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-slate-900 p-4 rounded-lg text-xs font-mono text-indigo-300">
{`variable "region" {
  type    = string
  default = "us-west-1"
  validation { ... }
  sensitive = true
}

resource "aws_instance" "app" {
  count = 2 # Creates list: aws_instance.app[0], [1]
  # OR
  for_each = toset(["a", "b"]) # Map: aws_instance.app["a"]
}

locals {
  common_tags = { Project = "Demo" }
}`}
                 </div>
                 <div className="text-sm text-slate-700 space-y-2">
                   <p><strong>Variables:</strong> Input parameters. Can be set via ENV vars (<code className="text-xs">TF_VAR_name</code>), <code className="text-xs">terraform.tfvars</code>, CLI.</p>
                   
                   <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs mt-2">
                      <strong>Variable Types:</strong>
                      <ul className="grid grid-cols-2 gap-2 mt-1">
                         <li><span className="text-indigo-700 font-semibold">string</span>: "hello"</li>
                         <li><span className="text-indigo-700 font-semibold">number</span>: 42</li>
                         <li><span className="text-indigo-700 font-semibold">bool</span>: true/false</li>
                         <li><span className="text-indigo-700 font-semibold">list</span>: ["a", "b"]</li>
                         <li><span className="text-indigo-700 font-semibold">map</span>: {'{"k"="v"}'}</li>
                         <li><span className="text-indigo-700 font-semibold">object</span>: Complex struct</li>
                         <li><span className="text-indigo-700 font-semibold">tuple</span>: Fixed list types</li>
                         <li><span className="text-indigo-700 font-semibold">set</span>: Unique list</li>
                      </ul>
                   </div>

                   <p className="mt-2"><strong>Locals:</strong> Internal constants/helper functions used to Keep code DRY.</p>
                   <p><strong>Outputs:</strong> Return values to CLI or parent modules.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 9.1 Core Benefits */}
                <div className="space-y-4">
                   <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Key Features</h3>
                   <ul className="space-y-3">
                     <li className="flex gap-2 items-start">
                        <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-indigo-500"></div>
                        <div>
                          <strong>Remote State Management:</strong> State is stored securely in the cloud, encrypted at rest. No need to configure S3 buckets manually. History is versioned.
                        </div>
                     </li>
                     <li className="flex gap-2 items-start">
                        <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-indigo-500"></div>
                        <div>
                          <strong>Remote Execution:</strong> <code className="text-xs bg-slate-100 px-1 border rounded">terraform apply</code> runs on TFC's disposable VMs, not your laptop. Keeps secrets off local disks.
                        </div>
                     </li>
                     <li className="flex gap-2 items-start">
                         <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-indigo-500"></div>
                         <div>
                           <strong>Private Registry:</strong> Share modules and providers privately within your organization. 
                         </div>
                      </li>
                      <li className="flex gap-2 items-start">
                         <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-indigo-500"></div>
                         <div>
                           <strong>Cost Estimation:</strong> Shows estimated cost changes for AWS/Azure/GCP resources during the Plan phase.
                         </div>
                      </li>
                   </ul>
                </div>

                {/* 9.2 Workflows & Governance */}
                <div className="space-y-4">
                   <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Workflows & Governance</h3>
                   
                   <div className="bg-slate-50 p-3 rounded border border-slate-100 space-y-2">
                      <strong>3 Main Workflows:</strong>
                      <ul className="list-disc pl-4 text-xs space-y-1 text-slate-600">
                        <li><strong>UI/VCS-driven:</strong> Connect to GitHub/GitLab. Push to branch -&gt; Triggers Plan/Apply.</li>
                        <li><strong>CLI-driven:</strong> Run <code className="px-1">terraform apply</code> locally, streams logs from cloud runner.</li>
                        <li><strong>API-driven:</strong> Trigger runs via CI/CD (Jenkins, Actions) using TFC API.</li>
                      </ul>
                   </div>

                   <div className="bg-indigo-50 p-3 rounded border border-indigo-100 text-indigo-900">
                      <strong>Sentinel (Policy as Code):</strong>
                      <p className="text-xs mt-1 text-indigo-800">
                        Rules run between <em>Plan</em> and <em>Apply</em>.
                        <br/>
                        <strong>Hard Mandatory:</strong> Stops apply if failed.
                        <br/>
                        <strong>Soft Mandatory:</strong> Can override by admin.
                        <br/>
                        <strong>Advisory:</strong> Log warning only.
                      </p>
                   </div>
                   
                   <div className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                      <strong>Workspace Note:</strong> In CLI, workspaces are just separate state files. In TFC, a Workspace is a full environment containing State + Variables + Connectors + Run History.
                   </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};