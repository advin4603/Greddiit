import {Funnel} from "phosphor-react";

export default function FilterIcon ({
                                   fill = 'currentColor',
                                   filled,
                                   size,
                                   height,
                                   width,
                                   label,
                                   ...props
                                 }) {
  return (
    <Funnel
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};