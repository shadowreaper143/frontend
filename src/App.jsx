// src/App.jsx
import ProductList from "./pages/ProductList"; // <-- Check this import path
import "./index.css"; // Ensure styles are imported

function App() {
  return (
    <div className="App">
      <ProductList /> 
    </div>
  );
}

export default App; // <-- Must use 'export default'