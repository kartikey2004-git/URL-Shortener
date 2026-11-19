import { ProgressBar } from "@/components/ui/progress-bar";

export function PageProgress() {
  return (
    <div className="fixed inset-x-0 top-0 z-(--z-progress)">
      <ProgressBar />
    </div>
  );
}
