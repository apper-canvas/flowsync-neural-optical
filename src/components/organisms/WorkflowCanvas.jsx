import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import WorkflowNode from "@/components/organisms/WorkflowNode";
import NodeConfigPanel from "@/components/organisms/NodeConfigPanel";
import ServiceSelectorModal from "@/components/organisms/ServiceSelectorModal";

const WorkflowCanvas = ({ 
  workflow, 
  onUpdateWorkflow, 
  onSave,
  onTest,
  isSaving = false,
  isTesting = false 
}) => {
  const [nodes, setNodes] = useState(workflow?.nodes || []);
  const [connections, setConnections] = useState(workflow?.connections || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // Update local state when workflow changes
  useEffect(() => {
    if (workflow) {
      setNodes(workflow.nodes || []);
      setConnections(workflow.connections || []);
    }
  }, [workflow]);

  // Notify parent of changes
  useEffect(() => {
    onUpdateWorkflow({ nodes, connections });
  }, [nodes, connections, onUpdateWorkflow]);

  const handleNodeDragStart = useCallback((nodeId, event) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - (node.position.x + pan.x) * zoom;
    const offsetY = event.clientY - rect.top - (node.position.y + pan.y) * zoom;

    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  }, [nodes, pan, zoom]);

  const handleMouseMove = useCallback((event) => {
    if (draggedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - dragOffset.x - pan.x * zoom) / zoom;
      const y = (event.clientY - rect.top - dragOffset.y - pan.y * zoom) / zoom;

      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === draggedNode 
            ? { ...node, position: { x: Math.max(0, x), y: Math.max(0, y) } }
            : node
        )
      );
    } else if (isPanning) {
      const deltaX = event.clientX - panStart.x;
      const deltaY = event.clientY - panStart.y;
      setPan(prevPan => ({ 
        x: prevPan.x + deltaX / zoom, 
        y: prevPan.y + deltaY / zoom 
      }));
      setPanStart({ x: event.clientX, y: event.clientY });
    }
  }, [draggedNode, dragOffset, pan, zoom, isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setIsPanning(false);
  }, []);

  const handleCanvasMouseDown = (event) => {
    if (event.target === canvasRef.current || event.target === svgRef.current) {
      setSelectedNode(null);
      setIsPanning(true);
      setPanStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleAddNode = (serviceData) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: serviceData.type,
      service: serviceData.service,
      action: serviceData.action,
      position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
      config: {}
    };
    
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    setShowServiceSelector(false);
  };

  const handleNodeUpdate = (nodeId, updates) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  };

  const handleNodeDelete = (nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setConnections(prevConnections => 
      prevConnections.filter(conn => 
        conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
      )
    );
    setSelectedNode(null);
  };

  const handleConnection = (sourceId, targetId) => {
    const newConnection = {
      id: `conn-${Date.now()}`,
      sourceNodeId: sourceId,
      targetNodeId: targetId
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleZoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const getNodeConnections = (nodeId) => {
    return connections.filter(conn => 
      conn.sourceNodeId === nodeId || conn.targetNodeId === nodeId
    );
  };

  const renderConnection = (connection) => {
    const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
    const targetNode = nodes.find(n => n.id === connection.targetNodeId);
    
    if (!sourceNode || !targetNode) return null;

    const sourceX = sourceNode.position.x + 150; // Node width/2
    const sourceY = sourceNode.position.y + 40;  // Node height/2
    const targetX = targetNode.position.x + 150;
    const targetY = targetNode.position.y + 40;

    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    const pathData = `M ${sourceX} ${sourceY} Q ${midX} ${sourceY} ${midX} ${midY} Q ${midX} ${targetY} ${targetX} ${targetY}`;

    return (
      <g key={connection.id}>
        <path
          d={pathData}
          stroke="#6366f1"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          className="node-connection"
        />
        <circle
          cx={midX}
          cy={midY}
          r="3"
          fill="#ec4899"
          className="animate-pulse"
        />
      </g>
    );
  };

  // Event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="flex h-full">
      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-white rounded-xl border border-gray-200">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
          <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowServiceSelector(true)}
              className="text-primary hover:bg-primary/10"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
              Add Node
            </Button>
          </div>

          <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ApperIcon name="Minus" className="w-4 h-4" />
            </Button>
            <span className="px-2 text-sm font-medium min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleZoomReset}>
              <ApperIcon name="RotateCcw" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onTest}
            disabled={isTesting || nodes.length === 0}
            className="bg-white shadow-lg"
          >
            {isTesting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <ApperIcon name="Play" className="w-4 h-4 mr-2" />
                Test
              </>
            )}
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving || nodes.length === 0}
            className="bg-gradient-to-r from-primary to-secondary shadow-lg"
          >
            {isSaving ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="w-full h-full canvas-grid cursor-grab active:cursor-grabbing"
          onMouseDown={handleCanvasMouseDown}
          style={{
            backgroundPosition: `${pan.x * zoom}px ${pan.y * zoom}px`,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`
          }}
        >
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              transform: `translate(${pan.x * zoom}px, ${pan.y * zoom}px) scale(${zoom})`
            }}
          >
            {connections.map(renderConnection)}
          </svg>

          <div
            style={{
              transform: `translate(${pan.x * zoom}px, ${pan.y * zoom}px) scale(${zoom})`,
              transformOrigin: "0 0"
            }}
            className="absolute inset-0"
          >
            {nodes.map((node) => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onSelect={setSelectedNode}
                onDragStart={handleNodeDragStart}
                onUpdate={handleNodeUpdate}
                onDelete={handleNodeDelete}
                onConnect={handleConnection}
                connections={getNodeConnections(node.id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Workflow" className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Start building your workflow</h3>
                <p className="text-gray-600 mb-6">Add your first node to begin creating an automation</p>
                <Button
                  onClick={() => setShowServiceSelector(true)}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add First Node
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Panel */}
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onUpdate={(updates) => handleNodeUpdate(selectedNode.id, updates)}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Service Selector Modal */}
      <ServiceSelectorModal
        isOpen={showServiceSelector}
        onClose={() => setShowServiceSelector(false)}
        onSelect={handleAddNode}
      />
    </div>
  );
};

export default WorkflowCanvas;