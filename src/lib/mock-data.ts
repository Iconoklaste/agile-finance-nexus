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

// Milestone type
export interface Milestone {
  id: string;
  name: string;
  completed: boolean;
}

// Project phase type
export type ProjectPhase = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: ProjectStatus;
  milestones?: Milestone[]; // Add the milestones property
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

// Account type for chart of accounts
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

// Account class type
export type AccountClass = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  description?: string;
};

// Account in chart of accounts
export type Account = {
  id: string;
  code: string;
  name: string;
  classId: string;
  description?: string;
  balance: number;
  isActive: boolean;
  parentId?: string;
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

// Generate mock account classes for chart of accounts
export const generateMockAccountClasses = (): AccountClass[] => {
  return [
    {
      id: 'class-1',
      code: '1',
      name: 'Comptes de capitaux',
      type: 'asset',
      description: 'Capital, réserves, emprunts, provisions'
    },
    {
      id: 'class-2',
      code: '2',
      name: 'Comptes d\'immobilisations',
      type: 'asset',
      description: 'Actifs durables détenus par l\'entreprise'
    },
    {
      id: 'class-3',
      code: '3',
      name: 'Comptes de stocks et en-cours',
      type: 'asset',
      description: 'Biens et services produits ou acquis par l\'entreprise'
    },
    {
      id: 'class-4',
      code: '4',
      name: 'Comptes de tiers',
      type: 'asset',
      description: 'Créances et dettes de l\'entreprise'
    },
    {
      id: 'class-5',
      code: '5',
      name: 'Comptes financiers',
      type: 'asset',
      description: 'Opérations financières à court terme'
    },
    {
      id: 'class-6',
      code: '6',
      name: 'Comptes de charges',
      type: 'expense',
      description: 'Charges d\'exploitation de l\'entreprise'
    },
    {
      id: 'class-7',
      code: '7',
      name: 'Comptes de produits',
      type: 'revenue',
      description: 'Produits d\'exploitation de l\'entreprise'
    },
  ];
};

// Generate mock accounts for chart of accounts
export const generateMockAccounts = (): Account[] => {
  return [
    // Classe 1
    {
      id: 'account-101',
      code: '101',
      name: 'Capital',
      classId: 'class-1',
      description: 'Capital social',
      balance: 100000,
      isActive: true
    },
    {
      id: 'account-106',
      code: '106',
      name: 'Réserves',
      classId: 'class-1',
      description: 'Réserves légales et statutaires',
      balance: 20000,
      isActive: true
    },
    {
      id: 'account-164',
      code: '164',
      name: 'Emprunts auprès des établissements de crédit',
      classId: 'class-1',
      description: 'Prêts bancaires',
      balance: 50000,
      isActive: true
    },

    // Classe 2
    {
      id: 'account-211',
      code: '211',
      name: 'Terrains',
      classId: 'class-2',
      description: 'Terrains nus, aménagés, sous-sol et sur-sol',
      balance: 75000,
      isActive: true
    },
    {
      id: 'account-213',
      code: '213',
      name: 'Constructions',
      classId: 'class-2',
      description: 'Bâtiments, installations générales, agencements',
      balance: 200000,
      isActive: true
    },
    {
      id: 'account-215',
      code: '215',
      name: 'Installations techniques, matériel et outillage',
      classId: 'class-2',
      description: 'Équipements spécifiques à l\'activité',
      balance: 80000,
      isActive: true
    },

    // Classe 6
    {
      id: 'account-601',
      code: '601',
      name: 'Achats de matières premières',
      classId: 'class-6',
      description: 'Achats de biens entrant dans le cycle de production',
      balance: 35000,
      isActive: true
    },
    {
      id: 'account-607',
      code: '607',
      name: 'Achats de marchandises',
      classId: 'class-6',
      description: 'Achats de biens destinés à être revendus en l\'état',
      balance: 45000,
      isActive: true
    },
    {
      id: 'account-613',
      code: '613',
      name: 'Locations',
      classId: 'class-6',
      description: 'Loyers et charges locatives',
      balance: 12000,
      isActive: true
    },
    {
      id: 'account-641',
      code: '641',
      name: 'Rémunérations du personnel',
      classId: 'class-6',
      description: 'Salaires et appointements',
      balance: 120000,
      isActive: true
    },

    // Classe 7
    {
      id: 'account-701',
      code: '701',
      name: 'Ventes de produits finis',
      classId: 'class-7',
      description: 'Ventes de biens produits par l\'entreprise',
      balance: 180000,
      isActive: true
    },
    {
      id: 'account-707',
      code: '707',
      name: 'Ventes de marchandises',
      classId: 'class-7',
      description: 'Ventes de biens achetés et revendus en l\'état',
      balance: 120000,
      isActive: true
    },
    {
      id: 'account-706',
      code: '706',
      name: 'Prestations de services',
      classId: 'class-7',
      description: 'Ventes de travaux et services',
      balance: 95000,
      isActive: true
    },
  ];
};
