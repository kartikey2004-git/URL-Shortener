import PropTypes from "prop-types";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Same theme setup as the portfolio: `.dark` class on <html>, system default, no transition flash. */
export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      storageKey="theme"
      themes={["light", "dark", "system"]}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
