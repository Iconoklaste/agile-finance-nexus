
import { subDays, addDays, format } from "date-fns";
import { fr } from "date-fns/locale";

// Generate random date between start and end
export const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Format date to French locale
export const formatDate = (date: Date, formatStr: string = 'dd MMM yyyy') => {
  return format(date, formatStr, { locale: fr });
};

// Status types for projects
export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed';

// Project phase type
export type ProjectPhase = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: ProjectStatus;
};

// Project type
export type Project = {
  id: string;
  name: string;
  client: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  progress: number;
  status: ProjectStatus;
  description: string;
  phases: ProjectPhase[];
};

// Transaction type
export type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  project?: string;
};

// Client type
export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  projects: string[];
};

// Generate mock projects
export const generateMockProjects = (count: number = 5): Project[] => {
  const today = new Date();
  const projectStatuses: ProjectStatus[] = ['not-started', 'in-progress', 'on-hold', 'completed'];
  
  return Array.from({ length: count }, (_, i) => {
    const startDate = subDays(today, Math.floor(Math.random() * 90));
    const endDate = addDays(startDate, Math.floor(Math.random() * 180) + 30);
    const status = projectStatuses[Math.floor(Math.random() * projectStatuses.length)];
    const progress = status === 'completed' ? 100 : Math.floor(Math.random() * 100);
    const budget = Math.floor(Math.random() * 100000) + 5000;
    const spent = Math.floor(budget * (progress / 100));
    
    // Generate phases for project
    const phaseCount = Math.floor(Math.random() * 3) + 2; // 2-4 phases
    const phaseDuration = (endDate.getTime() - startDate.getTime()) / phaseCount;
    
    const phases: ProjectPhase[] = Array.from({ length: phaseCount }, (_, j) => {
      const phaseStart = new Date(startDate.getTime() + j * phaseDuration);
      const phaseEnd = new Date(phaseStart.getTime() + phaseDuration);
      const phaseProgress = j === 0 ? Math.min(100, progress * 2) : 
                           j < Math.floor(progress / 25) ? 100 : 
                           j === Math.floor(progress / 25) ? (progress % 25) * 4 : 0;
      
      return {
        id: `phase-${i}-${j}`,
        name: `Phase ${j + 1}`,
        startDate: phaseStart,
        endDate: phaseEnd,
        progress: phaseProgress,
        status: phaseProgress >= 100 ? 'completed' : 
                phaseProgress > 0 ? 'in-progress' : 
                'not-started'
      };
    });
    
    return {
      id: `project-${i}`,
      name: `Projet ${i + 1}`,
      client: `Client ${i % 3 + 1}`,
      startDate,
      endDate,
      budget,
      spent,
      progress,
      status,
      description: `Description détaillée du projet ${i + 1}. Ce projet comprend plusieurs phases et jalons.`,
      phases
    };
  });
};

// Generate mock transactions
export const generateMockTransactions = (count: number = 20): Transaction[] => {
  const today = new Date();
  const categories = ['Salaires', 'Loyer', 'Équipement', 'Marketing', 'Services', 'Ventes'];
  const types: ('income' | 'expense')[] = ['income', 'expense'];
  
  return Array.from({ length: count }, (_, i) => {
    const date = subDays(today, Math.floor(Math.random() * 90));
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(Math.random() * 5000) + 100;
    
    return {
      id: `transaction-${i}`,
      date,
      description: `Transaction ${i + 1}`,
      amount,
      type,
      category: categories[Math.floor(Math.random() * categories.length)],
      project: Math.random() > 0.5 ? `project-${Math.floor(Math.random() * 5)}` : undefined
    };
  });
};

// Generate mock clients
export const generateMockClients = (count: number = 10): Client[] => {
  return Array.from({ length: count }, (_, i) => {
    return {
      id: `client-${i}`,
      name: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      phone: `01 23 45 67 ${i < 9 ? '0' + (i + 1) : i + 1}`,
      company: `Société ${i + 1}`,
      address: `${Math.floor(Math.random() * 100) + 1} Rue de Paris, 75000 Paris`,
      projects: Array.from(
        { length: Math.floor(Math.random() * 3) }, 
        (_, j) => `project-${(i + j) % 5}`
      )
    };
  });
};
