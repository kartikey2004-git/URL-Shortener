import PropTypes from "prop-types";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

/** Dashboard summary tile: caption, icon and a single large number. */
export function StatCard({ label, value, icon: Icon }) {
  return (
    <Card className="bg-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="eyebrow">{label}</h3>
        <Icon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
};
