import {
  Sparkles,
  Rocket,
  Download,
  Store,
  GitBranch,
  Plus,
  Home,
  LayoutDashboard,
} from "lucide-react";

interface HeaderProps {
  projectName?: string;
  appType?: string;
  onNew: () => void;
  onHome: () => void;
  onDashboard: () => void;
  onDeploy?: () => void;
  onExport?: () => void;
  onStore?: () => void;
  onVersions?: () => void;
  buildComplete?: boolean;
  showActions?: boolean;
}

export default function Header({
  projectName,
  appType,
  onNew,
  onHome,
  onDashboard,
  onDeploy,
  onExport,
  onStore,
  onVersions,
  buildComplete = false,
  showActions = false,
}: HeaderProps) {
  const actionsVisible = buildComplete || showActions;

  const navItems = [
    {
      label: "Build",
      icon: Home,
      onClick: onHome,
    },
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: onDashboard,
    },
  ];

  const actionButtons = [
    {
      label: "Deploy",
      icon: Rocket,
      onClick: onDeploy,
      primary: true,
    },
    {
      label: "Export",
      icon: Download,
      onClick: onExport,
      primary: false,
    },
    {
      label: "Store Assets",
      icon: Store,
      onClick: onStore,
      primary: false,
    },
    {
      label: "Version History",
      icon: GitBranch,
      onClick: onVersions,
      primary: false,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: Logo + project info */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onHome}
            className="group flex shrink-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-80"
            aria-label="AppForge home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-lg shadow-fuchsia-500/20 transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="hidden text-base font-semibold tracking-tight text-white sm:block">
              AppForge
            </span>
          </button>

          {/* Project context */}
          {projectName && (
            <div className="flex min-w-0 items-center gap-2 border-l border-slate-800 pl-3">
              <span className="truncate text-sm font-medium text-slate-200">
                {projectName}
              </span>
              {appType && (
                <span className="hidden shrink-0 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-xs font-medium text-slate-300 sm:inline-block">
                  {appType}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center/Right: Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Action buttons + New */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {actionsVisible &&
            actionButtons.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  title={action.label}
                  className={[
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    action.primary
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20 hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-fuchsia-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  <span className={action.primary ? "hidden lg:inline" : "hidden lg:inline"}>
                    {action.label}
                  </span>
                </button>
              );
            })}

          <button
            onClick={onNew}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-slate-600 hover:bg-slate-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>
    </header>
  );
}
