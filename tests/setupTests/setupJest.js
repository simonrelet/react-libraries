'use strict'

// FileCompilationSnapshotSerializer,
// expect.addSnapshotSerializer(FileCompilationSnapshotSerializer)
const { ExecutionResultSnapshotSerializer } = require('./scriptExecution')

expect.addSnapshotSerializer(ExecutionResultSnapshotSerializer)
