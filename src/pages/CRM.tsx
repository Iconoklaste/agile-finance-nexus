
import { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
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
import { generateMockClients, Client, generateMockProjects } from '@/lib/mock-data';
import { Edit, Mail, MoreHorizontal, Phone, Plus, Search, User } from 'lucide-react';
import { toast } from 'sonner';

const CRM = () => {
  const [clients, setClients] = useState<Client[]>(generateMockClients(10));
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const projects = generateMockProjects(5);
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateClient = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    // Get form values
    const name = formData.get("name") as string;
    
    // Create a new client
    const newClient: Client = {
      id: `client-${clients.length + 1}`,
      name,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      address: formData.get("address") as string,
      projects: []
    };
    
    // Add the new client to the list
    setClients([newClient, ...clients]);
    setIsNewClientDialogOpen(false);
    
    // Show success message
    toast.success(`Client "${name}" ajouté avec succès`);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
        <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateClient}>
              <DialogHeader>
                <DialogTitle>Nouveau Client</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau client à votre portefeuille.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Jean Dupont" 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Société</Label>
                    <Input 
                      id="company" 
                      name="company" 
                      placeholder="Acme Inc." 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="jean@example.com" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="01 23 45 67 89" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    placeholder="123 Rue de Paris, 75000 Paris" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsNewClientDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer le client</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search bar */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un client..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Liste des Clients</TabsTrigger>
          <TabsTrigger value="contacts">Contacts Récents</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        {/* Clients tab */}
        <TabsContent value="clients">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Options</span>
                    </Button>
                  </div>
                  <CardDescription>{client.company}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                    <div className="mt-3 text-sm">
                      <span className="text-muted-foreground">Projets: </span>
                      <span className="font-medium">{client.projects.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Gérer
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredClients.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <User className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Aucun client trouvé</h3>
                  <p className="text-muted-foreground mt-1">
                    Aucun client ne correspond à votre recherche.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Contacts tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Dernières interactions</CardTitle>
              <CardDescription>Contacts récents avec vos clients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.slice(0, 5).map((client, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{index % 2 === 0 ? 'Email' : 'Téléphone'}</TableCell>
                      <TableCell>{new Date().toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        Discussion concernant le projet en cours et prochaines étapes
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents clients</CardTitle>
              <CardDescription>Fichiers partagés et documents importants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Cette section vous permettra bientôt de gérer tous les documents liés à vos clients.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => toast.info('Fonctionnalité en cours de développement')}
                >
                  Explorer les documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;
