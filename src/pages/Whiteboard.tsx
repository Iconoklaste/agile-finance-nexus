
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Rect, Circle, Textbox } from "fabric";
import type { TEvent } from "fabric";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Square,
  Circle as CircleIcon,
  Type,
  Pencil,
  Image,
  Move,
  Trash2,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { toast } from "sonner";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [tool, setTool] = useState<string>("select");
  const [canvasState, setCanvasState] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastPosX, setLastPosX] = useState<number>(0);
  const [lastPosY, setLastPosY] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [defaultLayout, setDefaultLayout] = useState([20, 80]);
  const [layout, setLayout] = useState(defaultLayout);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize canvas
    const canvas = new FabricCanvas(canvasRef.current.id, {
      width: canvasRef.current.clientWidth,
      height: 600,
      backgroundColor: "#ffffff",
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    // Set up event listeners
    window.addEventListener("resize", handleResize);
    setupPanEvents(canvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, [layout, isCollapsed]);

  const handleResize = () => {
    if (!canvasRef.current || !fabricCanvasRef.current || !containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    
    fabricCanvasRef.current.setDimensions({
      width: containerWidth,
      height: 600,
    });
    fabricCanvasRef.current.renderAll();
  };

  const setupPanEvents = (canvas: FabricCanvas) => {
    canvas.on("mouse:down", function(opt: TEvent) {
      if (tool !== "pan") return;
      setIsPanning(true);
      if (opt.e && canvas) {
        const evt = opt.e as MouseEvent;
        setLastPosX(evt.clientX);
        setLastPosY(evt.clientY);
        canvas.selection = false;
      }
    });

    canvas.on("mouse:move", function(opt: TEvent) {
      if (!isPanning) return;
      if (opt.e && canvas) {
        const evt = opt.e as MouseEvent;
        const vpt = canvas.viewportTransform;
        if (!vpt) return;
        
        vpt[4] += evt.clientX - lastPosX;
        vpt[5] += evt.clientY - lastPosY;
        setLastPosX(evt.clientX);
        setLastPosY(evt.clientY);
        canvas.requestRenderAll();
      }
    });

    canvas.on("mouse:up", function() {
      setIsPanning(false);
      if (canvas) {
        canvas.selection = true;
      }
    });
  };

  const handleToolChange = (value: string) => {
    setTool(value);
    
    if (!fabricCanvasRef.current) return;
    
    // Disable drawing mode when not using draw tool
    if (value !== "draw") {
      fabricCanvasRef.current.isDrawingMode = false;
    } else {
      fabricCanvasRef.current.isDrawingMode = true;
      fabricCanvasRef.current.freeDrawingBrush.width = 3;
      fabricCanvasRef.current.freeDrawingBrush.color = "#000000";
    }
  };

  const addShape = (type: string) => {
    if (!fabricCanvasRef.current) return;

    let object;
    
    switch (type) {
      case "rectangle":
        object = new Rect({
          left: 100,
          top: 100,
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 2,
          width: 100,
          height: 100,
        });
        break;
      case "circle":
        object = new Circle({
          left: 100,
          top: 100,
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 2,
          radius: 50,
        });
        break;
      case "text":
        object = new Textbox("Texte", {
          left: 100,
          top: 100,
          width: 200,
          fontSize: 20,
          fontFamily: "Arial",
        });
        break;
      default:
        return;
    }

    fabricCanvasRef.current.add(object);
    fabricCanvasRef.current.setActiveObject(object);
  };

  const handleCanvasAction = (action: string) => {
    if (!fabricCanvasRef.current) return;

    switch (action) {
      case "clear":
        fabricCanvasRef.current.clear();
        fabricCanvasRef.current.backgroundColor = "#ffffff";
        fabricCanvasRef.current.renderAll();
        toast.success("Tableau effacé");
        break;
      case "save":
        // Convert canvas to JSON
        const json = JSON.stringify(fabricCanvasRef.current.toJSON());
        setCanvasState(json);
        
        // Create downloadable file
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "whiteboard.json";
        link.click();
        
        toast.success("Tableau sauvegardé");
        break;
      case "load":
        // Create file input and trigger click
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (!target.files?.length) return;
          
          const file = target.files[0];
          const reader = new FileReader();
          
          reader.onload = (event) => {
            const result = event.target?.result as string;
            if (!fabricCanvasRef.current) return;
            
            try {
              fabricCanvasRef.current.loadFromJSON(result, () => {
                fabricCanvasRef.current?.renderAll();
                setCanvasState(result);
                toast.success("Tableau chargé");
              });
            } catch (error) {
              toast.error("Erreur lors du chargement du tableau");
            }
          };
          
          reader.readAsText(file);
        };
        input.click();
        break;
      case "zoomin":
        fabricCanvasRef.current.setZoom(fabricCanvasRef.current.getZoom() * 1.1);
        break;
      case "zoomout":
        fabricCanvasRef.current.setZoom(fabricCanvasRef.current.getZoom() / 1.1);
        break;
      default:
        break;
    }
  };

  const toggleSidebar = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setLayout(defaultLayout);
    } else {
      setIsCollapsed(true);
      setLayout([0, 100]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tableau Blanc Collaboratif</h1>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          title={isCollapsed ? "Afficher les outils" : "Masquer les outils"}
        >
          {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </Button>
      </div>
      
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[600px] border rounded-lg overflow-hidden"
        onLayout={(sizes) => {
          setLayout(sizes);
        }}
      >
        <ResizablePanel 
          defaultSize={defaultLayout[0]} 
          size={layout[0]} 
          minSize={15}
          className={cn(
            "bg-muted p-2",
            isCollapsed && "hidden"
          )}
        >
          {/* Toolbar */}
          <div className="flex flex-col gap-4">
            <Select value={tool} onValueChange={handleToolChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un outil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">
                  <div className="flex items-center gap-2">
                    <Move size={16} /> Sélectionner
                  </div>
                </SelectItem>
                <SelectItem value="pan">
                  <div className="flex items-center gap-2">
                    <Move size={16} /> Déplacer la vue
                  </div>
                </SelectItem>
                <SelectItem value="draw">
                  <div className="flex items-center gap-2">
                    <Pencil size={16} /> Dessiner
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => addShape("rectangle")}>
                <Square size={16} className="mr-1" /> Rectangle
              </Button>
              
              <Button variant="outline" onClick={() => addShape("circle")}>
                <CircleIcon size={16} className="mr-1" /> Cercle
              </Button>
              
              <Button variant="outline" onClick={() => addShape("text")}>
                <Type size={16} className="mr-1" /> Texte
              </Button>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" onClick={() => handleCanvasAction("clear")}>
                <Trash2 size={16} className="mr-1" /> Effacer
              </Button>
              
              <Button variant="outline" onClick={() => handleCanvasAction("save")}>
                <Download size={16} className="mr-1" /> Sauvegarder
              </Button>
              
              <Button variant="outline" onClick={() => handleCanvasAction("load")}>
                <Upload size={16} className="mr-1" /> Charger
              </Button>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="icon" onClick={() => handleCanvasAction("zoomin")}>
                <ZoomIn size={16} />
              </Button>
              
              <Button variant="outline" size="icon" onClick={() => handleCanvasAction("zoomout")}>
                <ZoomOut size={16} />
              </Button>
            </div>
          </div>
        </ResizablePanel>
        
        {!isCollapsed && (
          <ResizableHandle withHandle />
        )}
        
        <ResizablePanel 
          defaultSize={defaultLayout[1]} 
          size={layout[1]}
          className="p-0"
        >
          {/* Canvas */}
          <div ref={containerRef} className="h-full w-full touch-none">
            <canvas
              id="whiteboard-canvas"
              ref={canvasRef}
              className="w-full touch-none"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
