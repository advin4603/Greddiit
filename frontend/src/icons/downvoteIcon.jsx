import {ArrowCircleDown} from "phosphor-react";

export default function DownvoteIcon ({
                                      fill = 'currentColor',
                                      filled,
                                      size,
                                      height,
                                      width,
                                      label,
                                      ...props
                                    }) {
  return (
    <ArrowCircleDown
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};