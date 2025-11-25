import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [taches, setTaches] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/taches')
      .then(response => response.json())
      .then(data => setTaches(data))
      .catch(err => console.error('Erreur API :', err));

    //tester le delete en dur
    // fetch(`http://localhost:3000/tache/6925876f9d153ca8512b31c0/delete`, {
    //   method: "POST"
    // })
    //   .then(res => res.json())
    //   .then(console.log)
    //   .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Liste des tâches</h1>

      {taches.length === 0 ? (
        <p>Aucune tâche trouvée...</p>
      ) : (
        <ul>
          {taches.map((t, index) => (
            <li key={t._id || index}>
              <strong>{t.titre}</strong> — {t.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
