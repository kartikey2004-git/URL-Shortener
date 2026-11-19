import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/** Maximum number of cities plotted. */
const MAX_CITIES = 5;
/** Longer city names are truncated to this many characters (with an ellipsis). */
const CITY_LABEL_MAX_LENGTH = 15;
const CITY_LABEL_TRUNCATED_LENGTH = 12;

const AXIS_TICK = { fill: "hsl(var(--muted-foreground))", fontSize: 12 };

function countByCity(clicks) {
  const counts = {};
  for (const click of clicks) {
    const city = click.city || "Unknown";
    counts[city] = (counts[city] || 0) + 1;
  }

  return Object.entries(counts).map(([city, count]) => ({
    city:
      city.length > CITY_LABEL_MAX_LENGTH
        ? `${city.slice(0, CITY_LABEL_TRUNCATED_LENGTH)}...`
        : city,
    count,
  }));
}

/** Line chart of click counts for the top cities. */
export function LocationStats({ clicks }) {
  const cities = countByCity(clicks).slice(0, MAX_CITIES);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={cities} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <XAxis dataKey="city" tick={AXIS_TICK} interval={0} angle={-20} textAnchor="end" />
          <YAxis tick={AXIS_TICK} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              color: "hsl(var(--popover-foreground))",
            }}
            labelStyle={{ color: "hsl(var(--popover-foreground))" }}
            itemStyle={{ color: "hsl(var(--primary))" }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

LocationStats.propTypes = {
  clicks: PropTypes.arrayOf(
    PropTypes.shape({ city: PropTypes.string })
  ).isRequired,
};
