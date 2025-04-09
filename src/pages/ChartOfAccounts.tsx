
import { useState, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  ArrowUpDown,
  Euro
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { 
  generateMockAccounts, 
  generateMockAccountClasses, 
  Account, 
  AccountClass 
} from "@/lib/mock-data";

export default function ChartOfAccounts() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(generateMockAccounts());
  const accountClasses = useMemo(() => generateMockAccountClasses(), []);
  
  const form = useForm<Account>({
    defaultValues: {
      id: "",
      code: "",
      name: "",
      classId: "",
      description: "",
      balance: 0,
      isActive: true
    }
  });

  // Filter accounts based on search query
  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return accounts;
    const query = searchQuery.toLowerCase();
    return accounts.filter(
      account => 
        account.code.toLowerCase().includes(query) || 
        account.name.toLowerCase().includes(query) ||
        getClassName(account.classId)?.toLowerCase().includes(query)
    );
  }, [accounts, searchQuery]);

  // Get class name by class ID
  const getClassName = (classId: string): string => {
    const accountClass = accountClasses.find(cls => cls.id === classId);
    return accountClass ? `${accountClass.code}. ${accountClass.name}` : "";
  };

  // Handle account activation/deactivation
  const toggleAccountStatus = (account: Account) => {
    setAccounts(accounts.map(acc => 
      acc.id === account.id ? { ...acc, isActive: !acc.isActive } : acc
    ));
    
    toast({
      title: account.isActive ? "Compte désactivé" : "Compte activé",
      description: `Le compte ${account.code} - ${account.name} a été ${account.isActive ? "désactivé" : "activé"}.`,
    });
  };

  // Handle account deletion
  const deleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
    
    toast({
      title: "Compte supprimé",
      description: "Le compte a été supprimé avec succès.",
    });
  };

  // Open edit dialog
  const openEditDialog = (account: Account) => {
    setIsEditing(true);
    setCurrentAccount(account);
    form.reset(account);
  };

  // Open new account dialog
  const openNewAccountDialog = () => {
    setIsEditing(false);
    setCurrentAccount(null);
    form.reset({
      id: `account-${Date.now()}`,
      code: "",
      name: "",
      classId: "",
      description: "",
      balance: 0,
      isActive: true
    });
  };

  // Handle form submission
  const onSubmit = (data: Account) => {
    if (isEditing && currentAccount) {
      // Update existing account
      setAccounts(accounts.map(acc => 
        acc.id === currentAccount.id ? data : acc
      ));
      
      toast({
        title: "Compte mis à jour",
        description: `Le compte ${data.code} - ${data.name} a été mis à jour.`,
      });
    } else {
      // Add new account
      setAccounts([...accounts, data]);
      
      toast({
        title: "Compte créé",
        description: `Le compte ${data.code} - ${data.name} a été créé.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Plan Comptable</h1>
        
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un compte..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={openNewAccountDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau Compte
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Modifier un compte" : "Créer un nouveau compte"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? "Modifiez les informations du compte ci-dessous." 
                    : "Remplissez les informations pour créer un nouveau compte."}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de compte</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classe</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une classe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {accountClasses.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  {cls.code}. {cls.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intitulé</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du compte" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description du compte"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solde initial</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                            <Euro className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Compte actif</FormLabel>
                          <FormDescription>
                            Les comptes inactifs n'apparaîtront pas dans les listes de sélection.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">
                      {isEditing ? "Enregistrer les modifications" : "Créer le compte"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous les comptes</TabsTrigger>
          <TabsTrigger value="active">Comptes actifs</TabsTrigger>
          <TabsTrigger value="inactive">Comptes inactifs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <AccountsTable 
            accounts={filteredAccounts} 
            accountClasses={accountClasses}
            onToggleStatus={toggleAccountStatus}
            onEditAccount={openEditDialog}
            onDeleteAccount={deleteAccount}
          />
        </TabsContent>
        
        <TabsContent value="active">
          <AccountsTable 
            accounts={filteredAccounts.filter(acc => acc.isActive)} 
            accountClasses={accountClasses}
            onToggleStatus={toggleAccountStatus}
            onEditAccount={openEditDialog}
            onDeleteAccount={deleteAccount}
          />
        </TabsContent>
        
        <TabsContent value="inactive">
          <AccountsTable 
            accounts={filteredAccounts.filter(acc => !acc.isActive)} 
            accountClasses={accountClasses}
            onToggleStatus={toggleAccountStatus}
            onEditAccount={openEditDialog}
            onDeleteAccount={deleteAccount}
          />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {accountClasses.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{cls.code}. {cls.name}</span>
                <span className="text-muted-foreground text-sm">
                  {accounts.filter(acc => acc.classId === cls.id).length} comptes
                </span>
              </CardTitle>
              <CardDescription>{cls.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {accounts
                  .filter(acc => acc.classId === cls.id)
                  .slice(0, 5)
                  .map(account => (
                    <li key={account.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{account.code}</span>
                      <span className="flex-1 px-2 truncate">{account.name}</span>
                      <span className="text-muted-foreground">
                        {account.balance.toLocaleString()} €
                      </span>
                    </li>
                  ))}
                {accounts.filter(acc => acc.classId === cls.id).length > 5 && (
                  <li className="text-center text-sm text-muted-foreground pt-1">
                    + {accounts.filter(acc => acc.classId === cls.id).length - 5} autres comptes
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Table component for displaying accounts
function AccountsTable({ 
  accounts, 
  accountClasses,
  onToggleStatus,
  onEditAccount,
  onDeleteAccount
}: { 
  accounts: Account[], 
  accountClasses: AccountClass[]
  onToggleStatus: (account: Account) => void,
  onEditAccount: (account: Account) => void,
  onDeleteAccount: (accountId: string) => void
}) {
  // Get class name by class ID
  const getClassName = (classId: string): string => {
    const accountClass = accountClasses.find(cls => cls.id === classId);
    return accountClass ? `${accountClass.code}. ${accountClass.name}` : "";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableCaption>Liste des comptes du plan comptable</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="max-w-[250px]">Intitulé</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead className="text-right">Solde</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  Aucun compte trouvé
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.code}</TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {account.name}
                  </TableCell>
                  <TableCell>{getClassName(account.classId)}</TableCell>
                  <TableCell className="text-right">
                    {account.balance.toLocaleString()} €
                  </TableCell>
                  <TableCell className="text-center">
                    {account.isActive ? (
                      <span className="inline-flex items-center text-green-600">
                        <ToggleRight className="h-4 w-4 mr-1" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-400">
                        <ToggleLeft className="h-4 w-4 mr-1" />
                        Inactif
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(account)}
                      >
                        {account.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditAccount(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
