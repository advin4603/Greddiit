import {Gear} from "phosphor-react";

export default function SettingsIcon ({
                                   fill = 'currentColor',
                                   filled,
                                   size,
                                   height,
                                   width,
                                   label,
                                   ...props
                                 }) {
  return (
    <Gear
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};