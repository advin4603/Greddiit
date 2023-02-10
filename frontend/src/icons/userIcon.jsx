import {User} from "phosphor-react";

export default function UserIcon ({
                                       fill = 'currentColor',
                                       filled,
                                       size,
                                       height,
                                       width,
                                       label,
                                       ...props
                                     }) {
  return (
    <User
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};