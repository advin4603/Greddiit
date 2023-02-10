import {Flag} from "phosphor-react";

export default function ReportIcon ({
                                     fill = 'currentColor',
                                     filled,
                                     size,
                                     height,
                                     width,
                                     label,
                                     ...props
                                   }) {
  return (
    <Flag
      width={size || width || 32}
      height={size || height || 32}
      {...props}
    />
  );
};