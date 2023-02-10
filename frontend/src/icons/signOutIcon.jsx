import {SignOut} from "phosphor-react";

export default function SignOutIcon ({
                                   fill = 'currentColor',
                                   filled,
                                   size,
                                   height,
                                   width,
                                   label,
                                   ...props
                                 }) {
  return (
    <SignOut
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};