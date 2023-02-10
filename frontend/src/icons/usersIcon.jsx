import {UsersThree} from "phosphor-react";

export default function UsersIcon ({
                                    fill = 'currentColor',
                                    filled,
                                    size,
                                    height,
                                    width,
                                    label,
                                    ...props
                                  }) {
  return (
    <UsersThree
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};