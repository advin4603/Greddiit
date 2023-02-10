import {PlusCircle} from "phosphor-react";

export default function AddIcon ({
                                    fill = 'currentColor',
                                    filled,
                                    size,
                                    height,
                                    width,
                                    label,
                                    ...props
                                  }) {
  return (
    <PlusCircle
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};