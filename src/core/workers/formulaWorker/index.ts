import type { FormulaWorker } from 'types/FormulaWorker'

import FormulaCalculator from './formulaWorker?worker&inline'

// Instantiate a formulaWebWorker singleton re-used across imports
export const formulaWebWorker: FormulaWorker = new FormulaCalculator()
