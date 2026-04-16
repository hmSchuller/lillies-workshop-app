// DX/helper wiring.
// Public launcher that delegates to the native module and optionally normalises
// the result before handing it back to app code.
import NativeAddLillieboxModule from './NativeAddLillieboxModule';
import type {AddLillieboxResult} from './NativeAddLillieboxModule';

export type {AddLillieboxResult};

// TODO (Level 1): Decide how defensive you want the JS boundary to be.
//
// Workshop baseline:
//  1) Await NativeAddLillieboxModule.launchAddLilliebox()
//  2) Return that typed result to app code
//
// Optional stretch:
//  - validate / normalize if you want a defensive JS boundary around native
//  - ensure cancelled results use serialNumber:null and addedVia:null
export async function launchAddLilliebox(): Promise<AddLillieboxResult> {
  console.log('[RNAddLilliebox] JS launcher called');

  // TODO: for the baseline exercise, capture the native result and return it.
  const result = await NativeAddLillieboxModule.launchAddLilliebox();
  return result;
}
