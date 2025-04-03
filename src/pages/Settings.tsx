
import { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle2, LogOut, Save } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    project: true,
    system: false
  });
  
  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success('Profil mis à jour avec succès');
  };
  
  const handleSaveCompany = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success('Informations entreprise mises à jour');
  };
  
  const handleSaveNotifications = () => {
    toast.success('Préférences de notifications mises à jour');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle>Profil Utilisateur</CardTitle>
                <CardDescription>
                  Gérer vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <span className="text-3xl font-medium text-muted-foreground">JD</span>
                      </div>
                      <div className="absolute bottom-0 right-0">
                        <Button size="sm" variant="outline" className="h-8 w-8 rounded-full p-0">
                          <span className="sr-only">Modifier photo</span>
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" defaultValue="Jean Dupont" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Adresse email</Label>
                      <Input id="email" defaultValue="jean@example.com" type="email" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" defaultValue="01 23 45 67 89" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="role">Rôle</Label>
                      <Input id="role" defaultValue="Chef de projet" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Biographie</Label>
                    <textarea
                      id="bio"
                      rows={3}
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="Chef de projet avec 5 ans d'expérience en gestion de projets digitaux."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les modifications
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Company Tab */}
        <TabsContent value="company">
          <Card>
            <form onSubmit={handleSaveCompany}>
              <CardHeader>
                <CardTitle>Informations Entreprise</CardTitle>
                <CardDescription>
                  Gérer les informations de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input id="company-name" defaultValue="Acme Inc." />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company-website">Site web</Label>
                    <Input id="company-website" defaultValue="https://www.example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company-address">Adresse</Label>
                    <Input id="company-address" defaultValue="123 Rue de Paris" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company-city">Ville</Label>
                    <Input id="company-city" defaultValue="Paris" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company-postal">Code postal</Label>
                    <Input id="company-postal" defaultValue="75000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company-country">Pays</Label>
                    <Select defaultValue="FR">
                      <SelectTrigger id="company-country">
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="BE">Belgique</SelectItem>
                        <SelectItem value="CH">Suisse</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company-vat">Numéro TVA</Label>
                  <Input id="company-vat" defaultValue="FR12345678901" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company-description">Description</Label>
                  <textarea
                    id="company-description"
                    rows={3}
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Entreprise spécialisée dans le développement de solutions digitales."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les informations
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Configurez quand et comment vous recevez des notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">
                      Recevez des mises à jour par email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, email: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications navigateur</p>
                    <p className="text-sm text-muted-foreground">
                      Recevez des notifications dans votre navigateur
                    </p>
                  </div>
                  <Switch
                    checked={notifications.browser}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, browser: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mises à jour de projet</p>
                    <p className="text-sm text-muted-foreground">
                      Soyez notifié des changements dans vos projets
                    </p>
                  </div>
                  <Switch
                    checked={notifications.project}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, project: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Annonces système</p>
                    <p className="text-sm text-muted-foreground">
                      Recevez des annonces et mises à jour système
                    </p>
                  </div>
                  <Switch
                    checked={notifications.system}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, system: checked})
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Enregistrer les préférences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'interface de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="theme">Thème</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="density">Densité d'affichage</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger id="density">
                    <SelectValue placeholder="Sélectionner une densité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Confortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="language">Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('Apparence mise à jour')}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les préférences
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Session</CardTitle>
                <CardDescription>Gérer votre session</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => toast.info('Déconnexion en cours...')}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
