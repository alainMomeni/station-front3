import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import DashboardLayout from '../layouts/DashboardLayout';
import { FiSave } from 'react-icons/fi'; // Using save icon for register

interface FormData {
  matricule: string;
  produit: string;
  categorie: string;
  quantite: string;
}

const VentesFormPage: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState<FormData>({
    matricule: '',
    produit: '',
    categorie: '',
    quantite: ''
  });
   const [isSubmitting, setIsSubmitting] = useState(false); // To disable button on submit

   // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

   // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form Data Submitted:', formData);
    // Simulate API call
    setTimeout(() => {
      alert('Vente enregistrée avec succès !'); // Replace with actual success handling
      setIsSubmitting(false);
       navigate('/ventes'); // Navigate back to the list page after success
    }, 1000);
    // In a real app:
    // try {
    //   await api.post('/ventes', formData);
    //   // show success message/toast
    //   navigate('/ventes');
    // } catch (error) {
    //   // show error message/toast
    //   setIsSubmitting(false);
    // }
  };


  return (
    <DashboardLayout>
       {/* Header section */}
      <div className="flex justify-between items-center mb-6">
         {/* Title depends on if it's create or edit mode */}
         <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
              Nouvelle vente
              {/* Example for Edit mode: */}
              {/* {isEditMode ? `Modifier Vente ${initialData?.id}` : 'Nouvelle vente'} */}
          </h1>
           {/* Action Buttons */}
           <div className="flex items-center space-x-3">
               <button
                   type="submit" // Link to the form id below
                   form="vente-form" // Associate button with the form
                   disabled={isSubmitting}
                   className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm disabled:opacity-50"
               >
                  <FiSave className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
               </button>
                <Link
                    to="/ventes" // Link back to the sales list
                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
               >
                   Annuler
               </Link>
           </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form id="vente-form" onSubmit={handleSubmit}>
           {/* Grid layout for form fields */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Matricule Field */}
             <div>
                <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-1">
                    Matricule
                </label>
                <input
                   type="text"
                   name="matricule"
                   id="matricule"
                   value={formData.matricule}
                   onChange={handleChange}
                   placeholder="Entrez l'id"
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                   required
               />
             </div>

              {/* Produit Field */}
              <div>
                <label htmlFor="produit" className="block text-sm font-medium text-gray-700 mb-1">
                   Produit
                </label>
                <select
                   id="produit"
                   name="produit"
                   value={formData.produit}
                   onChange={handleChange}
                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md cursor-pointer"
                   required
               >
                   <option value="" disabled>Selectionner un produit</option>
                   <option value="Super">Super</option>
                   <option value="Gazoil">Gazoil</option>
                   <option value="Deo Max 15L">Deo Max 15L</option>
                   {/* Add more product options */}
               </select>
             </div>


              {/* Catégorie Field */}
             <div>
                <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                </label>
                <select
                   id="categorie"
                   name="categorie"
                   value={formData.categorie}
                   onChange={handleChange}
                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md cursor-pointer"
                   required
               >
                   <option value="" disabled>Selectionner une catégorie</option>
                   <option value="Carburant">Carburant</option>
                   <option value="Lubrifiant">Lubrifiant</option>
                   <option value="Accessoire">Accessoire</option>
                   {/* Add more category options */}
               </select>
             </div>

              {/* Quantitée Field */}
             <div>
                <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantitée
                </label>
                <input
                   type="number" // Use number for quantity potentially
                   name="quantite"
                   id="quantite"
                   value={formData.quantite}
                   onChange={handleChange}
                   placeholder="Entrez la quantité"
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                   required
                   min="0" // Example validation
               />
             </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default VentesFormPage;