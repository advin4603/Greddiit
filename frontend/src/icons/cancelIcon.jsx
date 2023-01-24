import {X} from "phosphor-react";

export default function CancelIcon ({
                                    fill = 'currentColor',
                                    filled,
                                    size,
                                    height,
                                    width,
                                    label,
                                    ...props
                                  }) {
  return (
    <X
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};

