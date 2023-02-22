import {CursorText} from "phosphor-react";

export default function NameIcon ({
                                   fill = 'currentColor',
                                   filled,
                                   size,
                                   height,
                                   width,
                                   label,
                                   ...props
                                 }) {
  return (
    <CursorText
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};