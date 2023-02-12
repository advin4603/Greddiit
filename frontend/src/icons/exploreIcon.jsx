import {Binoculars} from "phosphor-react";

export default function ExploreIcon ({
                                       fill = 'currentColor',
                                       filled,
                                       size,
                                       height,
                                       width,
                                       label,
                                       ...props
                                     }) {
  return (
    <Binoculars
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};