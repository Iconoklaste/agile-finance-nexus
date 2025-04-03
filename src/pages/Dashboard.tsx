
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "recharts";
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateMockProjects, generateMockTransactions, formatDate } from "@/lib/mock-data";
import { Activity, ArrowUpRight, Ban, Calendar, CheckCircle2, Clock, CreditCard, DollarSign, MoreHorizontal, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const projects = generateMockProjects(5);
  const transactions = generateMockTransactions(8);
  
  // Financial data for charts
  const financialData = [
    { name: 'Jan', revenus: 4000, dépenses: 2400 },
    { name: 'Fév', revenus: 3000, dépenses: 1398 },
    { name: 'Mar', revenus: 2000, dépenses: 9800 },
    { name: 'Avr', revenus: 2780, dépenses: 3908 },
    { name: 'Mai', revenus: 1890, dépenses: 4800 },
    { name: 'Jun', revenus: 2390, dépenses: 3800 },
  ];

  const projectProgressData = projects.map(project => ({
    name: project.name,
    progression: project.progress,
    budget: project.budget / 1000, // Convert to thousands for display
    dépensé: project.spent / 1000,
  }));

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-blue';
      case 'in-progress':
        return 'badge-orange';
      case 'on-hold':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4 text-orange-500" />;
      case 'on-hold':
        return <Ban className="h-4 w-4 text-gray-500" />;
      case 'not-started':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <MoreHorizontal className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Projets Actifs</p>
              <FolderIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline">
              <h3 className="text-3xl font-semibold">
                {projects.filter(p => p.status === 'in-progress').length}
              </h3>
              <p className="ml-2 text-sm text-muted-foreground">
                sur {projects.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Revenus du mois</p>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline">
              <h3 className="text-3xl font-semibold">24,500€</h3>
              <p className="ml-2 text-sm text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 12%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Transactions</p>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline">
              <h3 className="text-3xl font-semibold">{transactions.length}</h3>
              <p className="ml-2 text-sm text-muted-foreground">
                ce mois-ci
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Prochaine échéance</p>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold truncate">Jalon Projet 3</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date(new Date().setDate(new Date().getDate() + 5)), 'dd MMM')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu Financier</CardTitle>
            <CardDescription>Revenus et dépenses des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenus" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="dépenses" 
                  stroke="#F97316" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progression des Projets</CardTitle>
            <CardDescription>Budget et dépenses (k€)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#3B82F6" />
                <Bar dataKey="dépensé" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projects and Transactions */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projets Récents</TabsTrigger>
          <TabsTrigger value="transactions">Dernières Transactions</TabsTrigger>
        </TabsList>
        
        {/* Projects tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Projet</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Fin</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.slice(0, 5).map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <span className={cn(getStatusBadgeClass(project.status))}>
                            {project.status === 'completed' && 'Terminé'}
                            {project.status === 'in-progress' && 'En cours'}
                            {project.status === 'on-hold' && 'En pause'}
                            {project.status === 'not-started' && 'Non démarré'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(project.endDate)}</TableCell>
                      <TableCell className="text-right">{project.budget.toLocaleString('fr-FR')}€</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/projects')}
            >
              Voir tous les projets
            </Button>
          </div>
        </TabsContent>
        
        {/* Transactions tab */}
        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        {transaction.project ? 
                          `Projet ${transaction.project.split('-')[1]}` : 
                          '—'}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        transaction.type === 'income' ? "text-green-600" : "text-red-600"
                      )}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {transaction.amount.toLocaleString('fr-FR')}€
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/accounting')}
            >
              Voir toutes les transactions
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Simple folder icon component
const FolderIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
  </svg>
);

export default Dashboard;
