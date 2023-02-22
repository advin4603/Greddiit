import {Bookmarks} from "phosphor-react";

export default function SavedPostsIcon ({
                                        fill = 'currentColor',
                                        filled,
                                        size,
                                        height,
                                        width,
                                        label,
                                        ...props
                                      }) {
  return (
    <Bookmarks
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};