import {Prohibit} from "phosphor-react";

export default function BlockIcon ({
                                   fill = 'currentColor',
                                   filled,
                                   size,
                                   height,
                                   width,
                                   label,
                                   ...props
                                 }) {
  return (
    <Prohibit
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};