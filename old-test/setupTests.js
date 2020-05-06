'use strict'

const {
  FileCompilationSnapshotSerializer,
  ExecutionResultSnapshotSerializer,
} = require('./fixtureUtils')

expect.addSnapshotSerializer(FileCompilationSnapshotSerializer)
expect.addSnapshotSerializer(ExecutionResultSnapshotSerializer)
