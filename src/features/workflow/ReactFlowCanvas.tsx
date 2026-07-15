'use client';
import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import type { Workflow, WorkflowNode, WorkflowEdge, WorkflowNodeType } from '@/mocks/types';
import { NODE_TYPE_CONFIG } from './WorkflowPage';
import { ACTIONS } from '@/mocks/data';

// Edge color constants — CSS variables don't work in SVG stroke attributes
const EDGE_COLOR = '#94a3b8';
const EDGE_COLOR_SELECTED = '#6366f1';

// ─── Custom Node ──────────────────────────────────────────────────────────────
const CustomNode = ({
  data,
  selected,
}: {
  data: {
    label: string;
    type: WorkflowNodeType;
    simulating: boolean;
    isActive: boolean;
    actionId?: string;
    onActionClick?: (id: string) => void;
    t: (ar: string, en: string) => string;
    lang: 'ar' | 'en';
  };
  selected?: boolean;
}) => {
  const cfg = NODE_TYPE_CONFIG[data.type];
  const action = data.actionId ? ACTIONS.find(a => a.id === data.actionId) : null;

  return (
    <div
      className="wf-node"
      style={{
        borderColor: selected
          ? '#6366f1'
          : data.isActive && data.simulating
          ? '#22c55e'
          : cfg.color,
        background: selected
          ? 'rgba(99,102,241,0.08)'
          : data.isActive && data.simulating
          ? 'rgba(34,197,94,0.08)'
          : 'var(--surface)',
        minWidth: 140,
        position: 'relative',
        boxShadow: selected ? '0 0 0 2px rgba(99,102,241,0.3)' : undefined,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex-shrink-0 flex items-center justify-center rounded text-xs font-bold"
          style={{ width: 22, height: 22, background: `color-mix(in srgb, ${cfg.color} 15%, transparent)`, color: cfg.color }}
        >
          {cfg.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {data.label}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {data.lang === 'ar' ? cfg.ar : cfg.en}
          </div>
        </div>
      </div>

      {data.type === 'action' && action && (
        <button
          onClick={() => data.actionId && data.onActionClick?.(data.actionId)}
          className="mt-1 text-xs hover:underline block"
          style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {data.lang === 'ar' ? action.name.ar : action.name.en} ↗
        </button>
      )}

      {data.isActive && data.simulating && (
        <div
          className="absolute rounded-full"
          style={{
            top: -4,
            insetInlineEnd: -4,
            width: 10,
            height: 10,
            background: '#22c55e',
            boxShadow: '0 0 0 3px rgba(34,197,94,0.2)',
          }}
          aria-label="Active node"
        />
      )}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

// ─── React Flow Canvas ────────────────────────────────────────────────────────
interface Props {
  workflow: Workflow;
  simulating: boolean;
  simStep: number;
  isReadOnly: boolean;
  dragNodeType: WorkflowNodeType | null;
  onWorkflowChange: (wf: Workflow) => void;
  onActionClick: (actionId: string) => void;
  onNodeSelect: (node: WorkflowNode | null) => void;
  onEdgeSelect: (edge: WorkflowEdge | null) => void;
  t: (ar: string, en: string) => string;
  lang: 'ar' | 'en';
}

export default function ReactFlowCanvas({
  workflow,
  simulating,
  simStep,
  isReadOnly,
  dragNodeType,
  onWorkflowChange,
  onActionClick,
  onNodeSelect,
  onEdgeSelect,
  t,
  lang,
}: Props) {
  const toRFNodes = useCallback((wf: Workflow): Node[] =>
    wf.nodes.map((n, idx) => ({
      id: n.id,
      type: 'custom',
      position: n.position,
      data: {
        label: lang === 'ar' ? n.label.ar : n.label.en,
        type: n.type,
        simulating,
        isActive: simulating && idx === simStep,
        actionId: n.actionId,
        onActionClick,
        t,
        lang,
      },
      draggable: !isReadOnly,
    })),
    [lang, simulating, simStep, isReadOnly, onActionClick, t]
  );

  const toRFEdges = useCallback((wf: Workflow): Edge[] =>
    wf.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label ? (lang === 'ar' ? e.label.ar : e.label.en) : undefined,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: EDGE_COLOR,
        width: 18,
        height: 18,
      },
      style: {
        stroke: EDGE_COLOR,
        strokeWidth: 2,
      },
      labelStyle: { fill: '#64748b', fontSize: 11 },
      labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.9 },
      labelBgPadding: [4, 6] as [number, number],
      labelBgBorderRadius: 4,
    })),
    [lang]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(toRFNodes(workflow));
  const [edges, setEdges, onEdgesChange] = useEdgesState(toRFEdges(workflow));

  useEffect(() => {
    setNodes(toRFNodes(workflow));
    setEdges(toRFEdges(workflow));
  }, [workflow, toRFNodes, toRFEdges, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    if (isReadOnly) return;
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: params.source || '',
      target: params.target || '',
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: EDGE_COLOR,
        width: 18,
        height: 18,
      },
      style: { stroke: EDGE_COLOR, strokeWidth: 2 },
    };
    setEdges(eds => addEdge(newEdge, eds));
    const wfEdge: WorkflowEdge = {
      id: newEdge.id,
      source: params.source || '',
      target: params.target || '',
    };
    onWorkflowChange({
      ...workflow,
      edges: [...workflow.edges, wfEdge],
    });
  }, [isReadOnly, setEdges, workflow, onWorkflowChange]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const wfNode = workflow.nodes.find(n => n.id === node.id);
    onNodeSelect(wfNode || null);
    onEdgeSelect(null);
  }, [workflow.nodes, onNodeSelect, onEdgeSelect]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    const wfEdge = workflow.edges.find(e => e.id === edge.id);
    onEdgeSelect(wfEdge || null);
    onNodeSelect(null);
    setEdges(eds => eds.map(e => ({
      ...e,
      style: {
        ...e.style,
        stroke: e.id === edge.id ? EDGE_COLOR_SELECTED : EDGE_COLOR,
        strokeWidth: e.id === edge.id ? 2.5 : 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: e.id === edge.id ? EDGE_COLOR_SELECTED : EDGE_COLOR,
        width: 18,
        height: 18,
      },
    })));
  }, [workflow.edges, onEdgeSelect, onNodeSelect, setEdges]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
    onEdgeSelect(null);
    setEdges(eds => eds.map(e => ({
      ...e,
      style: { ...e.style, stroke: EDGE_COLOR, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_COLOR, width: 18, height: 18 },
    })));
  }, [onNodeSelect, onEdgeSelect, setEdges]);

  const onDrop = useCallback((event: React.DragEvent) => {
    if (!dragNodeType || isReadOnly) return;
    event.preventDefault();
    const cfg = NODE_TYPE_CONFIG[dragNodeType];
    const newNodeId = `node-drop-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position: { x: event.clientX - 300, y: event.clientY - 100 },
      data: {
        label: lang === 'ar' ? cfg.ar : cfg.en,
        type: dragNodeType,
        simulating: false,
        isActive: false,
        t,
        lang,
      },
      draggable: true,
    };
    setNodes(nds => [...nds, newNode]);
    const wfNode: WorkflowNode = {
      id: newNodeId,
      type: dragNodeType,
      label: { ar: cfg.ar, en: cfg.en },
      position: { x: event.clientX - 300, y: event.clientY - 100 },
    };
    onWorkflowChange({
      ...workflow,
      nodes: [...workflow.nodes, wfNode],
    });
  }, [dragNodeType, isReadOnly, lang, t, setNodes, workflow, onWorkflowChange]);

  return (
    <div style={{ width: '100%', height: '100%' }} onDrop={onDrop} onDragOver={e => e.preventDefault()}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isReadOnly ? undefined : onNodesChange}
        onEdgesChange={isReadOnly ? undefined : onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        style={{ background: 'var(--background)' }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_COLOR, width: 18, height: 18 },
          style: { stroke: EDGE_COLOR, strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e2e8f0"
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const type = node.data?.type as WorkflowNodeType;
            return NODE_TYPE_CONFIG[type]?.color || '#94a3b8';
          }}
          style={{ background: 'var(--surface)' }}
        />
      </ReactFlow>
    </div>
  );
}