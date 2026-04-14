import NativeAddLillieboxModule from './NativeAddLillieboxModule';
import type {AddLillieboxResult} from './NativeAddLillieboxModule';

export type {AddLillieboxResult};

// TODO (Level 1): Implement the result-pattern normalization.
//
// Desired behaviour:
//  1) Await NativeAddLillieboxModule.launchAddLilliebox()
//  2) Validate / normalize unknown native payload to the strict AddLillieboxResult shape
//  3) Return a safe, typed object to app code
//
// Hints:
//  - status must be 'completed' | 'cancelled'
//  - addedVia must be 'qr' | 'manual' | 'nfc' | null
//  - if status is 'cancelled', serialNumber and addedVia should be null
export async function launchAddLilliebox(): Promise<AddLillieboxResult> {
  console.log('[RNAddLilliebox] JS launcher called');

  // TODO: replace fallback with normalized native result.
  await NativeAddLillieboxModule.launchAddLilliebox();
  return {
    status: 'cancelled',
    serialNumber: null,
    addedVia: null,
  };
}
