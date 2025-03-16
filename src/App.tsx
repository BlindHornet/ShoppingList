//Library Imports
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//Component Imports
import Home from "./components/Dashboard";
import RecipesPage from "./features/Recipes/RecipesPage";
import AddRecipeModal from "./features/Recipes/AddrecipeModal";

// const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);

function Header() {
  return (
    <header className="bg-gray-800 text-gray-100 py-4 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-center items-center">
        <nav>
          <ul className="flex space-x-8 text-lg font-semibold">
            <li>
              <Link
                to="/recipes"
                className="hover:text-blue-400 transition duration-200"
              >
                Recipes
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="hover:text-blue-400 transition duration-200"
              >
                Shopping List
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Header />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route
          path="/recipes/add"
          element={
            <AddRecipeModal
              isOpen={false}
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
