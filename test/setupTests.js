'use strict'

const { ExecutionResultSnapshotSerializer } = require('./scriptExecution')
const { FileCompilationSnapshotSerializer } = require('./fixtureContent')

expect.addSnapshotSerializer(ExecutionResultSnapshotSerializer)
expect.addSnapshotSerializer(FileCompilationSnapshotSerializer)
