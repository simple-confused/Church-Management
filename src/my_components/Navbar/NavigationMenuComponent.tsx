import Link from "next/link";
import { memo } from "react";

interface NavigationMenuComponentProps {
  title: string;
  path: string;
}

function NavigationMenuComponent({
  props,
}: {
  props: NavigationMenuComponentProps[];
}) {
  return (
    <div className="flex flex-col gap-2 items-center">
      {props.map(({ title, path }) => (
        <Link
          href={path}
          key={path}
          className="w-full text-lg sm:text-xl text-slate-700 hover:text-slate-950 focus:text-slate-950 hover:bg-slate-50 focus:bg-slate-50 py-2 px-4 rounded-lg transition-colors duration-150"
        >
          {title}
        </Link>
      ))}
    </div>
  );
}

export default memo(NavigationMenuComponent);
