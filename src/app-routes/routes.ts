export const ROUTES = {
  home: '/',
  records: '/enterprise-data-table-record-list',
  recordTypeBuilder: '/record-type-builder',
  workflowBuilder: '/workflow-canvas-builder',
  governanceActions: '/action-registry',
  governanceActionDetail: (id: string) => `/action-registry/${id}`,
  showcase: '/ui-showcase-design-playground',
  uiReference: '/ui-reference',
} as const;

export type RouteKey = keyof typeof ROUTES;