import { useEffect, useState } from "react";
import Overview from "./junior/OverviewJr";
import Groups from "../components/junior/GroupsJr";
import Schedule from "../components/junior/ScheduleJr";
import Results from "../components/junior/ResultsJr";

interface Under16Props {
  section?: string; // puede venir "overview" | "groups" | "schedule" | "results"
}

export default function Under16({ section = "overview" }: Under16Props) {
  const [activeTabJr, setActiveTabJr] = useState<string>(section);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('admin');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Si cambia la prop desde Home (ej. user clicó Sub-16 -> Groups), sincronizamos el estado interno
  useEffect(() => {
    setActiveTabJr(section);
  }, [section]);

  return (
    <main className="container main-content">
      {activeTabJr === "overview" && <Overview />}
      {activeTabJr === "groups" && <Groups />}
      {activeTabJr === "schedule" && <Schedule />}
      {activeTabJr === "results" && <Results />}
    </main>
  );
}
