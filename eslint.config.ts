import type { Linter } from 'eslint'
import antfu from '@antfu/eslint-config'

export default antfu({
  pnpm: true,
}) as Linter.Config
