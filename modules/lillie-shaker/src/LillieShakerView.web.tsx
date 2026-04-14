import * as React from 'react';

import { LillieShakerViewProps } from './LillieShaker.types';

export default function LillieShakerView(props: LillieShakerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
