import {ChatDots} from "phosphor-react";

export default function CommentIcon ({
                                   fill = 'currentColor',
                                   filled,
                                   size,
                                   height,
                                   width,
                                   label,
                                   ...props
                                 }) {
  return (
    <ChatDots
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};