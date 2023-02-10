import {UserCirclePlus} from "phosphor-react";

export default function RequestsIcon ({
                                   fill = 'currentColor',
                                   filled,
                                   size,
                                   height,
                                   width,
                                   label,
                                   ...props
                                 }) {
  return (
    <UserCirclePlus
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};