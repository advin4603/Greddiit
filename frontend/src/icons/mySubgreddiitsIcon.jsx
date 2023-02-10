import {Browsers} from "phosphor-react";

export default function MySubgreddiitsIcon ({
                                       fill = 'currentColor',
                                       filled,
                                       size,
                                       height,
                                       width,
                                       label,
                                       ...props
                                     }) {
  return (
    <Browsers
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};