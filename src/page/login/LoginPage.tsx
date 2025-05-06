// Correct import path
import loginIllustration from '../../assets/login.png';

function LoginPage() {
  // Use the imported image variable
  const imageUrl = loginIllustration;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md">
          {/* --- Form code remains unchanged here --- */}
          <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center sm:text-left">
            BIENVENUE
          </h1>
          <p className="text-gray-600 mb-8 text-center sm:text-left">
            Entrez votre email et votre mot de passe pour vous connecter.
          </p>

          <form>
            {/* Email Input */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150 ease-in-out"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="**********"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150 ease-in-out"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-y-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Rappeler moi
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Connexion
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration as Background */}
      <div

        className="hidden lg:block w-1/2 bg-cover bg-center bg-no-repeat"
        // Apply the background image using inline style with the imported variable
        style={{ backgroundImage: `url(${imageUrl})` }}
        role="img"
        aria-label="Personne faisant le plein d'une voiture"
      >
        {/* This div is now effectively empty content-wise, the image is its background */}
      </div>
    </div>
  );
}

export default LoginPage;