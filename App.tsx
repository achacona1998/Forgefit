import React from "react";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { PaletteProvider } from "./src/context/PaletteContext";
import { DatabaseProvider, useDatabase } from "./src/context/DatabaseContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { LoadingScreen } from "./src/components/ui";

function AppContent() {
  const { initialized } = useDatabase();

  if (!initialized) {
    return <LoadingScreen />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <ThemeProvider>
      <PaletteProvider>
        <DatabaseProvider>
          <AppContent />
        </DatabaseProvider>
      </PaletteProvider>
    </ThemeProvider>
  );
}