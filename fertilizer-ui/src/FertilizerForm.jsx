import React, { useState } from 'react';

const FertilizerForm = () => {
  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState({
    crop_label: 'Ampalaya',
    n_status: 'Low',
    p_status: 'Low',
    k_status: 'Low',
    soil_ph: 6.5,
    raw_area: 1000,
    area_unit: 'Square Meters (sqm)',
    selected_inventory_names: []
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // 2. CONSTANTS (Data for Dropdowns and Checkboxes)
  const crops = ["Ampalaya", "Batao", "String Beans", "Cabbage", "Carrot", "Tomato", "Potato", "Lettuce"];
  const nutrientLevels = ["Low", "Medium", "High"];
  const availableFertilizers = [
    "Urea", "Complete (14-14-14)", "Muriate of Potash", "Ammophos",
    "Calcium Nitrate", "15-9-20 Compound", "13-33-21 Compound",
    "Complete (16-16-16)", "13-31-21 Compound", "19-4-19 Compound",
    "Single Superphosphate (18)", "Single Superphosphate (20)",
    "Single Superphosphate (22)", "Ammonium Sulfate"
  ];

  // 3. EVENT HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInventoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      selected_inventory_names: checked 
        ? [...prev.selected_inventory_names, value]
        : prev.selected_inventory_names.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(null); 
    setResult(null); 
    setActiveTab(0);

    const payload = {
      ...formData,
      soil_ph: parseFloat(formData.soil_ph),
      raw_area: parseFloat(formData.raw_area)
    };

    // 👇 REPLACE THIS WITH YOUR ACTUAL RAILWAY URL
    const RAILWAY_URL = 'https://soilscanrulebased-production.up.railway.app/recommendation'; 

    try {
      const response = await fetch(RAILWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function: Cleans up "8.7 kg/1000.0 sqm of Urea" to just "8.7 kg of Urea"
  const formatPrescriptionText = (text) => {
    return text.replace(/\/[\d.]+\s*(sqm|ha)\s*/i, ' ');
  };

  // 4. UI RENDERING
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg mt-10 mb-20">
      
      {/* HEADER */}
      <h2 className="text-3xl font-extrabold mb-2 text-gray-800">Farm Plan Generator</h2>
      <p className="text-gray-500 mb-8">Enter your soil details to get a step-by-step fertilizer recipe.</p>
      
      {/* INPUT FORM */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
        
        {/* Row 1: Crop & Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">🌱 What are you planting?</label>
            <select name="crop_label" value={formData.crop_label} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500">
              {crops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">📏 How big is the farm?</label>
            <div className="flex shadow-sm rounded-lg">
              <input type="number" name="raw_area" value={formData.raw_area} onChange={handleChange} className="w-2/3 p-3 border border-gray-300 rounded-l-lg focus:ring-green-500 outline-none" required />
              <select name="area_unit" value={formData.area_unit} onChange={handleChange} className="w-1/3 p-3 border-y border-r border-gray-300 rounded-r-lg bg-gray-100 outline-none">
                <option value="Square Meters (sqm)">sqm</option>
                <option value="Hectares (ha)">ha</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: NPK Levels */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">🧪 Soil Health (from test results)</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-gray-500">Nitrogen (N)</span>
              <select name="n_status" value={formData.n_status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg outline-none">
                {nutrientLevels.map(lvl => <option key={`n-${lvl}`} value={lvl}>{lvl}</option>)}
              </select>
            </div>
            <div>
              <span className="text-xs text-gray-500">Phosphorus (P)</span>
              <select name="p_status" value={formData.p_status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg outline-none">
                {nutrientLevels.map(lvl => <option key={`p-${lvl}`} value={lvl}>{lvl}</option>)}
              </select>
            </div>
            <div>
              <span className="text-xs text-gray-500">Potassium (K)</span>
              <select name="k_status" value={formData.k_status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg outline-none">
                {nutrientLevels.map(lvl => <option key={`k-${lvl}`} value={lvl}>{lvl}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Soil pH */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">💧 Soil pH Level</label>
          <input type="number" step="0.1" name="soil_ph" value={formData.soil_ph} onChange={handleChange} className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-green-500" required />
        </div>

        {/* Row 4: Inventory Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            🎒 What fertilizers do you already have? (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-3">Select what you have, and we'll try to use them in your recipe.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-h-60 overflow-y-auto">
            {availableFertilizers.map(fert => (
              <label key={fert} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-green-50 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  value={fert} 
                  onChange={handleInventoryChange} 
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 shadow-sm cursor-pointer" 
                />
                <span className="text-sm font-medium text-gray-700">{fert}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-extrabold text-lg py-4 px-4 rounded-xl hover:bg-green-700 transition duration-200 disabled:bg-green-300 shadow-md">
          {loading ? 'Analyzing Soil...' : 'Generate My Recipe'}
        </button>
      </form>

      {/* ERROR MESSAGE */}
      {error && <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200 shadow-sm"><strong>Error:</strong> {error}</div>}

      {/* RESULTS DASHBOARD */}
      {result && (
        <div className="mt-12 animate-fade-in">
          
          {/* Quick Soil Status Bar */}
          <div className={`mb-8 p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${result.ph_result.ph_status === 'acceptable' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-yellow-50 border-yellow-200 text-yellow-900'}`}>
            <div>
              <h4 className="font-bold text-lg">Soil pH: {result.ph_result.soil_ph} ({result.ph_result.ph_status})</h4>
              <p className="text-sm opacity-90 mt-1">{result.ph_result.recommendation_message}</p>
            </div>
            <div className="text-4xl">{result.ph_result.ph_status === 'acceptable' ? '✅' : '⚠️'}</div>
          </div>

          {/* Inventory Warning Banner */}
          {!result.inventory_check.valid && result.user_inventory.length > 0 && (
            <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl shadow-sm">
              <h4 className="text-orange-800 font-bold flex items-center">
                <span className="mr-2">⚠️</span> Inventory Alert
              </h4>
              <p className="text-orange-700 text-sm mt-1">{result.inventory_check.reason}</p>
              <p className="text-orange-700 text-sm mt-1 font-medium">We have generated standard recipes for you below instead.</p>
            </div>
          )}

          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Fertilizer Options</h3>
          <p className="text-gray-600 mb-6">Choose the option that uses fertilizers you can easily buy at your local store.</p>

          {/* Option Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
            {result.standard_mix.map((mix, index) => (
              <button 
                key={index}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === index ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
              >
                Option {index + 1}: Using {mix.Source}
              </button>
            ))}
          </div>

          {/* The Recipe Card (Only shows the active tab) */}
          {result.standard_mix[activeTab] && (
            <div className="bg-white border-2 border-green-500 rounded-2xl overflow-hidden shadow-xl transition-all">
              <div className="bg-green-500 text-white p-6 flex justify-between items-center">
                <div>
                  <h4 className="text-2xl font-black">Option {activeTab + 1} Recipe</h4>
                  <p className="opacity-90 text-sm mt-1">Main Source: {result.standard_mix[activeTab].Source}</p>
                </div>
                <div className="text-right bg-green-600 p-3 rounded-lg border border-green-400">
                  <p className="text-xs uppercase font-bold tracking-wider opacity-80">Total Weight</p>
                  <p className="text-xl font-bold">{result.standard_mix[activeTab]['Total Weight'].toFixed(1)} kg</p>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h5 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                  <span className="text-2xl mr-2">🛒</span> Step 1: Your Shopping List
                </h5>
                <ul className="space-y-3 mb-8">
                  {result.standard_mix[activeTab].Prescription.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-center text-lg text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                      <span className="w-5 h-5 bg-green-500 rounded-full inline-block mr-4 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">✔</span>
                      Buy <strong>&nbsp;{formatPrescriptionText(step)}</strong>
                    </li>
                  ))}
                </ul>

                <h5 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                  <span className="text-2xl mr-2">🚜</span> Step 2: Application
                </h5>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-blue-900 shadow-sm">
                  <p className="text-lg">Mix the items from your shopping list together.</p>
                  <p className="font-bold text-lg mt-3">Apply this entire mixture evenly across your {result.raw_area} {result.unit_label} of land.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default FertilizerForm;