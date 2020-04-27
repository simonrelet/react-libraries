'use strict'

const { ExecutionResultSnapshotSerializer } = require('./scriptExecution')
const { FileCompilationSnapshotSerializer } = require('./fixtureContent')

const t = `
┬ build/
├─┬ cjs/
│ ├─┬ charts/
│ │ ├── .storybook/
│ │ ├── doc/
│ │ └── src/
│ ├── doc/
│ └─┬ ui/
│   ├── .storybook/
│   ├── doc/
│   ├── scripts/
│   └── src/
└── es/
`

expect.addSnapshotSerializer(ExecutionResultSnapshotSerializer)
expect.addSnapshotSerializer(FileCompilationSnapshotSerializer)

function printTree(tree, indentation) {
  const indentationStr = indentation
    .map((isLast, index) => {
      if (index === indentation.length - 1) {
        return isLast ? '└─' : '├─'
      }

      return isLast ? '  ' : '│ '
    })
    .join('')

  const children = Object.values(tree.children)
    .map((child, index, children) =>
      printTree(child, indentation.concat([index === children.length - 1]))
    )
    .join('')

  const file = children === '' ? `─ ${tree.file}` : `┬ ${tree.file}/`

  return `${indentationStr}${file}\n${children}`
}

expect.addSnapshotSerializer({
  test: (val) => val !== null && val.$$type === Symbol.for('rl.fileTree'),
  print: (tree) => printTree(tree, []),
})
