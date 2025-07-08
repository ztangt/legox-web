var nodes = [
  { name: '总经理' },
  { name: '部门经理' },
  { name: '员工A' },
  { name: '员工B' },
  { name: '员工C' },
  { name: '员工D' },
]

var links = [
  { source: '总经理', target: '部门经理' },
  { source: '部门经理', target: '员工A' },
  { source: '部门经理', target: '员工B' },
  { source: '部门经理', target: '员工C' },
  { source: '部门经理', target: '员工D' },
]

var option = {
  title: { text: '单位组织关系图' },
  tooltip: {},
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'force',
      roam: true,
      label: { show: true },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: { fontWeight: 'bold' },
      data: nodes,
      links: links,
      force: { repulsion: 100, edgeLength: 50 },
    },
  ],
}
