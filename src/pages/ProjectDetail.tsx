
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate, generateMockProjects, type ProjectPhase } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, Calendar, CheckCircle2, Clock, 
  CreditCard, Download, Edit, FileText, PlayCircle, 
  Plus, Ban, Trash2, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import GanttChart from '@/components/projects/GanttChart';

// Milestone interface
interface Milestone {
  id: string;
  name: string;
  completed: boolean;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch project data based on id (using mock data for now)
  const projects = generateMockProjects(10);
  const [project, setProject] = useState(projects.find(p => p.id === id));
  
  // State for dialog management
  const [isNewPhaseDialogOpen, setIsNewPhaseDialogOpen] = useState(false);
  const [isNewMilestoneDialogOpen, setIsNewMilestoneDialogOpen] = useState(false);
  const [currentPhaseId, setCurrentPhaseId] = useState<string | null>(null);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  
  useEffect(() => {
    // Add milestones to each phase if they don't exist
    if (project) {
      const phasesWithMilestones = project.phases.map(phase => {
        if (!phase.milestones) {
          // Generate random milestones (1-5) for demonstration
          const milestoneCount = Math.floor(Math.random() * 5) + 1;
          const milestones = Array.from({ length: milestoneCount }, (_, i) => ({
            id: `milestone-${phase.id}-${i}`,
            name: `Jalon ${i + 1} de ${phase.name}`,
            completed: Math.random() > 0.5 // Randomly mark some as completed
          }));
          
          return {
            ...phase,
            milestones
          };
        }
        return phase;
      });
      
      setProject(prevProject => {
        if (!prevProject) return null;
        return {
          ...prevProject,
          phases: phasesWithMilestones
        };
      });
    }
  }, []);
  
  useEffect(() => {
    // Update project progress based on all milestones
    if (project) {
      let totalMilestones = 0;
      let completedMilestones = 0;
      
      project.phases.forEach(phase => {
        if (phase.milestones && phase.milestones.length > 0) {
          totalMilestones += phase.milestones.length;
          completedMilestones += phase.milestones.filter(m => m.completed).length;
        }
      });
      
      const newOverallProgress = totalMilestones > 0 
        ? Math.round((completedMilestones / totalMilestones) * 100) 
        : 0;
      
      setProject(prevProject => {
        if (!prevProject) return null;
        return {
          ...prevProject,
          progress: newOverallProgress
        };
      });
    }
  }, [project?.phases]);
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Projet non trouvé</h2>
        <p className="text-muted-foreground mb-6">Le projet que vous recherchez n'existe pas.</p>
        <Button onClick={() => navigate('/app/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux projets
        </Button>
      </div>
    );
  }
  
