'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
          ? 'var(--accent)'
          : data.isActive && data.simulating
          ? 'var(--success)'
          : cfg.color,
        background: selected
          ? 'var(--accent-subtle)'
          : data.isActive && data.simulating
          ? 'var(--success-bg)'
          : 'var(--surface)',
        minWidth: 140,
        position: 'relative',
        boxShadow: selected ? '0 0 0 2px var(--accent-muted)' : undefined,
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
            background: 'var(--success)',
            boxShadow: '0 0 0 3px var(--success-bg)',
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
      markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-strong)' },
      style: { stroke: 'var(--border-strong)', strokeWidth: 1.5 },
      labelStyle: { fill: 'var(--text-secondary)', fontSize: 11 },
      labelBgStyle: { fill: 'var(--surface)' },
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
    const newEdge = {
      ...params,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    setEdges(eds => addEdge(newEdge, eds));
    // Sync new edge to workflow
    const edgeId = `edge-${Date.now()}`;
    const wfEdge: WorkflowEdge = {
      id: edgeId,
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
  }, [workflow.edges, onEdgeSelect, onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
    onEdgeSelect(null);
  }, [onNodeSelect, onEdgeSelect]);

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
    // Sync to workflow
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
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--border)"
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const type = node.data?.type as WorkflowNodeType;
            return NODE_TYPE_CONFIG[type]?.color || 'var(--gray-400)';
          }}
          style={{ background: 'var(--surface)' }}
        />
      </ReactFlow>
    </div>
  );
}