
import { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, BarChart, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Line, Bar 
} from 'recharts';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, generateMockTransactions } from '@/lib/mock-data';
import { toast } from 'sonner';
import { ArrowUpRight, Download, Filter, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Financial data for charts
const financialData = [
  { mois: 'Jan', revenus: 28000, dépenses: 22400, bénéfices: 5600 },
  { mois: 'Fév', revenus: 30000, dépenses: 21398, bénéfices: 8602 },
  { mois: 'Mar', revenus: 42000, dépenses: 38800, bénéfices: 3200 },
  { mois: 'Avr', revenus: 35780, dépenses: 30908, bénéfices: 4872 },
  { mois: 'Mai', revenus: 31890, dépenses: 24800, bénéfices: 7090 },
  { mois: 'Jun', revenus: 32390, dépenses: 23800, bénéfices: 8590 },
];

const categoryData = [
  { nom: 'Salaires', montant: 48000, pourcentage: 30 },
  { nom: 'Marketing', montant: 32000, pourcentage: 20 },
  { nom: 'Loyer', montant: 24000, pourcentage: 15 },
  { nom: 'Services', montant: 19200, pourcentage: 12 },
  { nom: 'Équipement', montant: 16000, pourcentage: 10 },
  { nom: 'Divers', montant: 20800, pourcentage: 13 },
];

const Accounting = () => {
  const [transactions, setTransactions] = useState(generateMockTransactions(20));
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isNewTransactionDialogOpen, setIsNewTransactionDialogOpen] = useState(false);
  
  // Filter transactions based on search term and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleCreateTransaction = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    // Get form values
    const description = formData.get("description") as string;
    const amount = Number(formData.get("amount"));
    const type = formData.get("type") as 'income' | 'expense';
    const category = formData.get("category") as string;
    
    // Create a new transaction
    const newTransaction = {
      id: `transaction-${transactions.length + 1}`,
      date: new Date(),
      description,
      amount,
      type,
      category,
      project: formData.get("project") as string || undefined
    };
    
    // Add the new transaction to the list
    setTransactions([newTransaction, ...transactions]);
    setIsNewTransactionDialogOpen(false);
    
    // Show success message
    toast.success(`Transaction "${description}" ajoutée avec succès`);
  };
  
  // Get unique categories
  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;
  
  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Comptabilité</h1>
        <Dialog open={isNewTransactionDialogOpen} onOpenChange={setIsNewTransactionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateTransaction}>
              <DialogHeader>
                <DialogTitle>Nouvelle Transaction</DialogTitle>
                <DialogDescription>
                  Ajoutez une nouvelle transaction à votre comptabilité.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    name="description" 
                    placeholder="Ex: Paiement facture client" 
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Montant (€)</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number" 
                      placeholder="Ex: 1000" 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue="income">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Revenu</SelectItem>
                        <SelectItem value="expense">Dépense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select name="category" defaultValue="Ventes">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ventes">Ventes</SelectItem>
                      <SelectItem value="Salaires">Salaires</SelectItem>
                      <SelectItem value="Loyer">Loyer</SelectItem>
                      <SelectItem value="Équipement">Équipement</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project">Projet (optionnel)</Label>
                  <Input 
                    id="project" 
                    name="project" 
                    placeholder="Ex: Projet 1" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsNewTransactionDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer la transaction</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Total Revenus</p>
              <div className="mt-2 flex items-baseline">
                <h3 className="text-3xl font-semibold text-green-600">
                  {totalIncome.toLocaleString('fr-FR')}€
                </h3>
                <p className="ml-2 text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> 8%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Total Dépenses</p>
              <div className="mt-2 flex items-baseline">
                <h3 className="text-3xl font-semibold text-red-600">
                  {totalExpense.toLocaleString('fr-FR')}€
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <div className="mt-2 flex items-baseline">
                <h3 className={cn(
                  "text-3xl font-semibold",
                  balance >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {balance.toLocaleString('fr-FR')}€
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        
        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu Financier</CardTitle>
                <CardDescription>Revenus, dépenses et bénéfices mensuels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenus" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dépenses" 
                      stroke="#F97316" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bénéfices" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Dépenses</CardTitle>
                <CardDescription>Par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="montant" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Dernier état financier</CardTitle>
              <CardDescription>Résumé des derniers mouvements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Pourcentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryData.map((category) => (
                    <TableRow key={category.nom}>
                      <TableCell className="font-medium">{category.nom}</TableCell>
                      <TableCell>{category.montant.toLocaleString('fr-FR')}€</TableCell>
                      <TableCell>{category.pourcentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Transactions tab */}
        <TabsContent value="transactions" className="space-y-4">
          {/* Search and filter bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            <div className="relative w-full md:w-96 flex items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une transaction..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Catégorie</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Transactions table */}
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
                  {filteredTransactions.map((transaction) => (
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
        </TabsContent>
        
        {/* Reports tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Report cards */}
            {[
              { title: 'Compte de résultat', description: 'Revenus et dépenses' },
              { title: 'Bilan comptable', description: 'Actifs et passifs' },
              { title: 'Flux de trésorerie', description: 'Entrées et sorties' },
              { title: 'Rapport TVA', description: 'Déclaration trimestrielle' },
              { title: 'Journal des transactions', description: 'Liste chronologique' },
              { title: 'Grand livre', description: 'Comptes et soldes' }
            ].map((report, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-6 flex flex-col min-h-[150px]">
                  <h3 className="text-lg font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Dernier: 01/06/2025</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => toast.success(`Génération de "${report.title}" en cours`)}
                    >
                      <Download className="mr-1 h-3.5 w-3.5" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounting;
