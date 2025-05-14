import { useState, useEffect } from "react";
import { UserPlus, LogIn, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const HomePage = () => {
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Ajout du champ username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Pour les messages de succès
  const [isLoading, setIsLoading] = useState(false); // État de chargement
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation des champs
    if (!email || !username || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      // Appel à l'API
      const response = await fetch(
        "https://fhn-backend-2.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username, // Correspond au champ "name" dans le backend
            email,
            password,
          }),
          credentials: "include", // Pour inclure les cookies (authToken)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }
      console.log(data);
      // Succès
      setSuccess(
        "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
      );
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // TODO: Ajouter la logique pour consommer l'endpoint de login si disponible
    console.log("Connexion avec:", { email, password });
  };

  const handleModeChange = (mode) => {
    if (mode === authMode) return;

    setIsLoaded(false);
    setTimeout(() => {
      setAuthMode(mode);
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
      setIsLoaded(true);
    }, 300);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="max-w-xl w-full px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md">
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-500 bg-clip-text text-transparent">
                FHN
              </span>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl font-light text-gray-800 tracking-wider">
                Plateforme <span className="font-bold">Horizons Nouveaux</span>
              </h1>
              <p className="mt-2 text-gray-500 font-light">
                Recensement et suivi des enfants
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              {/* Onglets de navigation */}
              <div className="flex mb-8 border-b">
                <div
                  className={`flex-1 text-center py-3 cursor-pointer transition-all ${
                    authMode === "login"
                      ? "border-b-2 border-orange-500 text-orange-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => handleModeChange("login")}
                >
                  <div className="flex items-center justify-center">
                    <LogIn size={18} className="mr-2" />
                    <span>Connexion</span>
                  </div>
                </div>
                <div
                  className={`flex-1 text-center py-3 cursor-pointer transition-all ${
                    authMode === "signup"
                      ? "border-b-2 border-green-500 text-green-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => handleModeChange("signup")}
                >
                  <div className="flex items-center justify-center">
                    <UserPlus size={18} className="mr-2" />
                    <span>Inscription</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {authMode === "login" ? "Connexion" : "Création de compte"}
                </h2>
                <p className="text-gray-500 mt-2">
                  {authMode === "login"
                    ? "Connectez-vous à votre compte"
                    : "Créez un nouveau compte"}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                {/* Champ Username (uniquement pour signup) */}
                {authMode === "signup" && (
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                        placeholder="Votre nom d'utilisateur"
                      />
                    </div>
                  </div>
                )}

                {/* Champ Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                      placeholder="••••••••••"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={16} className="text-gray-400" />
                      ) : (
                        <Eye size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Champ Confirmer le mot de passe (signup) */}
                {authMode === "signup" && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                        placeholder="••••••••••"
                      />
                    </div>
                  </div>
                )}
              </div>

              {authMode === "login" && (
                <div className="flex justify-end mt-2">
                  <span className="text-sm text-orange-500 hover:underline cursor-pointer">
                    Mot de passe oublié ?
                  </span>
                </div>
              )}

              <button
                onClick={authMode === "login" ? handleLogin : handleSignup}
                disabled={isLoading}
                className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium flex items-center justify-center transition-colors ${
                  authMode === "login"
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  "Chargement..."
                ) : authMode === "login" ? (
                  <>
                    <LogIn size={18} className="mr-2" />
                    Se connecter
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="mr-2" />
                    S'inscrire
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-gray-500 text-sm">
              <p>
                Besoin d'aide ?{" "}
                <span className="text-green-500 hover:underline cursor-pointer">
                  Contactez-nous
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Fondation Horizons Nouveaux. Tous droits réservés.</p>
            <p className="mt-2">
              <span className="inline-flex space-x-4">
                <a href="#" className="hover:text-gray-700">
                  Conditions d'utilisation
                </a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-gray-700">
                  Politique de confidentialité
                </a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-gray-700">
                  Nous contacter
                </a>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
