// /pages/vo2max-suite.tsx
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Icon } from "@iconify/react";
import { testDefinitions, getRating, InputValues, CommonFields, Category } from "@/core/vo2maxLogic";

// This is the main page that imports only the core logic.
const VO2maxSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>("field");
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [inputs, setInputs] = useState<InputValues>({
    age: "",
    weight: "",
    gender: "male",
    height: "",
    paRating: "",
    runTime: "",
    walkTime: "",
    endingHR: "",
    recoveryHR: "",
    distance: "",
    shuttleSpeed: "",
    speed: "",
    HR: "",
    DW: "",
    yoYoMileage: "",
    hoffMileage: "",
    footeScore: "",
    watts: "",
    W_peak: "",
    grade: ""
  });
  const [result, setResult] = useState<string | null>(null);
  const [rating, setRating] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // When activeTab changes, automatically select the first test in that category.
  useEffect(() => {
    const testsForTab = testDefinitions.filter(t => t.category === activeTab);
    if (testsForTab.length > 0) {
      setSelectedTestId(testsForTab[0].id);
    }
  }, [activeTab]);

  const selectedTest = testDefinitions.find(t => t.id === selectedTestId) || null;

  const commonFieldLabels: { [key in keyof CommonFields]: string } = {
    age: "Age (years)",
    weight: "Weight (kg)",
    gender: "Gender",
    height: "Height (m)",
    paRating: "Physical Activity Rating (0-7)"
  };

  // Combine common fields (if required) with test‑specific additional fields.
  const fieldsToRender: { key: string; label: string; type: "number" | "select" }[] = [];
  if (selectedTest) {
    selectedTest.requiredCommon.forEach((key) => {
      fieldsToRender.push({
        key,
        label: commonFieldLabels[key],
        type: key === "gender" ? "select" : "number"
      });
    });
    selectedTest.additionalFields.forEach((field) => {
      fieldsToRender.push({ key: field.key, label: field.label, type: "number" });
    });
  }

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedTest) return;
    const computed = selectedTest.compute(inputs);
    if (computed === null) {
      setError("One or more inputs are missing or invalid.");
      setResult(null);
      setRating("");
    } else {
      setResult(computed.toFixed(2));
      const ageNum = parseFloat(inputs.age);
      if (!isNaN(ageNum)) {
        setRating(getRating(inputs.gender, ageNum, computed));
      }
    }
  };

  const testsForTab = testDefinitions.filter(t => t.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          VO₂max Calculator Suite
        </h1>
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 space-x-4">
          {(["field", "cycle", "treadmill", "nonexercise"] as Category[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {tab === "field"
                ? "Field Tests"
                : tab === "cycle"
                ? "Cycle Tests"
                : tab === "treadmill"
                ? "Treadmill Tests"
                : "Non-Exercise Tests"}
            </button>
          ))}
        </div>
        {/* Test Selection */}
        <div className="flex items-center space-x-2 mb-4">
          <label className="text-gray-700 dark:text-gray-300">Select Test:</label>
          <select
            value={selectedTestId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedTestId(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm"
          >
            {testsForTab.map(test => (
              <option key={test.id} value={test.id}>
                {test.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Test Information"
          >
            <Icon icon="mdi:information-outline" width="24" height="24" />
          </button>
        </div>
        {/* Input Form */}
        <form onSubmit={handleCalculate} className="space-y-4">
          {fieldsToRender.map(field => (
            <div key={field.key}>
              <label className="block text-gray-700 dark:text-gray-300">{field.label}</label>
              {field.type === "select" && field.key === "gender" ? (
                <select
                  value={inputs.gender}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange("gender", e.target.value)
                  }
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <input
                  type="number"
                  value={inputs[field.key]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(field.key, e.target.value)
                  }
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                  step="any"
                />
              )}
            </div>
          ))}
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-4">
            Calculate VO₂max
          </button>
        </form>
        {result && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md text-center">
            <h2 className="text-xl font-semibold">Estimated VO₂max:</h2>
            <p className="text-2xl">
              {result} ml/kg/min
            </p>
            {rating && (
              <p className="mt-2 text-lg">
                Performance Rating: <span className="font-bold">{rating}</span>
              </p>
            )}
          </div>
        )}
      </div>
      {/* Info Modal */}
      {showInfoModal && selectedTest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowInfoModal(false)}
              aria-label="Close"
            >
              <Icon icon="mdi:close" width="24" height="24" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {selectedTest.label}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {selectedTest.description}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Formula:</strong> {selectedTest.formulaText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VO2maxSuite;
