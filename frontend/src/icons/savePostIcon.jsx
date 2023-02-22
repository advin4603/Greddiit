import {BookmarkSimple} from "phosphor-react";

export default function SavePostIcon ({
                                          fill = 'currentColor',
                                          filled,
                                          size,
                                          height,
                                          width,
                                          label,
                                          ...props
                                        }) {
  return (
    <BookmarkSimple
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};