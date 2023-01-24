import {PencilSimple} from "phosphor-react";

export default function EditIcon ({
                           fill = 'currentColor',
                           filled,
                           size,
                           height,
                           width,
                           label,
                           ...props
                         }) {
  return (
    <PencilSimple
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};