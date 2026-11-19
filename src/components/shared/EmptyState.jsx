import PropTypes from "prop-types";

import { Card } from "@/components/ui/card";


export function EmptyState({ icon: Icon, title, description }) {
  return (
    <Card className="flex flex-col items-center gap-4 border-dashed bg-muted/10 p-16 text-center">
      <div className="rounded-full bg-muted p-3">
        <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
