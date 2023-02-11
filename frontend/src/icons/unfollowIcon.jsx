import {UserCircleMinus} from "phosphor-react";

export default function UnfollowIcon ({
                                      fill = 'currentColor',
                                      filled,
                                      size,
                                      height,
                                      width,
                                      label,
                                      ...props
                                    }) {
  return (
    <UserCircleMinus
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};