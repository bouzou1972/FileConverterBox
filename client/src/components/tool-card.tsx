import { Link } from "wouter";

interface ToolCardProps {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

export default function ToolCard({ href, icon, iconColor, title, description }: ToolCardProps) {
  return (
    <Link href={href}>
      <button className="bg-white shadow rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-200 text-left w-full">
        <span className={`material-icons ${iconColor} text-4xl`}>
          {icon}
        </span>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </button>
    </Link>
  );
}