  // Get status text and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          text: 'Terminé',
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          icon: <CheckCircle2 className="h-4 w-4 text-blue-500" />
        };
      case 'in-progress':
        return { 
          text: 'En cours',
          color: 'text-orange-500',
          bgColor: 'bg-orange-100',
          icon: <PlayCircle className="h-4 w-4 text-orange-500" />
        };
      case 'on-hold':
        return { 
          text: 'En pause',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: <Ban className="h-4 w-4 text-gray-500" />
        };
      case 'not-started':
        return {
          text: 'Non démarré',
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          icon: <Clock className="h-4 w-4 text-gray-400" />
        };
      default:
        return {
          text: 'Inconnu',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: <Clock className="h-4 w-4 text-gray-400" />
        };
    }
  };

  const handleCreatePhase = (event: React.FormEvent) => {
    event.preventDefault();
    
    // This would normally update the backend, for now just show a toast
    toast.success("Nouvelle phase créée avec succès");
    setIsNewPhaseDialogOpen(false);
  };
  
  const handleCreateMilestone = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (currentPhaseId && newMilestoneName.trim()) {
      setProject(prevProject => {
        if (!prevProject) return null;
        
        const updatedPhases = prevProject.phases.map(phase => {
          if (phase.id === currentPhaseId) {
            const milestones = phase.milestones || [];
            return {
              ...phase,
              milestones: [
                ...milestones,
                {
                  id: `milestone-${phase.id}-${milestones.length}`,
                  name: newMilestoneName,
                  completed: false
                }
              ]
            };
          }
          return phase;
        });
        
        return {
          ...prevProject,
          phases: updatedPhases
        };
      });
      
      toast.success("Nouveau jalon ajouté avec succès");
      setIsNewMilestoneDialogOpen(false);
      setNewMilestoneName('');
    }
  };
  
  const toggleMilestone = (phaseId: string, milestoneId: string) => {
    setProject(prevProject => {
      if (!prevProject) return null;
      
      const updatedPhases = prevProject.phases.map(phase => {
        if (phase.id === phaseId && phase.milestones) {
          const updatedMilestones = phase.milestones.map(milestone => {
            if (milestone.id === milestoneId) {
              return {
                ...milestone,
                completed: !milestone.completed
              };
            }
            return milestone;
          });
          
          // Calculate new progress for the phase
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          const totalCount = updatedMilestones.length;
          const newProgress = Math.round((completedCount / totalCount) * 100);
          
          // Determine phase status based on milestones
          let newStatus = phase.status;
          if (completedCount === 0) {
            newStatus = 'not-started';
          } else if (completedCount === totalCount) {
            newStatus = 'completed';
          } else {
            newStatus = 'in-progress';
          }
          
          return {
            ...phase,
            milestones: updatedMilestones,
            progress: newProgress,
            status: newStatus
          };
        }
        return phase;
      });
      
      return {
        ...prevProject,
        phases: updatedPhases
      };
    });
  };
  
  const openNewMilestoneDialog = (phaseId: string) => {
    setCurrentPhaseId(phaseId);
    setIsNewMilestoneDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          className="w-fit flex items-center text-muted-foreground hover:text-foreground" 
          onClick={() => navigate('/app/projects')}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour aux projets
        </Button>
        
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">Client: {project.client}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Edit className="mr-1.5 h-4 w-4" />
              Modifier
            </Button>
            <Button variant="default" size="sm" className="flex items-center">
              <FileText className="mr-1.5 h-4 w-4" />
              Créer un rapport
            </Button>
          </div>
        </div>
      </div>
      
      {/* Project overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vue d'ensemble</CardTitle>
            <CardDescription>Informations générales et avancement du projet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Status & Progress */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <div className="flex items-center">
                    {getStatusInfo(project.status).icon}
                    <span className={cn(
                      "ml-1.5 font-medium",
                      getStatusInfo(project.status).color
                    )}>
                      {getStatusInfo(project.status).text}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Avancement</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
              
              <Separator />
              
              {/* Dates & Budget */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Date de début</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span>{formatDate(project.startDate)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Date de fin prévue</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span>{formatDate(project.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Budget</span>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span>{project.budget.toLocaleString('fr-FR')}€</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Dépenses</span>
                      <span className="text-sm">
                        {((project.spent / project.budget) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={(project.spent / project.budget) * 100} className="h-2" />
                    <span className="text-xs text-muted-foreground">
                      {project.spent.toLocaleString('fr-FR')}€ / {project.budget.toLocaleString('fr-FR')}€
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p>{project.description || 'Aucune description disponible.'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Team members card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Équipe</CardTitle>
              <CardDescription>Participants au projet</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* We'll use mock data for team members */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Utilisateur {i + 1}</p>
                      <p className="text-xs text-muted-foreground">{i === 0 ? 'Chef de projet' : 'Membre'}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-1 h-4 w-4" />
                Ajouter un membre
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for phases, Gantt chart, etc. */}
      <Tabs defaultValue="phases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="gantt">Diagramme de Gantt</TabsTrigger>
          <TabsTrigger value="files">Fichiers</TabsTrigger>
        </TabsList>
        
        {/* Phases tab */}
        <TabsContent value="phases" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Phases du projet</h2>
            <Dialog open={isNewPhaseDialogOpen} onOpenChange={setIsNewPhaseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Nouvelle phase
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreatePhase}>
                  <DialogHeader>
                    <DialogTitle>Ajouter une phase</DialogTitle>
                    <DialogDescription>
                      Créez une nouvelle phase pour le projet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nom de la phase</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Ex: Conception" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input 
                          id="startDate" 
                          name="startDate" 
                          type="date" 
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input 
                          id="endDate" 
                          name="endDate" 
                          type="date" 
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea 
                        id="description" 
                        name="description" 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="Description de la phase..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsNewPhaseDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Créer la phase</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Phases list */}
          <div className="grid gap-4">
            {project.phases.length > 0 ? (
              project.phases.map((phase, index) => (
                <Card key={phase.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{phase.name}</h3>
                          <div className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                            getStatusInfo(phase.status).bgColor,
                            getStatusInfo(phase.status).color
                          )}>
                            {getStatusInfo(phase.status).text}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openNewMilestoneDialog(phase.id)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Ajouter un jalon
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3.5 w-3.5 mr-1.5" />
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Milestones for this phase */}
                    {phase.milestones && phase.milestones.length > 0 && (
                      <div className="mt-4 mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Jalons</h4>
                        <div className="grid gap-2">
                          {phase.milestones.map((milestone, idx) => (
                            <div key={milestone.id} className="flex items-center gap-2">
                              <Checkbox 
                                id={milestone.id}
                                checked={milestone.completed}
                                onCheckedChange={() => toggleMilestone(phase.id, milestone.id)}
                              />
                              <Label 
                                htmlFor={milestone.id}
                                className={cn(
                                  "text-sm cursor-pointer",
                                  milestone.completed && "line-through text-muted-foreground"
                                )}
                              >
                                {milestone.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-muted-foreground">Progression</span>
                        <span className="text-sm font-medium">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">Aucune phase n'a encore été créée</p>
                  <Button onClick={() => setIsNewPhaseDialogOpen(true)}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Créer la première phase
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Gantt chart tab */}
        <TabsContent value="gantt">
          <Card>
            <CardHeader>
              <CardTitle>Diagramme de Gantt</CardTitle>
              <CardDescription>Planning visuel du projet</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simple Gantt chart visualization */}
              <GanttChart project={project} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Dialog for adding new milestone */}
        <Dialog open={isNewMilestoneDialogOpen} onOpenChange={setIsNewMilestoneDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateMilestone}>
              <DialogHeader>
                <DialogTitle>Ajouter un jalon</DialogTitle>
                <DialogDescription>
                  Créez un nouveau jalon pour cette phase.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="milestoneName">Nom du jalon</Label>
                  <Input 
                    id="milestoneName" 
                    name="milestoneName" 
                    placeholder="Ex: Validation client" 
                    value={newMilestoneName}
                    onChange={(e) => setNewMilestoneName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsNewMilestoneDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer le jalon</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Files tab */}
        <TabsContent value="files">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fichiers du projet</CardTitle>
                <CardDescription>Documents et ressources</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Ajouter un fichier
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock file list */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded flex items-center justify-center bg-blue-100">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Document_{i + 1}.pdf</p>
                        <p className="text-xs text-muted-foreground">Ajouté le {formatDate(new Date())}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {Array.from({ length: 0 }).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Aucun fichier n'a été ajouté à ce projet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
