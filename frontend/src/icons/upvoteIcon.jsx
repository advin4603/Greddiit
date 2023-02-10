import {ArrowCircleUp} from "phosphor-react";

export default function UpvoteIcon ({
                                   fill = 'currentColor',
                                   filled,
                                   size,
                                   height,
                                   width,
                                   label,
                                   ...props
                                 }) {
  return (
    <ArrowCircleUp
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};