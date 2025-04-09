
import React, { useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Account, AccountClass } from '@/lib/mock-data';
import { Circle, CircleDot, FolderTree, Grid3X3 } from 'lucide-react';

interface AccountNode {
  id: string;
  code: string;
  name: string;
  children: AccountNode[];
  type: 'root' | 'class' | 'account';
  balance?: number;
}

interface AccountMindMapProps {
  accounts: Account[];
  accountClasses: AccountClass[];
}

const AccountMindMap = ({ accounts, accountClasses }: AccountMindMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Build account tree structure
  const accountTree = useMemo(() => {
    // Create root node
    const root: AccountNode = {
      id: 'root',
      code: '',
      name: 'Plan Comptable',
      children: [],
      type: 'root'
    };
    
    // Add class nodes
    accountClasses.forEach(cls => {
      const classNode: AccountNode = {
        id: cls.id,
        code: cls.code,
        name: cls.name,
        children: [],
        type: 'class'
      };
      
      // Group accounts by first digits
      const classAccounts = accounts.filter(acc => acc.classId === cls.id);
      
      // Create an index of prefixes (2 digits, etc)
      const prefixGroups: Record<string, Account[]> = {};
      
      classAccounts.forEach(account => {
        // For accounts with more than 2 digits, group by first 2 digits
        if (account.code.length > 2) {
          const prefix = account.code.substring(0, 2);
          if (!prefixGroups[prefix]) {
            prefixGroups[prefix] = [];
          }
          prefixGroups[prefix].push(account);
        } else {
          // Direct child of class (2-digit account)
          const accountNode: AccountNode = {
            id: account.id,
            code: account.code,
            name: account.name,
            children: [],
            type: 'account',
            balance: account.balance
          };
          classNode.children.push(accountNode);
        }
      });
      
      // Process 2-digit prefix groups
      Object.entries(prefixGroups).forEach(([prefix, prefixAccounts]) => {
        // Create a node for the prefix
        const prefixNode: AccountNode = {
          id: `prefix-${prefix}`,
          code: prefix,
          name: `Comptes ${prefix}xx`,
          children: [],
          type: 'account'
        };
        
        // Group by 3 digits if necessary
        const threeDigitGroups: Record<string, Account[]> = {};
        
        prefixAccounts.forEach(account => {
          if (account.code.length > 3) {
            const threeDigitPrefix = account.code.substring(0, 3);
            if (!threeDigitGroups[threeDigitPrefix]) {
              threeDigitGroups[threeDigitPrefix] = [];
            }
            threeDigitGroups[threeDigitPrefix].push(account);
          } else {
            // 3-digit account, direct child of prefix
            const accountNode: AccountNode = {
              id: account.id,
              code: account.code,
              name: account.name,
              children: [],
              type: 'account',
              balance: account.balance
            };
            prefixNode.children.push(accountNode);
          }
        });
        
        // Process 3-digit groups
        Object.entries(threeDigitGroups).forEach(([threeDigitPrefix, threeDigitAccounts]) => {
          const threeDigitNode: AccountNode = {
            id: `prefix-${threeDigitPrefix}`,
            code: threeDigitPrefix,
            name: `Comptes ${threeDigitPrefix}x`,
            children: [],
            type: 'account'
          };
          
          threeDigitAccounts.forEach(account => {
            const accountNode: AccountNode = {
              id: account.id,
              code: account.code,
              name: account.name,
              children: [],
              type: 'account',
              balance: account.balance
            };
            threeDigitNode.children.push(accountNode);
          });
          
          prefixNode.children.push(threeDigitNode);
        });
        
        classNode.children.push(prefixNode);
      });
      
      root.children.push(classNode);
    });
    
    return root;
  }, [accounts, accountClasses]);
  
  // Render the mind map
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // SVG dimensions
    const width = svg.clientWidth;
    const height = 600; // Fixed height or dynamic based on nodes count
    svg.setAttribute('height', `${height}px`);
    
    // Center point
    const centerX = width / 2;
    const centerY = 50; // Start from top with some margin
    
    // Draw mind map
    const drawNode = (node: AccountNode, x: number, y: number, level: number, angleStart: number, angleEnd: number) => {
      // Node dimensions
      const nodeWidth = 150;
      const nodeHeight = 60;
      const nodeSpacing = 20;
      const levelSpacing = 120;
      
      // Create group for the node
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Rectangle/node background
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${x - nodeWidth / 2}`);
      rect.setAttribute('y', `${y - nodeHeight / 2}`);
      rect.setAttribute('width', `${nodeWidth}`);
      rect.setAttribute('height', `${nodeHeight}`);
      rect.setAttribute('rx', '8');
      rect.setAttribute('ry', '8');
      
      // Style based on node type
      if (node.type === 'root') {
        rect.setAttribute('fill', '#6366f1'); // Indigo for root
        rect.setAttribute('stroke', '#4f46e5');
      } else if (node.type === 'class') {
        rect.setAttribute('fill', '#06b6d4'); // Cyan for classes
        rect.setAttribute('stroke', '#0891b2');
      } else {
        rect.setAttribute('fill', '#10b981'); // Emerald for accounts
        rect.setAttribute('stroke', '#059669');
      }
      
      rect.setAttribute('stroke-width', '2');
      g.appendChild(rect);
      
      // Node code text
      if (node.code) {
        const codeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        codeText.setAttribute('x', `${x}`);
        codeText.setAttribute('y', `${y - 10}`);
        codeText.setAttribute('text-anchor', 'middle');
        codeText.setAttribute('fill', 'white');
        codeText.setAttribute('font-weight', 'bold');
        codeText.textContent = node.code;
        g.appendChild(codeText);
      }
      
      // Node name text
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', `${x}`);
      nameText.setAttribute('y', `${y + (node.code ? 10 : 0)}`);
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('fill', 'white');
      nameText.textContent = node.name.length > 18 ? node.name.substring(0, 16) + '...' : node.name;
      g.appendChild(nameText);
      
      // Add balance if present
      if (node.balance !== undefined) {
        const balanceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        balanceText.setAttribute('x', `${x}`);
        balanceText.setAttribute('y', `${y + 25}`);
        balanceText.setAttribute('text-anchor', 'middle');
        balanceText.setAttribute('fill', 'white');
        balanceText.setAttribute('font-size', '10');
        balanceText.textContent = `${node.balance.toLocaleString()} €`;
        g.appendChild(balanceText);
      }
      
      svg.appendChild(g);
      
      // If there are children, recursively draw them
      if (node.children.length > 0) {
        const angleStep = (angleEnd - angleStart) / node.children.length;
        const nextLevel = level + 1;
        const radius = levelSpacing * level;
        
        for (let i = 0; i < node.children.length; i++) {
          const childAngleStart = angleStart + i * angleStep;
          const childAngleEnd = childAngleStart + angleStep;
          const childAngle = (childAngleStart + childAngleEnd) / 2;
          
          // Calculate child position using angle
          const childX = x + radius * Math.cos(childAngle);
          const childY = y + radius * Math.sin(childAngle);
          
          // Draw connecting line
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', `${x}`);
          line.setAttribute('y1', `${y}`);
          line.setAttribute('x2', `${childX}`);
          line.setAttribute('y2', `${childY}`);
          line.setAttribute('stroke', '#8b5cf6'); // Purple
          line.setAttribute('stroke-width', '2');
          line.setAttribute('stroke-dasharray', level === 0 ? '' : '5,5'); // Dashed for non-root connections
          svg.appendChild(line);
          
          // Draw child node
          drawNode(node.children[i], childX, childY, nextLevel, childAngleStart, childAngleEnd);
        }
      }
    };
    
    // Start drawing from root
    drawNode(accountTree, centerX, centerY, 0, -Math.PI / 2, Math.PI * 1.5);
    
  }, [accountTree, svgRef]);
  
  return (
    <Card className="w-full overflow-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <FolderTree className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Vue Hiérarchique du Plan Comptable</h3>
      </div>
      <div className="relative w-full" style={{ minHeight: '600px' }}>
        <svg
          ref={svgRef}
          className="w-full"
          width="100%"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </Card>
  );
};

export default AccountMindMap;
