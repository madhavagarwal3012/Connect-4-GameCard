import React from 'react';
import { Connect4Card } from './components/Connect4Card';
import { Connect4GameController } from './components/Connect4GameController';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="container mx-auto px-4 py-8">
        {/* Connect 4 Card Preview */}
        <Connect4Card />
        
        {/* Connect 4 Game Controller */}
        <div className="mt-8">
          <Connect4GameController />
        </div>
      </main>
    </div>
  );
}

export default App;