import React, { useState } from 'react';
import { Search, AlertCircle, Plus, X } from 'lucide-react';
import axios from 'axios';

interface Symptom {
  id: string;
  name: string;
}

interface Diagnosis {
  condition: string;
  probability: string;
  description: string;
  recommendation: string;
}

const commonSymptoms: Symptom[] = [
  { id: '1', name: 'Headache' },
  { id: '2', name: 'Fever' },
  { id: '3', name: 'Cough' },
  { id: '4', name: 'Fatigue' },
  { id: '5', name: 'Nausea' },
];

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [otherSymptom, setOtherSymptom] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addSymptom = (symptom: Symptom) => {
    if (!selectedSymptoms.find(s => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
  };

  const addOtherSymptom = () => {
    if (otherSymptom.trim() && !selectedSymptoms.find(s => s.name === otherSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, { id: `other-${otherSymptom}`, name: otherSymptom }]);
      setOtherSymptom('');
    }
  };

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      setErrorMessage('Please select at least one symptom.');
      setDiagnosis(null);
      return;
    }

    const symptomList = selectedSymptoms.map(s => s.name).join(', ');
    
    // Improved prompt structure for better AI responses
    const userMessage = `As a medical AI assistant, analyze these symptoms: ${symptomList}

Please provide a structured medical assessment in the following format:
CONDITION: [Name of the most likely condition]
PROBABILITY: [High/Moderate/Low]
DESCRIPTION: [2-3 sentences explaining the condition and why it matches the symptoms]
RECOMMENDATION: [Specific treatment steps and when to seek medical attention]

Important considerations:
- Base probability on symptom pattern matching
- Focus on common conditions that match the symptom cluster
- Provide actionable recommendations
- Consider symptom severity and duration`;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: userMessage,
            },
          ],
          temperature: 0.5, // Reduced for more consistent responses
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.choices?.[0]?.message?.content) {
        const result = response.data.choices[0].message.content;
        
        // Parse the structured response
        const conditionMatch = result.match(/CONDITION:\s*(.*?)(?=\n|PROBABILITY)/i);
        const probabilityMatch = result.match(/PROBABILITY:\s*(.*?)(?=\n|DESCRIPTION)/i);
        const descriptionMatch = result.match(/DESCRIPTION:\s*(.*?)(?=\n|RECOMMENDATION)/i);
        const recommendationMatch = result.match(/RECOMMENDATION:\s*(.*?)(?=\n|$)/i);

        setDiagnosis({
          condition: conditionMatch?.[1]?.trim() || 'Unable to determine condition',
          probability: probabilityMatch?.[1]?.trim() || 'Unknown',
          description: descriptionMatch?.[1]?.trim() || 'No detailed description available',
          recommendation: recommendationMatch?.[1]?.trim() || 'Please consult a healthcare professional',
        });
        setErrorMessage(null);
      }
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
      setErrorMessage('There was an error processing your symptoms. Please try again later.');
      setDiagnosis(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">AI Symptom Checker</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Common Symptoms</h3>
            <div className="space-y-4">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => addSymptom(symptom)}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 flex items-center justify-between"
                >
                  {symptom.name}
                  <Plus className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Other Symptoms</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={otherSymptom}
                onChange={(e) => setOtherSymptom(e.target.value)}
                placeholder="Enter other symptoms"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addOtherSymptom}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Selected Symptoms</h3>
            {selectedSymptoms.length === 0 ? (
              <p className="text-gray-500">No symptoms selected</p>
            ) : (
              <div className="space-y-2">
                {selectedSymptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md"
                  >
                    {symptom.name}
                    <button
                      onClick={() => removeSymptom(symptom.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={checkSymptoms}
                  className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Check Symptoms
                </button>
              </div>
            )}
            {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Preliminary Assessment</h3>
          {diagnosis ? (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="font-medium text-gray-600">Possible Condition</p>
                <p className="text-lg text-gray-900">{diagnosis.condition}</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-medium text-gray-600">Match Probability</p>
                <p className="text-lg text-gray-900">{diagnosis.probability}</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-medium text-gray-600">Description</p>
                <p className="text-gray-900">{diagnosis.description}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Recommended Steps</p>
                <p className="text-gray-900">{diagnosis.recommendation}</p>
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <p className="ml-3 text-sm text-yellow-700">
                    This is an AI-powered preliminary assessment. Always consult with a healthcare professional for accurate diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Select your symptoms and click "Check Symptoms" to receive a preliminary assessment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}