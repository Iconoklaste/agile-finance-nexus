
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, Clock, PlayCircle, Ban, Filter, Plus, 
  MoreHorizontal, Search, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateMockProjects, formatDate, type Project } from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(generateMockProjects(10));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

  // Filter projects based on search term and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    // Get form values
    const projectName = formData.get("name") as string;
    
    // Create a new project
    const newProject: Project = {
      id: `project-${projects.length + 1}`,
      name: projectName,
      client: formData.get("client") as string,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      budget: Number(formData.get("budget")),
      spent: 0,
      progress: 0,
      status: "not-started",
      description: formData.get("description") as string,
      phases: []
    };
    
    // Add the new project to the list
    setProjects([...projects, newProject]);
    setIsNewProjectDialogOpen(false);
    
    // Show success message
    toast.success(`Projet "${projectName}" créé avec succès`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-blue-500 mr-1.5" />
            <span className="badge-blue">Terminé</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center">
            <PlayCircle className="h-4 w-4 text-orange-500 mr-1.5" />
            <span className="badge-orange">En cours</span>
          </div>
        );
      case 'on-hold':
        return (
          <div className="flex items-center">
            <Ban className="h-4 w-4 text-gray-500 mr-1.5" />
            <span className="badge-gray">En pause</span>
          </div>
        );
      case 'not-started':
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-1.5" />
            <span className="badge-gray">Non démarré</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-1.5" />
            <span className="badge-gray">Inconnu</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Projet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateProject}>
              <DialogHeader>
                <DialogTitle>Nouveau Projet</DialogTitle>
                <DialogDescription>
                  Créez un nouveau projet en remplissant les informations de base.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom du projet</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Ex: Refonte site web" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Input 
                    id="client" 
                    name="client" 
                    placeholder="Ex: Acme Inc." 
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget (€)</Label>
                    <Input 
                      id="budget" 
                      name="budget" 
                      type="number" 
                      min="0" 
                      placeholder="Ex: 10000" 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="not-started">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Non démarré</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="on-hold">En pause</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    name="description" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Description du projet..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsNewProjectDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer le projet</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="relative w-full md:w-96 flex items-center">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un projet ou client..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtrer par status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les status</SelectItem>
              <SelectItem value="not-started">Non démarré</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="on-hold">En pause</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects grid/list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}`)}>
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Archiver</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{project.client}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">Fin:</span>
                    </div>
                    <span>{formatDate(project.endDate)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Budget:</span>{' '}
                  <span className="font-medium">{project.budget.toLocaleString('fr-FR')}€</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                  Détails
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">Aucun projet trouvé</h3>
              <p className="text-muted-foreground mt-1">Ajustez vos filtres ou créez un nouveau projet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
