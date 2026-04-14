import NativeAddLillieboxModule from './NativeAddLillieboxModule';
import type {AddLillieboxResult} from './NativeAddLillieboxModule';

export type {AddLillieboxResult};

export function launchAddLilliebox(): Promise<AddLillieboxResult> {
  console.log('[RNAddLilliebox] JS launcher called');
  return NativeAddLillieboxModule.launchAddLilliebox();
}
