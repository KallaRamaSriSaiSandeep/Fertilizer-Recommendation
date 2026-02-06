import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Thermometer, Droplets, Wind, Sprout, Mountain, Layers, Loader2, CheckCircle2, Leaf, TreeDeciduous } from 'lucide-react';

const ClayInput = ({ label, name, value, onChange, placeholder, icon: Icon, unit, onKeyDown, inputRef }) => (
    <div className="flex flex-col gap-2">
        <label className="text-white/80 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-green-300" />}
            {label}
        </label>
        <div className="relative">
            <input
                ref={inputRef}
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="bg-[#233528] w-full rounded-xl px-4 py-3 text-white font-bold outline-none shadow-[inset_4px_4px_8px_#1a281e,inset_-4px_-4px_8px_#2c4232] focus:shadow-[inset_6px_6px_12px_#152018,inset_-6px_-6px_12px_#314a38] transition-all placeholder-white/20"
            />
            {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">{unit}</span>}
        </div>
    </div>
);

const ClaySelect = ({ label, name, value, onChange, options, loading, onKeyDown, inputRef }) => (
    <div className="flex flex-col gap-2 h-full">
        <label className="text-[#2a4030] text-xs font-bold uppercase tracking-wider">{label}</label>
        <div className="relative h-full">
            <select
                ref={inputRef}
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                disabled={loading}
                className="w-full h-full bg-[#f0f4f8] rounded-2xl px-4 py-3 text-[#2a4030] font-bold outline-none shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ minHeight: '60px' }}
            >
                <option value="" disabled>{loading ? "Loading..." : "Select Option"}</option>
                {options.map(opt => <option key={opt} value={opt}>{loading ? opt : (name === 'soil_type' ? (soilEmojis[opt] || opt) : opt)}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#2a4030]/50">
                <Layers className="w-5 h-5" />
            </div>
        </div>
    </div>
);

const NPKCircularChart = ({ n, p, k }) => {
    // Normalize logic for visual representation (mock max 140 for visual balance)
    const maxVal = 140;
    const nP = Math.min((n / maxVal) * 100, 100) || 10;
    const pP = Math.min((p / maxVal) * 100, 100) || 10;
    const kP = Math.min((k / maxVal) * 100, 100) || 10;

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 rounded-full shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] flex items-center justify-center bg-[#f0f4f8]">
                <div className="absolute w-32 h-32 rounded-full shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-[#2a4030]">NPK</span>
                        <span className="text-[10px] uppercase font-bold text-[#2a4030]/60">Composition</span>
                    </div>
                </div>
                {/* Decorative rings simulating chart segments */}
                <svg className="absolute w-full h-full rotate-[-90deg]">
                    <circle cx="80" cy="80" r="35" stroke="#4ade80" strokeWidth="6" fill="transparent" strokeDasharray={`${nP} 220`} strokeLinecap="round" className="drop-shadow-sm opacity-80" />
                    <circle cx="80" cy="80" r="45" stroke="#60a5fa" strokeWidth="6" fill="transparent" strokeDasharray={`${pP} 280`} strokeLinecap="round" className="drop-shadow-sm opacity-80" />
                    <circle cx="80" cy="80" r="55" stroke="#f87171" strokeWidth="6" fill="transparent" strokeDasharray={`${kP} 340`} strokeLinecap="round" className="drop-shadow-sm opacity-80" />
                </svg>
            </div>
            {/* Legend Input Fields */}
            <div className="flex gap-2 mt-6 w-full px-2">
                <input type="number" placeholder="N" value={n} readOnly className="w-1/3 py-2 rounded-lg bg-green-100 text-green-800 text-center font-bold text-sm shadow-inner" />
                <input type="number" placeholder="P" value={p} readOnly className="w-1/3 py-2 rounded-lg bg-blue-100 text-blue-800 text-center font-bold text-sm shadow-inner" />
                <input type="number" placeholder="K" value={k} readOnly className="w-1/3 py-2 rounded-lg bg-red-100 text-red-800 text-center font-bold text-sm shadow-inner" />
            </div>
        </div>
    )
}

const GrassSVG = () => (

    <svg className="w-full h-24 absolute bottom-0 left-0 z-0 pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
        {/* Darker background grass - Silhouette */}
        <path className="fill-[#142918] animate-[sway_4s_ease-in-out_infinite_alternate]" d="M0,100 C20,50 40,80 60,100 Z" />
        <path className="fill-[#142918] animate-[sway_5s_ease-in-out_infinite_alternate-reverse]" d="M40,100 C60,40 80,90 100,100 Z" />
        <path className="fill-[#142918] animate-[sway_3s_ease-in-out_infinite_alternate]" d="M80,100 C110,30 140,80 160,100 Z" />
        <path className="fill-[#142918] animate-[sway_4.5s_ease-in-out_infinite_alternate-reverse]" d="M140,100 C170,40 200,90 220,100 Z" />
        <path className="fill-[#142918] animate-[sway_3.5s_ease-in-out_infinite_alternate]" d="M200,100 C230,50 260,80 280,100 Z" />
        <path className="fill-[#142918] animate-[sway_5.5s_ease-in-out_infinite_alternate-reverse]" d="M260,100 C290,30 320,90 340,100 Z" />
        <path className="fill-[#142918] animate-[sway_4s_ease-in-out_infinite_alternate]" d="M320,100 C350,40 380,80 400,100 Z" />

        {/* Lighter foreground grass - Tea Green (Pop) */}
        <path className="fill-[#C1E1C1] animate-[sway_3s_ease-in-out_infinite_alternate]" d="M10,100 C30,60 50,90 70,100 Z" />
        <path className="fill-[#C1E1C1] animate-[sway_4s_ease-in-out_infinite_alternate-reverse]" d="M50,100 C80,50 110,80 130,100 Z" />
        <path className="fill-[#C1E1C1] animate-[sway_3.5s_ease-in-out_infinite_alternate]" d="M110,100 C140,40 170,90 190,100 Z" />
        <path className="fill-[#C1E1C1] animate-[sway_5s_ease-in-out_infinite_alternate-reverse]" d="M170,100 C200,60 230,80 250,100 Z" />
        <path className="fill-[#C1E1C1] animate-[sway_4.5s_ease-in-out_infinite_alternate]" d="M230,100 C260,30 290,90 310,100 Z" />
        <path className="fill-[#C1E1C1] animate-[sway_3.5s_ease-in-out_infinite_alternate-reverse]" d="M290,100 C320,50 350,80 370,100 Z" />
        <path className="fill-[#C1E1C1] animate-[sway_4s_ease-in-out_infinite_alternate]" d="M350,100 C370,40 390,90 410,100 Z" />
    </svg>
);

// Emoji Mappings
const cropEmojis = {
    // Food Crops
    "Rice": "Rice 🍚", "Maize": "Maize 🌽", "Chickpea": "Chickpea 🥣", "Kidneybeans": "Kidneybeans 🫘",
    "Pigeonpeas": "Pigeonpeas 🥘", "Mothbeans": "Mothbeans 🍲", "Mungbean": "Mungbean 🥗", "Blackgram": "Blackgram ⚫",
    "Lentil": "Lentil 🍲", "Pomegranate": "Pomegranate 🍎", "Banana": "Banana 🍌", "Mango": "Mango 🥭",
    "Grapes": "Grapes 🍇", "Watermelon": "Watermelon 🍉", "Muskmelon": "Muskmelon 🍈", "Apple": "Apple 🍎",
    "Orange": "Orange 🍊", "Papaya": "Papaya 🥣", "Coconut": "Coconut 🥥", "Cotton": "Cotton ☁️",
    "Jute": "Jute 🧶", "Coffee": "Coffee ☕",

    // Specific casing from user screenshot/dataset
    "Barley": "Barley 🌾", "Ground Nuts": "Ground Nuts 🥜", "Millets": "Millets 🌾",
    "Oil seeds": "Oil seeds 🌻", "Paddy": "Paddy 🌾", "Pulses": "Pulses  दाल",
    "Sugarcane": "Sugarcane 🎋", "Tobacco": "Tobacco 🚬", "Wheat": "Wheat 🌾",
    "coffee": "Coffee ☕", "kidneybeans": "Kidneybeans 🫘", "orange": "Orange 🍊",
    "pomegranate": "Pomegranate 🍎", "rice": "Rice 🍚", "watermelon": "Watermelon 🍉"
};

const soilEmojis = {
    "Sandy": "Sandy 🏖️", "Loamy": "Loamy 🪴", "Black": "Black ⚫", "Red": "Red 🔴", "Clayey": "Clayey 🧱"
};

const fertilizerDescriptions = {
    "Urea": "High nitrogen content (46%) promotes rapid leafy growth and vivid green color. Ideal for early stages of crop growth.",
    "DAP": "Diammonium Phosphate provides established Nitrogen and high Phosphorus for strong root development and flowering.",
    "14-35-14": "A balanced complex fertilizer providing major nutrients with a boost in Phosphorus for energy transfer.",
    "28-28": "Equal high ratio of Nitrogen and Phosphorus, suitable for initial growth and root establishment.",
    "17-17-17": "A universal balanced complex fertilizer (N-P-K) suitable for all crops at any stage of growth.",
    "20-20": "Balanced Nitrogen and Phosphorus source, promoting both vegetative and root growth.",
    "10-26-26": "High in Phosphorus and Potassium, ideal for fruit setting, quality improvement, and disease resistance.",
    "TSP": "Triple Super Phosphate is a highly concentrated source of phosphorus (46%), essential for root growth and ripening.",
    "Superphosphate": "Single Super Phosphate (SSP) provides Phosphorus, Calcium, and Sulfur. Great for oilseeds and pulses.",
    "Potassium sulfate.": "Rich in Potassium and Sulfur, chloride-free. Improves quality, taste, and shelf-life of fruits and vegetables.",
    "Potassium chloride": "Muriate of Potash (MOP). The most common Potassium source, aiding in water regulation and enzyme activation.",
    "Magnesium Sulphate": "Epsom Salt. Corrects magnesium deficiency (yellowing leaves) and boosts chlorophyll production.",
    "Ferrous Sulphate": "Iron supplement. Corrects iron chlorosis (yellowing of younger leaves) and improves greenness.",
    "White Potash": "Sulphate of Potash (SOP). Premium Potassium source for high-value crops, low in salts."
};

const AnimatedLogo = () => {
    const text = "AgriPredict";
    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05, type: "spring", stiffness: 200 }
        })
    };

    return (
        <div className="flex items-center gap-4 relative z-10">
            {/* Animated Icon Container */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-16 h-16 bg-linear-to-br from-[#4d6b55] to-[#2a4030] rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_#bfbfbf,-6px_-6px_12px_#ffffff] relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Sprout className="w-8 h-8 text-white drop-shadow-md" />
            </motion.div>

            {/* Text & Tagline */}
            <div className="flex flex-col">
                <div className="flex overflow-hidden">
                    {text.split("").map((char, i) => (
                        <motion.span
                            key={i}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={letterVariants}
                            className="text-4xl font-black text-[#2a4030] tracking-tight relative"
                            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex items-center gap-2"
                >
                    <div className="h-[2px] w-8 bg-[#8fb395] rounded-full" />
                    <p className="text-sm font-bold text-[#4d6b55] tracking-widest uppercase">Precision AI Forecast</p>
                </motion.div>
            </div>
        </div>
    );
};

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        temperature: '', humidity: '', moisture: '',
        soil_type: '', crop_type: '',
        nitrogen: '', potassium: '', phosphorous: ''
    });
    const [metadata, setMetadata] = useState({ soil_types: [], crop_types: [] });
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [grown, setGrown] = useState(false);

    // Refs for navigation
    const tempRef = React.useRef(null);
    const humidRef = React.useRef(null);
    const moistRef = React.useRef(null);
    const nitroRef = React.useRef(null);
    const phosRef = React.useRef(null);
    const potasRef = React.useRef(null);
    const cropRef = React.useRef(null);
    const soilRef = React.useRef(null);
    const submitRef = React.useRef(null);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef?.current?.focus();
        }
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetch(`${API_URL}/metadata`).then(res => res.json()).then(setMetadata).catch(console.error);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        if (e) e.preventDefault(); // Handle if called from keydown or form submit

        // Basic Validation
        const requiredFields = ['temperature', 'humidity', 'moisture', 'soil_type', 'crop_type', 'nitrogen', 'potassium', 'phosphorous'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            alert(`Please fill in all fields: ${missingFields.join(', ')}`);
            return;
        }

        setLoading(true);
        setPrediction(null);
        await new Promise(r => setTimeout(r, 2000)); // Delay for effect

        try {
            const res = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    temperature: parseFloat(formData.temperature),
                    humidity: parseFloat(formData.humidity),
                    moisture: parseFloat(formData.moisture),
                    nitrogen: parseFloat(formData.nitrogen),
                    potassium: parseFloat(formData.potassium),
                    phosphorous: parseFloat(formData.phosphorous)
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Prediction failed");
            }

            const data = await res.json();
            setPrediction(data.predicted_fertilizer);
        } catch (e) {
            console.error(e);
            alert(`Error: ${e.message}`);
        }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
            {/* Background Grass */}
            <div className="absolute bottom-0 w-full h-32 z-0 pointer-events-none opacity-40">
                <GrassSVG />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="clay-card relative w-full max-w-5xl h-auto min-h-[800px] p-6 lg:p-8 flex flex-col gap-6 z-20"
            >
                {/* Header */}
                <div className="flex justify-between items-start relative z-10">
                    <AnimatedLogo />
                    <div
                        onClick={() => setGrown(!grown)}
                        className="w-12 h-12 rounded-full bg-[#f0f4f8] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {grown ? (
                                <motion.div
                                    key="tree"
                                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                >
                                    <TreeDeciduous className="w-7 h-7 text-green-600" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="sprout"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Sprout className="w-6 h-6 text-green-600" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">

                    {/* Top Left: Weather Stats (Dark Green Outset) */}
                    <div className="md:col-span-5 clay-panel-outset p-6 flex flex-col justify-center gap-5 relative overflow-hidden group clay-card-hover">
                        {/* Glassshine effect (Static) */}
                        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
                        {/* Hover Shine (Dynamic) */}
                        <div className="glossy-shine" />

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="p-2 bg-white/10 rounded-full shadow-inner"><Wind className="w-5 h-5" /></div>
                            <span className="font-bold opacity-90 tracking-wide">Environmental Data</span>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <ClayInput inputRef={tempRef} onKeyDown={(e) => handleKeyDown(e, humidRef)} label="Temperature" name="temperature" value={formData.temperature} onChange={handleChange} icon={Thermometer} unit="°C" placeholder="00" />
                            <ClayInput inputRef={humidRef} onKeyDown={(e) => handleKeyDown(e, moistRef)} label="Humidity" name="humidity" value={formData.humidity} onChange={handleChange} icon={Droplets} unit="%" placeholder="00" />
                            <ClayInput inputRef={moistRef} onKeyDown={(e) => handleKeyDown(e, nitroRef)} label="Moisture" name="moisture" value={formData.moisture} onChange={handleChange} icon={Wind} unit="%" placeholder="00" />
                        </div>
                    </div>

                    {/* Top Right: NPK Chart area (Light Outset) */}
                    <div className="md:col-span-7 bg-[#f0f4f8] rounded-[2rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] p-6 flex flex-row items-center gap-4 relative overflow-hidden text-[#2a4030] border border-white group clay-card-hover">
                        <div className="glossy-shine" />
                        <div className="w-1/2 flex flex-col justify-center gap-2 relative z-10">
                            <label className="text-[#2a4030] text-xs font-bold uppercase tracking-wider mb-2">Soil Composition</label>
                            <input ref={nitroRef} onKeyDown={(e) => handleKeyDown(e, phosRef)} type="number" name="nitrogen" placeholder="Nitrogen (N)" value={formData.nitrogen} onChange={handleChange} className="clay-input mb-3" />
                            <input ref={phosRef} onKeyDown={(e) => handleKeyDown(e, potasRef)} type="number" name="phosphorous" placeholder="Phosphorous (P)" value={formData.phosphorous} onChange={handleChange} className="clay-input mb-3" />
                            <input ref={potasRef} onKeyDown={(e) => handleKeyDown(e, cropRef)} type="number" name="potassium" placeholder="Potassium (K)" value={formData.potassium} onChange={handleChange} className="clay-input" />
                        </div>
                        <div className="w-1/2 h-full">
                            <NPKCircularChart n={formData.nitrogen} p={formData.phosphorous} k={formData.potassium} />
                        </div>
                    </div>

                    {/* Bottom Left: Trees & Crop Type */}
                    <div className="md:col-span-4 bg-[#8fb395] rounded-[2rem] relative overflow-hidden shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] p-6 flex flex-col justify-between group clay-card-hover">
                        <div className="glossy-shine" />
                        {/* Decorative Trees */}
                        <div className="absolute bottom-0 text-[#2a4030]/20 w-full flex justify-center gap-2">
                            <TreeDeciduousIcon className="w-20 h-20 -mb-4" />
                            <TreeDeciduousIcon className="w-16 h-16 -mb-2 scale-x-[-1]" />
                        </div>

                        <h3 className="text-[#2a4030] bg-white/30 backdrop-blur-md px-3 py-1 rounded-lg w-fit text-sm font-bold relative z-10 shadow-sm">Crop Selection</h3>

                        <div className="mt-auto relative z-10 pt-10">
                            <select ref={cropRef} onKeyDown={(e) => handleKeyDown(e, soilRef)} name="crop_type" value={formData.crop_type} onChange={handleChange} className="w-full bg-[#f0f4f8] shadow-lg rounded-xl px-4 py-3 font-bold text-[#2a4030] outline-none">
                                <option value="" disabled>Select Crop</option>
                                {metadata.crop_types.map(c => <option key={c} value={c}>{cropEmojis[c] || c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Bottom Center: Soil Type */}
                    <div className="md:col-span-4 bg-[#f0f4f8] rounded-[2rem] p-6 flex flex-col shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] group clay-card-hover relative overflow-hidden">
                        <div className="glossy-shine" />
                        <ClaySelect inputRef={soilRef} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                submitRef?.current?.focus();
                                // Optional: You could trigger submit here if focusing button isn't enough
                                // handleSubmit(e); 
                            }
                        }} label="Soil Category" name="soil_type" value={formData.soil_type} onChange={handleChange} options={metadata.soil_types} loading={loading} />
                    </div>

                    {/* Bottom Right: Analyze Button */}
                    <div className="md:col-span-4 flex items-end">
                        <button ref={submitRef} type="submit" className="w-full h-full min-h-[140px] clay-btn flex flex-col items-center justify-center gap-3 group">
                            {loading ? <Loader2 className="animate-spin w-8 h-8" /> : <Leaf className="w-8 h-8 group-hover:scale-110 transition-transform" />}
                            <span className="text-lg tracking-wide uppercase">{loading ? "Analyzing..." : "Analyze"}</span>
                        </button>
                    </div>
                </form>

                {/* Prediction Modal / Overlay */}
                <AnimatePresence>
                    {prediction && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 bg-[#3e5c45]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white"
                        >
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
                                <CheckCircle2 className="w-12 h-12 text-[#3e5c45]" />
                            </div>
                            <p className="text-green-200 font-bold uppercase tracking-widest text-sm mb-2">Recommended Fertilizer</p>
                            <h2 className="text-5xl font-black mb-4 text-center">{prediction}</h2>
                            {fertilizerDescriptions[prediction] && (
                                <p className="text-green-100 text-center max-w-md text-lg leading-relaxed mb-6 px-4">
                                    {fertilizerDescriptions[prediction]}
                                </p>
                            )}
                            <button onClick={() => setPrediction(null)} className="mt-4 px-8 py-3 bg-white text-[#3e5c45] font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                                Analyze Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
};

// Helper for decorative tree
const TreeDeciduousIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M8 19h8a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V9a7 7 0 1 0-10 0v4H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z" />
        <path d="M12 22v-3" />
    </svg>
)

export default PredictionForm;
