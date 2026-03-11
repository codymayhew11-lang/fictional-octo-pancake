import { useState } from 'react';
import Header from './components/layout/Header';
import PrintHeader from './components/layout/PrintHeader';
import PlanForm from './components/PlanForm/PlanForm';
import PlansList from './components/PlansList/PlansList';
import { usePlan } from './hooks/usePlan';

export default function App() {
  const [view, setView] = useState('form');
  const { plan, setField, workPerformed, workPlanned, equipment, crew, resetPlan } = usePlan();

  const handleNewPlan = () => {
    resetPlan();
    setView('form');
  };

  const handleLoad = (loadedPlan) => {
    resetPlan(loadedPlan);
    setView('form');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        view={view}
        onNewPlan={handleNewPlan}
        onShowSaved={() => setView('list')}
        onPrint={() => window.print()}
      />
      <main>
        <PrintHeader date={plan.date} />
        {view === 'form' ? (
          <PlanForm
            plan={plan}
            setField={setField}
            workPerformed={workPerformed}
            workPlanned={workPlanned}
            equipment={equipment}
            crew={crew}
          />
        ) : (
          <PlansList
            onLoad={handleLoad}
            onBack={() => setView('form')}
          />
        )}
      </main>
    </div>
  );
}
