
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mockNodes } from "@/lib/mock-data";
import type { Node } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Wifi, Plus, LayoutGrid, Volume2, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const AddNodeSchema = z.object({
  x: z.coerce.number().min(0, "X coordinate cannot be negative."),
  y: z.coerce.number().min(0, "Y coordinate cannot be negative."),
});

export default function NodesTable() {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const [selectedNode, setSelectedNode] = useState<Node | null>(nodes.length > 0 ? nodes[0] : null);
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<Node | null>(null);
  
  const [gridClasses, setGridClasses] = useState('grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8');
  const [customColsInput, setCustomColsInput] = useState(8);

  const form = useForm<z.infer<typeof AddNodeSchema>>({
    resolver: zodResolver(AddNodeSchema),
    defaultValues: { x: 0, y: 0 },
  });

  const onAddNodeSubmit = (data: z.infer<typeof AddNodeSchema>) => {
    const highestId = nodes.reduce((max, node) => {
        const idNum = parseInt(node.id.replace('FS-N', ''), 10);
        return idNum > max ? idNum : max;
    }, 0);

    const newIdNumber = highestId + 1;
    const newNodeId = `FS-N${String(newIdNumber).padStart(3, '0')}`;

    const newNode: Node = {
      id: newNodeId,
      location: { x: data.x, y: data.y },
      status: 'inactive',
      lastPing: new Date().toISOString(),
      battery: 100,
      health: 'ok',
    };
    setNodes(prev => [...prev, newNode]);
    toast({ title: "Node Added", description: `Node ${newNode.id} has been added.` });
    setIsAddNodeDialogOpen(false);
    form.reset();
  };

  const handlePing = (nodeId: string) => {
    toast({
      title: `Pinging ${nodeId}...`,
      description: "Sending a status request to the node.",
    });

    setTimeout(() => {
      toast({
        title: "Ping Successful!",
        description: `${nodeId} is active and responsive.`,
      });
    }, 2000);
  };
  
  const handleActivateSpeaker = (nodeId: string) => {
    toast({
      title: `Activating Speaker on ${nodeId}`,
      description: "A command has been sent to the node's speaker.",
    });
  };

  const handleRemoveNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    toast({ title: "Node Removed", description: `Node ${nodeId} has been removed.` });
    setNodeToDelete(null);
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const getNodeHealthColor = (node: Node): string => {
    if (node.status === 'inactive' || node.health === 'error') {
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent';
    }
    if (node.health === 'warning') {
        return 'bg-chart-3 text-primary-foreground hover:bg-chart-3/90 border-transparent';
    }
    if (node.health === 'ok') {
        return 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent';
    }
    return 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent';
  };

  const getHealthBadge = (health: Node['health']) => {
    switch (health) {
      case 'ok':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/40 capitalize">OK</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40 capitalize">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive" className="capitalize">Error</Badge>;
      default:
        return <Badge variant="secondary" className="capitalize">{health}</Badge>;
    }
  };

  const getStatusBadge = (status: Node['status']) => {
    if (status === 'active') {
        return (
            <Badge className={cn("capitalize", "bg-green-500/20 text-green-400 border-green-500/40")}>
                {status}
            </Badge>
        );
    } else {
        return <Badge variant="destructive" className="capitalize">{status}</Badge>;
    }
  };
  
  const handleSetCustomGrid = () => {
    if (customColsInput > 0 && customColsInput <= 12) {
      setGridClasses(`grid-cols-${customColsInput}`);
    } else {
      toast({ variant: 'destructive', title: 'Invalid number', description: 'Please enter a number between 1 and 12.' });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Node Status Grid
          </h2>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Grid Layout
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Grid Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setGridClasses('grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8')}>Responsive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGridClasses('grid-cols-3')}>3 Columns</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGridClasses('grid-cols-4')}>4 Columns</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGridClasses('grid-cols-5')}>5 Columns</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Custom</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="p-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="custom-cols">Columns (1-12)</Label>
                      <Input 
                        id="custom-cols" 
                        type="number" 
                        min="1" max="12"
                        value={customColsInput} 
                        onChange={(e) => setCustomColsInput(Number(e.target.value))} 
                        className="w-24"
                      />
                      <Button size="sm" onClick={handleSetCustomGrid}>Set</Button>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" onClick={() => setIsAddNodeDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Node
            </Button>
          </div>
        </div>
        <div className={cn("grid gap-4", gridClasses)}>
          {nodes.map((node) => (
            <Button
              key={node.id}
              variant="secondary"
              className={cn(
                "h-24 w-full text-lg font-bold flex items-center justify-center p-2 border-2",
                getNodeHealthColor(node),
                selectedNode?.id === node.id && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
              onClick={() => setSelectedNode(node)}
            >
              {node.id.replace('FS-N', '')}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={isAddNodeDialogOpen} onOpenChange={setIsAddNodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Node</DialogTitle>
            <DialogDescription>
              Enter the location for the new node. An ID will be assigned automatically.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddNodeSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location X</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 150" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="y"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Y</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 120" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Node</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!nodeToDelete} onOpenChange={(open) => !open && setNodeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove node{' '}
              <span className="font-bold">{nodeToDelete?.id}</span> and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleRemoveNode(nodeToDelete!.id)}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {selectedNode ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Node Details: {selectedNode.id}</CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handlePing(selectedNode.id)}>
                    <Wifi className="mr-2" />
                    Ping Node
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled={selectedNode.status === 'inactive'}>
                      <Volume2 className="mr-2" />
                      Intervene
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleActivateSpeaker(selectedNode.id)}>
                        Activate Speaker
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/90 focus:text-destructive-foreground"
                    onClick={() => setNodeToDelete(selectedNode)}
                  >
                    <Trash2 className="mr-2" />
                    Remove Node
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Node ID</span>
                <span className="font-medium">{selectedNode.id}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Last Activity</span>
                <span className="font-medium">{formatDistanceToNow(new Date(selectedNode.lastPing), { addSuffix: true })}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Battery Level</span>
                <span className="font-medium">{selectedNode.battery}%</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Status</span>
                {getStatusBadge(selectedNode.status)}
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Health</span>
                {selectedNode.status === 'inactive' ? <Badge variant="secondary">N/A</Badge> : getHealthBadge(selectedNode.health)}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Select a node to see its details.</p>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TableRow 
                  key={node.id} 
                  onClick={() => setSelectedNode(node)} 
                  className={cn(
                    "cursor-pointer", 
                    selectedNode?.id === node.id && 'bg-accent/50 hover:bg-accent/60'
                  )}
                >
                  <TableCell className="font-medium">{node.id}</TableCell>
                  <TableCell>{getStatusBadge(node.status)}</TableCell>
                  <TableCell>{node.status === 'inactive' ? <Badge variant="secondary">N/A</Badge> : getHealthBadge(node.health)}</TableCell>
                  <TableCell>{node.battery}%</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(node.lastPing), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handlePing(node.id)}>
                          <Wifi className="mr-2 h-4 w-4" />
                          <span>Ping</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={node.status === 'inactive'}
                          onClick={() => handleActivateSpeaker(node.id)}
                        >
                          <Volume2 className="mr-2 h-4 w-4" />
                          <span>Activate Speaker</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setNodeToDelete(node)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Remove</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
