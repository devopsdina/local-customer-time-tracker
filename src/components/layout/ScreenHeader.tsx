import { ArrowLeft } from "lucide-react";

interface ScreenHeaderProps {
  title: React.ReactNode;
  onBack: () => void;
}

export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between mb-3 min-h-[28px]">
      <div className="flex-1 flex items-center">
        <h1 className="text-base font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100">
          {title}
        </h1>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="rounded-full p-1.5 bg-muted ring-2 ring-accent transition-opacity hover:opacity-100 hover:bg-accent hover:text-accent-foreground focus:outline-none h-6 w-6 flex items-center justify-center flex-shrink-0 ml-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span className="sr-only">Back</span>
      </button>
    </div>
  );
}
