import { requireNativeView } from 'expo';
import * as React from 'react';

import { LillieShakerViewProps } from './LillieShaker.types';

const NativeView: React.ComponentType<LillieShakerViewProps> =
  requireNativeView('LillieShaker');

export default function LillieShakerView(props: LillieShakerViewProps) {
  return <NativeView {...props} />;
}
