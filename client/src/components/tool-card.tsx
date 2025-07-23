import { Link } from "wouter";

interface ToolCardProps {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  badge?: string;
}

export default function ToolCard({ href, icon, iconColor, title, description, badge }: ToolCardProps) {
  return (
    <Link href={href}>
      <button 
        className="bg-card border border-border shadow rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 hover:shadow-lg hover:border-primary/20 transition-all duration-200 text-left w-full relative dark:hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`${title} - ${description}`}
      >
        {badge && (
          <span className="absolute top-3 right-3 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full font-medium">
            {badge}
          </span>
        )}
        <span className={`material-icons ${iconColor} text-3xl sm:text-4xl flex-shrink-0`} aria-hidden="true">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-foreground pr-8">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </button>
    </Link>
  );
}
