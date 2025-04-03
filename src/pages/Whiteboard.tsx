
import { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Pencil, Square, Circle, Type, Download, Upload,
  Save, Trash2, Undo, Redo, MousePointer, Hand
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tool = 'select' | 'draw' | 'rectangle' | 'circle' | 'text' | 'pan';

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [activeColor, setActiveColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Calculate the container size
    const container = canvasRef.current.parentElement;
    const width = container?.clientWidth || 800;
    const height = 600;
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
    });
    
    setFabricCanvas(canvas);
    
    // Save initial state
    saveCanvasState(canvas);
    
    return () => {
      canvas.dispose();
    };
  }, []);
  
  // Update tool settings
  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.isDrawingMode = activeTool === 'draw';
    
    if (activeTool === 'draw' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
    
    if (activeTool === 'pan') {
      fabricCanvas.defaultCursor = 'grab';
      fabricCanvas.hoverCursor = 'grab';
    } else {
      fabricCanvas.defaultCursor = 'default';
      fabricCanvas.hoverCursor = 'move';
    }
    
  }, [activeTool, activeColor, brushSize, fabricCanvas]);
  
  // Object manipulation mode
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleSelectionCreated = () => {
      if (activeTool !== 'select' && activeTool !== 'pan') {
        fabricCanvas.discardActiveObject().renderAll();
      }
    };
    
    fabricCanvas.on('selection:created', handleSelectionCreated);
    
    return () => {
      fabricCanvas.off('selection:created', handleSelectionCreated);
    };
  }, [fabricCanvas, activeTool]);
  
  // Pan functionality
  useEffect(() => {
    if (!fabricCanvas) return;
    
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;
    
    const handleMouseDown = (e: fabric.IEvent) => {
      if (activeTool !== 'pan') return;
      
      isPanning = true;
      fabricCanvas.selection = false;
      lastPosX = e.e.clientX;
      lastPosY = e.e.clientY;
      fabricCanvas.setCursor('grabbing');
    };
    
    const handleMouseMove = (e: fabric.IEvent) => {
      if (!isPanning) return;
      
      const vpt = fabricCanvas.viewportTransform;
      if (!vpt) return;
      
      vpt[4] += e.e.clientX - lastPosX;
      vpt[5] += e.e.clientY - lastPosY;
      
      lastPosX = e.e.clientX;
      lastPosY = e.e.clientY;
      
      fabricCanvas.requestRenderAll();
    };
    
    const handleMouseUp = () => {
      isPanning = false;
      fabricCanvas.selection = true;
      fabricCanvas.setCursor('grab');
    };
    
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
    };
  }, [fabricCanvas, activeTool]);
  
  // Save canvas state for undo/redo
  const saveCanvasState = (canvas: fabric.Canvas) => {
    if (!canvas) return;
    
    // Get JSON data
    const json = canvas.toJSON();
    const jsonString = JSON.stringify(json);
    
    // Add to history
    setCanvasHistory(prevHistory => {
      const newHistory = [...prevHistory.slice(0, historyIndex + 1), jsonString];
      // Limit history size
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      return newHistory;
    });
    
    setHistoryIndex(prev => {
      // If trimming history, adjust the index
      if (prev + 1 >= 20) return 19;
      return prev + 1;
    });
  };
  
  // Object added event
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleObjectAdded = () => {
      saveCanvasState(fabricCanvas);
    };
    
    const handleObjectModified = () => {
      saveCanvasState(fabricCanvas);
    };
    
    fabricCanvas.on('object:added', handleObjectAdded);
    fabricCanvas.on('object:modified', handleObjectModified);
    
    return () => {
      fabricCanvas.off('object:added', handleObjectAdded);
      fabricCanvas.off('object:modified', handleObjectModified);
    };
  }, [fabricCanvas, historyIndex]);
  
  // Handle tool selection
  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    
    if (tool === 'rectangle' && fabricCanvas) {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 100,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === 'circle' && fabricCanvas) {
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === 'text' && fabricCanvas) {
      const text = new fabric.Textbox('Texte', {
        left: 100,
        top: 100,
        fontFamily: 'Roboto',
        fill: activeColor,
        width: 200,
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
    }
  };
  
  // Clear canvas
  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.setBackgroundColor('#ffffff', fabricCanvas.renderAll.bind(fabricCanvas));
    saveCanvasState(fabricCanvas);
    toast.success('Tableau effacé');
  };
  
  // Undo function
  const handleUndo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    const jsonString = canvasHistory[newIndex];
    
    fabricCanvas.loadFromJSON(jsonString, () => {
      fabricCanvas.renderAll();
      setHistoryIndex(newIndex);
    });
  };
  
  // Redo function
  const handleRedo = () => {
    if (!fabricCanvas || historyIndex >= canvasHistory.length - 1) return;
    
    const newIndex = historyIndex + 1;
    const jsonString = canvasHistory[newIndex];
    
    fabricCanvas.loadFromJSON(jsonString, () => {
      fabricCanvas.renderAll();
      setHistoryIndex(newIndex);
    });
  };
  
  // Save canvas
  const handleSave = () => {
    if (!fabricCanvas) return;
    
    // Convert canvas to JSON
    const json = fabricCanvas.toJSON();
    const jsonString = JSON.stringify(json);
    
    // Create a blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    
    toast.success('Tableau sauvegardé');
  };
  
  // Export as image
  const handleExport = () => {
    if (!fabricCanvas) return;
    
    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
    
    toast.success('Image exportée');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tableau Collaboratif</h1>
      
      <Tabs defaultValue="whiteboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="whiteboard">Tableau</TabsTrigger>
          <TabsTrigger value="saved">Tableaux Sauvegardés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="whiteboard">
          <Card className="overflow-hidden">
            <CardHeader className="p-4 border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {/* Tool buttons */}
                  <Button
                    variant={activeTool === 'select' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleToolClick('select')}
                    title="Sélectionner"
                  >
                    <MousePointer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTool === 'pan' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleToolClick('pan')}
                    title="Déplacer la vue"
                  >
                    <Hand className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTool === 'draw' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleToolClick('draw')}
                    title="Dessiner"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTool === 'rectangle' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleToolClick('rectangle')}
                    title="Rectangle"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTool === 'circle' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleToolClick('circle')}
                    title="Cercle"
                  >
                    <Circle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTool === 'text' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleToolClick('text')}
                    title="Texte"
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                  <span className="h-6 w-px bg-border mx-1" />
                  <div className="flex items-center gap-1 px-2">
                    <label htmlFor="color-input" className="sr-only">Couleur</label>
                    <input
                      id="color-input"
                      type="color"
                      value={activeColor}
                      onChange={(e) => setActiveColor(e.target.value)}
                      className="w-6 h-6 rounded-md border cursor-pointer"
                    />
                  </div>
                  {activeTool === 'draw' && (
                    <Select
                      value={brushSize.toString()}
                      onValueChange={(value) => setBrushSize(Number(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Taille" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Fin</SelectItem>
                        <SelectItem value="2">Normal</SelectItem>
                        <SelectItem value="5">Large</SelectItem>
                        <SelectItem value="10">Extra large</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Action buttons */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    title="Annuler"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={historyIndex >= canvasHistory.length - 1}
                    title="Refaire"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                  <span className="h-6 w-px bg-border mx-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    title="Sauvegarder"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Sauvegarder</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    title="Exporter en PNG"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Exporter</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={handleClear}
                    title="Effacer tout"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full bg-white border-t overflow-hidden">
                <canvas 
                  ref={canvasRef} 
                  className={cn(
                    "w-full",
                    activeTool === 'pan' && "cursor-grab"
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Tableaux Sauvegardés</CardTitle>
              <CardDescription>Charger un tableau sauvegardé précédemment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label htmlFor="load-file" className="text-sm font-medium block mb-1.5">
                      Charger depuis un fichier
                    </label>
                    <Input id="load-file" type="file" accept=".json" />
                  </div>
                  <Button 
                    onClick={() => toast.info('Fonctionnalité en cours de développement')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Charger
                  </Button>
                </div>
                
                <div className="border rounded-md p-8 text-center">
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore de tableaux sauvegardés.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Whiteboard;
