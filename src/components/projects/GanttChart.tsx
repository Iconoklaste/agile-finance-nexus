
import { useMemo } from 'react';
import { addDays, differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Project } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface GanttChartProps {
  project: Project;
}

const GanttChart = ({ project }: GanttChartProps) => {
  // Calculate project timeline
  const projectStartDate = project.startDate;
  const projectEndDate = project.endDate;
  const totalDays = differenceInDays(projectEndDate, projectStartDate) + 1;
  
  // Generate timeline (weeks)
  const timeline = useMemo(() => {
    const weekCount = Math.ceil(totalDays / 7);
    return Array.from({ length: weekCount }, (_, i) => {
      const startDay = addDays(projectStartDate, i * 7);
      return {
        week: i + 1,
        startDate: startDay,
        endDate: addDays(startDay, 6)
      };
    });
  }, [projectStartDate, totalDays]);
  
  // Process phases for the Gantt chart
  const processedPhases = useMemo(() => {
    return project.phases.map(phase => {
      const start = differenceInDays(phase.startDate, projectStartDate);
      const duration = differenceInDays(phase.endDate, phase.startDate) + 1;
      const startPercentage = (start / totalDays) * 100;
      const widthPercentage = (duration / totalDays) * 100;
      
      return {
        ...phase,
        startOffset: startPercentage,
        width: widthPercentage
      };
    });
  }, [project.phases, projectStartDate, totalDays]);
  
  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-orange-500';
      case 'on-hold':
        return 'bg-gray-500';
      case 'not-started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };
  
  const formatDateShort = (date: Date) => format(date, 'dd MMM', { locale: fr });
  
  return (
    <div className="w-full overflow-x-auto">
      {/* Header with timeline */}
      <div className="min-w-[800px]">
        <div className="flex mb-4">
          <div className="w-1/4">
            <div className="text-sm font-medium text-muted-foreground">Phases</div>
          </div>
          <div className="w-3/4 flex">
            {timeline.map((week, i) => (
              <div 
                key={`week-${i}`} 
                className="flex-1 text-center text-xs text-muted-foreground"
              >
                <div>Sem. {week.week}</div>
                <div>{formatDateShort(week.startDate)} - {formatDateShort(week.endDate)}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Timeline grid and phases */}
        <div className="relative">
          {/* Background grid */}
          <div className="absolute top-0 left-1/4 right-0 bottom-0 flex">
            {timeline.map((_, i) => (
              <div 
                key={`grid-${i}`} 
                className="flex-1 border-l border-gray-200 h-full"
              />
            ))}
          </div>
          
          {/* Phases */}
          <div className="relative">
            {processedPhases.map((phase, i) => (
              <div 
                key={`phase-${phase.id}`} 
                className="flex h-14 mb-4 items-center"
              >
                <div className="w-1/4 pr-4">
                  <div className="text-sm font-medium truncate">{phase.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDateShort(phase.startDate)} - {formatDateShort(phase.endDate)}
                  </div>
                </div>
                <div className="w-3/4 relative">
                  <div 
                    className={cn(
                      "absolute top-2 h-8 rounded-md",
                      getStatusColor(phase.status)
                    )}
                    style={{ 
                      left: `${phase.startOffset}%`, 
                      width: `${phase.width}%` 
                    }}
                  >
                    <div className="h-full flex items-center justify-center text-white text-xs font-medium px-2 truncate">
                      {phase.progress}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {processedPhases.length === 0 && (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                Aucune phase définie pour ce projet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
