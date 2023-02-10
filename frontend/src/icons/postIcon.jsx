import {NotePencil} from "phosphor-react";

export default function PostIcon ({
                                     fill = 'currentColor',
                                     filled,
                                     size,
                                     height,
                                     width,
                                     label,
                                     ...props
                                   }) {
  return (
    <NotePencil
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};