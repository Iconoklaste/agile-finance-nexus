
import { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Circle, IEvent, Rect, Textbox } from 'fabric';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Définir les types pour les outils
type Tool = 'select' | 'pen' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'pan' | 'zoom';

// Type pour l'état du canvas
type CanvasState = {
  objects: object[];
  background: string;
};

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [activeColor, setActiveColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [canvasStates, setCanvasStates] = useState<string[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);

  // Initialiser le canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Récupérer la largeur du conteneur parent
    const container = canvasRef.current.parentElement;
    const width = container?.clientWidth || 800;
    const height = 600;
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
    });

    setFabricCanvas(canvas);
    
    // Configurer les outils
    canvas.isDrawingMode = false;
    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = activeColor;

    // Enregistrer l'état initial du canvas
    const initialState = JSON.stringify(canvas.toJSON());
    setCanvasStates([initialState]);
    setCurrentStateIndex(0);

    // Nettoyer
    return () => {
      canvas.dispose();
    };
  }, []);

  // Mettre à jour les paramètres du pinceau
  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.freeDrawingBrush.width = brushSize;
    fabricCanvas.freeDrawingBrush.color = activeColor;
    
    if (activeTool === 'select') {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
    } else if (activeTool === 'pen') {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.selection = false;
    } else if (activeTool === 'eraser') {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.color = '#ffffff';
      fabricCanvas.selection = false;
    } else {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
    }
    
    fabricCanvas.renderAll();
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  // Configurer les fonctionnalités de pan et zoom
  useEffect(() => {
    if (!fabricCanvas) return;
    
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;
    
    const handleMouseDown = (e: IEvent) => {
      if (activeTool !== 'pan') return;
      
      isPanning = true;
      fabricCanvas.selection = false;
      lastPosX = e.pointer?.x || 0;
      lastPosY = e.pointer?.y || 0;
      fabricCanvas.setCursor('grabbing');
    };
    
    const handleMouseMove = (e: IEvent) => {
      if (!isPanning) return;
      
      const vpt = fabricCanvas.viewportTransform;
      if (!vpt) return;
      
      vpt[4] += (e.pointer?.x || 0) - lastPosX;
      vpt[5] += (e.pointer?.y || 0) - lastPosY;
      
      lastPosX = e.pointer?.x || 0;
      lastPosY = e.pointer?.y || 0;
      
      fabricCanvas.requestRenderAll();
    };
    
    const handleMouseUp = () => {
      isPanning = false;
      fabricCanvas.setCursor('default');
      fabricCanvas.selection = activeTool === 'select';
    };
    
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
    // Gérer le zoom avec la molette
    fabricCanvas.on('mouse:wheel', (opt) => {
      if (activeTool !== 'zoom') return;
      
      const delta = opt.e.deltaY;
      let zoom = fabricCanvas.getZoom();
      zoom *= 0.999 ** delta;
      
      // Limiter le zoom
      zoom = Math.min(Math.max(zoom, 0.5), 5);
      
      fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    
    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
      fabricCanvas.off('mouse:wheel');
    };
  }, [fabricCanvas, activeTool]);
  
  // Save canvas state for undo/redo
  const saveCanvasState = (canvas: FabricCanvas) => {
    if (!canvas) return;
    
    // Get JSON data
    const json = JSON.stringify(canvas.toJSON());
    
    // Remove any future states
    const newStates = canvasStates.slice(0, currentStateIndex + 1);
    newStates.push(json);
    
    // Update states
    setCanvasStates(newStates);
    setCurrentStateIndex(newStates.length - 1);
  };
  
  // Handle undo action
  const handleUndo = () => {
    if (currentStateIndex <= 0 || !fabricCanvas) return;
    
    const newIndex = currentStateIndex - 1;
    const stateToRestore = canvasStates[newIndex];
    
    fabricCanvas.loadFromJSON(JSON.parse(stateToRestore), () => {
      fabricCanvas.renderAll();
      setCurrentStateIndex(newIndex);
    });
  };
  
  // Handle redo action
  const handleRedo = () => {
    if (currentStateIndex >= canvasStates.length - 1 || !fabricCanvas) return;
    
    const newIndex = currentStateIndex + 1;
    const stateToRestore = canvasStates[newIndex];
    
    fabricCanvas.loadFromJSON(JSON.parse(stateToRestore), () => {
      fabricCanvas.renderAll();
      setCurrentStateIndex(newIndex);
    });
  };
  
  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    
    if (!fabricCanvas) return;

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: activeColor,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: activeColor,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === 'text') {
      const text = new Textbox('Texte', {
        left: 100,
        top: 100,
        fontSize: 20,
        fill: activeColor,
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
    }
    
    // Save the state after adding a new object
    if (['rectangle', 'circle', 'text'].includes(tool)) {
      saveCanvasState(fabricCanvas);
    }
  };
  
  const handleClearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.setBackgroundColor('#ffffff', fabricCanvas.renderAll.bind(fabricCanvas));
    saveCanvasState(fabricCanvas);
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setActiveColor(color);
  };
  
  const handleBrushSizeChange = (value: number[]) => {
    setBrushSize(value[0]);
  };
  
  const handleSaveImage = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = dataURL;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSaveJSON = () => {
    if (!fabricCanvas) return;
    
    const json = JSON.stringify(fabricCanvas.toJSON());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = 'whiteboard.json';
    link.href = url;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleLoadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvas || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== 'string') return;
      
      try {
        const jsonData = JSON.parse(event.target.result);
        fabricCanvas.loadFromJSON(jsonData, () => {
          fabricCanvas.renderAll();
          saveCanvasState(fabricCanvas);
        });
      } catch (error) {
        console.error('Error loading JSON:', error);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tableau collaboratif</CardTitle>
          <CardDescription>
            Utilisez les outils pour dessiner et collaborer visuellement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 border-b pb-4">
              <Button 
                onClick={() => handleToolClick('select')} 
                variant={activeTool === 'select' ? 'default' : 'outline'}
                size="sm"
              >
                Sélectionner
              </Button>
              <Button 
                onClick={() => handleToolClick('pen')} 
                variant={activeTool === 'pen' ? 'default' : 'outline'}
                size="sm"
              >
                Crayon
              </Button>
              <Button 
                onClick={() => handleToolClick('rectangle')} 
                variant={activeTool === 'rectangle' ? 'default' : 'outline'}
                size="sm"
              >
                Rectangle
              </Button>
              <Button 
                onClick={() => handleToolClick('circle')} 
                variant={activeTool === 'circle' ? 'default' : 'outline'}
                size="sm"
              >
                Cercle
              </Button>
              <Button 
                onClick={() => handleToolClick('text')} 
                variant={activeTool === 'text' ? 'default' : 'outline'}
                size="sm"
              >
                Texte
              </Button>
              <Button 
                onClick={() => handleToolClick('eraser')} 
                variant={activeTool === 'eraser' ? 'default' : 'outline'}
                size="sm"
              >
                Gomme
              </Button>
              <Button 
                onClick={() => handleToolClick('pan')} 
                variant={activeTool === 'pan' ? 'default' : 'outline'}
                size="sm"
              >
                Déplacer
              </Button>
              <Button 
                onClick={() => handleToolClick('zoom')} 
                variant={activeTool === 'zoom' ? 'default' : 'outline'}
                size="sm"
              >
                Zoom
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <label className="block text-sm mb-1">Couleur</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="color" 
                    value={activeColor} 
                    onChange={handleColorChange} 
                    className="w-10 h-10 p-1" 
                  />
                  <span>{activeColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Taille du crayon: {brushSize}</label>
                <Slider 
                  value={[brushSize]} 
                  onValueChange={handleBrushSizeChange} 
                  min={1} 
                  max={20} 
                  step={1}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleUndo} variant="outline" size="sm">
                Annuler
              </Button>
              <Button onClick={handleRedo} variant="outline" size="sm">
                Refaire
              </Button>
              <Button onClick={handleClearCanvas} variant="outline" size="sm">
                Effacer tout
              </Button>
              <Button onClick={handleSaveImage} variant="outline" size="sm">
                Exporter PNG
              </Button>
              <Button onClick={handleSaveJSON} variant="outline" size="sm">
                Sauvegarder
              </Button>
              <Button variant="outline" size="sm" className="relative">
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleLoadJSON} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                Charger
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden bg-white">
              <canvas ref={canvasRef} className="w-full touch-none" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Whiteboard;
