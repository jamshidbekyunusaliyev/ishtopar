export type JobType = "Full-time" | "Part-time" | "Remote" | "Internship";
export type JobLevel = "Beginner" | "Intermediate" | "Senior";

export type Job = {
  id: string;
  title: string;
  company: string;
  logo: string;
  color: string;
  category: string;
  location: string;
  type: JobType;
  level: JobLevel;
  salaryMin: number;
  salaryMax: number;
  postedDays: number;
  description: string;
  skills: string[];
  isUrgent?: boolean;
  isNew?: boolean;
};

export const jobCategories = ["Design", "Technology", "Marketing", "Business", "Customer service", "Finance"];
export const jobTypes: JobType[] = ["Full-time", "Part-time", "Remote", "Internship"];
export const jobLevels: JobLevel[] = ["Beginner", "Intermediate", "Senior"];

const companies = [
  { name: "Layers", logo: "L", color: "#7955d9" },
  { name: "Sisyphus", logo: "S", color: "#25243a" },
  { name: "Circooles", logo: "C", color: "#087e78" },
  { name: "Catalog", logo: "◈", color: "#df7744" },
  { name: "Quotient", logo: "Q", color: "#4354bc" },
];

const samples: Array<Omit<Job, "company" | "logo" | "color"> & { companyIndex: number }> = [
  { id: "product-designer-layers", title: "Product Designer", category: "Design", location: "New York, NY", type: "Full-time", level: "Intermediate", salaryMin: 95000, salaryMax: 125000, postedDays: 0, companyIndex: 0, description: "Shape thoughtful product experiences from the first sketch to the final interaction. You will work closely with product and engineering to make complex tools feel simple, useful, and human.", skills: ["Figma", "Product strategy", "Prototyping"] },
  { id: "frontend-engineer-sisyphus", title: "Senior Frontend Engineer", category: "Technology", location: "Remote", type: "Remote", level: "Senior", salaryMin: 135000, salaryMax: 175000, postedDays: 1, companyIndex: 1, description: "Build fast, accessible interfaces used by teams around the world. Partner with design and platform engineering to establish dependable patterns and ship polished product improvements.", skills: ["React", "TypeScript", "Accessibility"] },
  { id: "growth-marketer-circooles", title: "Growth Marketing Manager", category: "Marketing", location: "Austin, TX", type: "Full-time", level: "Intermediate", salaryMin: 85000, salaryMax: 115000, postedDays: 1, companyIndex: 2, description: "Own the experiments and campaigns that introduce a growing product to new audiences. You will connect customer insight, creative testing, and clear performance measurement.", skills: ["Campaigns", "Analytics", "Lifecycle"] },
  { id: "customer-success-catalog", title: "Customer Success Lead", category: "Customer service", location: "Chicago, IL", type: "Full-time", level: "Senior", salaryMin: 90000, salaryMax: 120000, postedDays: 2, companyIndex: 3, description: "Help customers get lasting value from a collaborative platform. Build trusted relationships, identify opportunities, and bring customer feedback back to the product team.", skills: ["Communication", "SaaS", "Onboarding"] },
  { id: "financial-analyst-quotient", title: "Financial Analyst", category: "Finance", location: "Boston, MA", type: "Full-time", level: "Intermediate", salaryMin: 78000, salaryMax: 102000, postedDays: 2, companyIndex: 4, description: "Turn financial data into clear decisions. Support planning, reporting, and forecasting while partnering with teams across the business.", skills: ["Forecasting", "Excel", "Reporting"] },
  { id: "visual-designer-circooles", title: "Visual Designer", category: "Design", location: "Remote", type: "Remote", level: "Beginner", salaryMin: 65000, salaryMax: 85000, postedDays: 3, companyIndex: 2, description: "Create expressive visual systems across digital campaigns and product launches. Bring curiosity, craft, and a strong eye for detail to a small creative team.", skills: ["Brand design", "Figma", "Illustration"] },
  { id: "backend-engineer-layers", title: "Backend Engineer", category: "Technology", location: "Seattle, WA", type: "Full-time", level: "Senior", salaryMin: 145000, salaryMax: 185000, postedDays: 3, companyIndex: 0, description: "Design robust services and APIs for a product with ambitious growth. Improve reliability and developer experience while shipping with a pragmatic team.", skills: ["Node.js", "PostgreSQL", "API design"] },
  { id: "content-strategist-catalog", title: "Content Strategist", category: "Marketing", location: "Denver, CO", type: "Part-time", level: "Intermediate", salaryMin: 52000, salaryMax: 72000, postedDays: 4, companyIndex: 3, description: "Give a clear voice to a useful product. Plan editorial work, collaborate with subject matter experts, and make complex ideas easy to understand.", skills: ["Writing", "SEO", "Editorial"] },
  { id: "business-operations-quotient", title: "Business Operations Associate", category: "Business", location: "New York, NY", type: "Full-time", level: "Beginner", salaryMin: 68000, salaryMax: 88000, postedDays: 4, companyIndex: 4, description: "Make the everyday systems behind a growing company work better. Bring structure to projects, surface useful insights, and help teams move forward.", skills: ["Operations", "Research", "Planning"] },
  { id: "ux-researcher-sisyphus", title: "UX Researcher", category: "Design", location: "Remote", type: "Remote", level: "Senior", salaryMin: 120000, salaryMax: 155000, postedDays: 5, companyIndex: 1, description: "Bring customer needs into product decisions through rigorous, approachable research. Plan studies, share clear findings, and help teams ask better questions.", skills: ["User interviews", "Research", "Synthesis"] },
  { id: "account-executive-layers", title: "Account Executive", category: "Business", location: "Atlanta, GA", type: "Full-time", level: "Intermediate", salaryMin: 80000, salaryMax: 130000, postedDays: 5, companyIndex: 0, description: "Guide prospective customers through a thoughtful buying journey. Build relationships, understand business needs, and help teams find the right fit.", skills: ["Sales", "Discovery", "CRM"] },
  { id: "people-partner-circooles", title: "People Operations Partner", category: "Business", location: "Portland, OR", type: "Full-time", level: "Senior", salaryMin: 98000, salaryMax: 128000, postedDays: 6, companyIndex: 2, description: "Help build a workplace where people can do their best work. Partner with managers on practical programs, thoughtful processes, and a great employee experience.", skills: ["People ops", "Coaching", "HR"] },
  { id: "marketing-intern-catalog", title: "Marketing Intern", category: "Marketing", location: "Chicago, IL", type: "Internship", level: "Beginner", salaryMin: 42000, salaryMax: 52000, postedDays: 6, companyIndex: 3, description: "Learn by doing with a kind, curious marketing team. Support research, content, and campaign operations while building a strong foundation.", skills: ["Research", "Content", "Curiosity"] },
  { id: "product-manager-quotient", title: "Product Manager", category: "Technology", location: "San Francisco, CA", type: "Full-time", level: "Senior", salaryMin: 150000, salaryMax: 195000, postedDays: 7, companyIndex: 4, description: "Set direction for a core product area and bring teams together around meaningful outcomes. Balance customer insight, business context, and delivery.", skills: ["Product", "Roadmapping", "Leadership"] },
  { id: "support-specialist-sisyphus", title: "Technical Support Specialist", category: "Customer service", location: "Remote", type: "Remote", level: "Beginner", salaryMin: 58000, salaryMax: 74000, postedDays: 8, companyIndex: 1, description: "Make every support interaction clear and helpful. Troubleshoot product questions, share useful patterns, and contribute to a growing knowledge base.", skills: ["Support", "Troubleshooting", "Writing"] },
  { id: "data-analyst-layers", title: "Data Analyst", category: "Technology", location: "Austin, TX", type: "Full-time", level: "Intermediate", salaryMin: 95000, salaryMax: 125000, postedDays: 9, companyIndex: 0, description: "Help teams make better decisions with clean, trustworthy data. Develop analyses and dashboards that make trends clear and actionable.", skills: ["SQL", "Python", "Visualization"] },
  { id: "brand-designer-quotient", title: "Brand Designer", category: "Design", location: "Los Angeles, CA", type: "Part-time", level: "Intermediate", salaryMin: 72000, salaryMax: 96000, postedDays: 10, companyIndex: 4, description: "Evolve a distinctive brand across product, campaigns, and community. Work across disciplines to make every touchpoint feel connected.", skills: ["Identity", "Typography", "Art direction"] },
  { id: "finance-intern-circooles", title: "Finance Intern", category: "Finance", location: "Boston, MA", type: "Internship", level: "Beginner", salaryMin: 40000, salaryMax: 50000, postedDays: 11, companyIndex: 2, description: "Join the finance team for a hands-on introduction to planning, analysis, and reporting. Bring care with details and a willingness to learn.", skills: ["Excel", "Analysis", "Communication"] },
  { id: "account-manager-catalog", title: "Customer Account Manager", category: "Customer service", location: "Remote", type: "Remote", level: "Intermediate", salaryMin: 78000, salaryMax: 105000, postedDays: 12, companyIndex: 3, description: "Be a reliable partner to customers after launch. Help teams reach their goals, keep communication thoughtful, and spot ways to improve.", skills: ["Relationships", "SaaS", "Communication"] },
  { id: "project-coordinator-sisyphus", title: "Project Coordinator", category: "Business", location: "Washington, DC", type: "Full-time", level: "Beginner", salaryMin: 62000, salaryMax: 82000, postedDays: 14, companyIndex: 1, description: "Keep cross-functional work organized and moving. Bring clarity to schedules, notes, and handoffs while learning from an experienced operations team.", skills: ["Coordination", "Planning", "Documentation"] },
];

export const jobs: Job[] = samples.map(({ companyIndex, ...job }) => {
  const company = companies[companyIndex];
  return { ...job, company: company.name, logo: company.logo, color: company.color };
});

export function getJob(id: string) {
  return jobs.find((job) => job.id === id);
}

export function formatSalary(min: number, max: number) {
  if (!min && !max) return "Competitive";
  const format = (value: number) => `$${Math.round(value / 1000)}k`;
  return `${format(min)} – ${format(max)}`;
}