'use strict'

const { FileCompilationSnapshotSerializer } = require('./fixtureUtils')
const { ExecutionResultSnapshotSerializer } = require('./scriptExecution')

expect.addSnapshotSerializer(FileCompilationSnapshotSerializer)
expect.addSnapshotSerializer(ExecutionResultSnapshotSerializer)
