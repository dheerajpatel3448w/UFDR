import React from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  UserGroupIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

function Ufdrchatbot() {
  const [query, setQuery] = useState("")
  const [rawResult, setRawResult] = useState(null)
  const [isRaw, setIsRaw] = useState(false)
  const [isRaw2, setIsRaw2] = useState(false)
  const [isRaw3, setIsRaw3] = useState(false)
  const [isRaw4, setIsRaw4] = useState(false)
  const [result, setResult] = useState(null)
  const [structure, setStructure] = useState(false)
  const [loading, setLoading] = useState(false)
  const data = useLocation()

  const getResult = async () => {
    if (!query.trim()) {
      alert("Please enter a query")
      return
    }
    
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ufdr/query`, {
        query,
        ufdrId: data?.state?.reportId
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      })
      
      if (response.data.success) {
        setRawResult(response.data.result)
        setIsRaw(true)
        setIsRaw2(true)
        setIsRaw3(true)
      }
    } catch (error) {
      console.error("Error fetching result:", error)
      alert("Error processing query")
    } finally {
      setLoading(false)
    }
  }

  const getResult2 = async () => {
    if (!query.trim()) {
      alert("Please enter a query")
      return
    }
    
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ufdr/query2`, {
        query,
        raw_result: rawResult
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      })
      
      if (response.data.success) {
        setResult(response.data.result.value)
        setStructure(true)
        setIsRaw2(true)
        setIsRaw3(true)
        setIsRaw4(false)
      }
    } catch (error) {
      console.error("Error fetching result:", error)
      alert("Error processing query")
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
    setQuery("")
    setRawResult(null)
    setResult(null)
    setIsRaw(false)
    setIsRaw2(false)
    setIsRaw3(false)
    setIsRaw4(false)
    setStructure(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <DocumentTextIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">UFDR AI Analyzer</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Advanced digital forensics analysis powered by AI. Extract insights from chat records, call logs, and contact information.
          </p>
        </div>

        {/* Main Query Section */}
        {!isRaw3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your forensic query... (e.g., 'Show all calls from last week')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && getResult()}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
                  />
                </div>
                <button
                  onClick={getResult}
                  disabled={loading}
                  className="px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  )}
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
              
              {/* Query Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  onClick={() => setQuery("Show all recent chat messages")}
                  className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    <span>Recent chats</span>
                  </div>
                </button>
                <button 
                  onClick={() => setQuery("Display call records from last month")}
                  className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <PhoneIcon className="h-4 w-4" />
                    <span>Call records</span>
                  </div>
                </button>
                <button 
                  onClick={() => setQuery("List all contacts with notes")}
                  className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>Contact list</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Question Prompt */}
        {isRaw2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-yellow-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Would you like to ask a follow-up question about these results?
              </h3>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => {
                    setIsRaw2(false)
                    setIsRaw4(true)
                    setIsRaw(false)
                    setStructure(false)
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Yes, Ask Follow-up
                </button>
                <button 
                  onClick={() => {
                    setIsRaw2(false)
                    setIsRaw3(false)
                    setIsRaw(false)
                    setStructure(false)
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  New Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Query Input */}
        {isRaw4 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-green-200">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ArrowPathIcon className="h-5 w-5 text-green-600" />
                Follow-up Analysis
              </h3>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Ask a follow-up question about the results..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && getResult2()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>
                <button
                  onClick={getResult2}
                  disabled={loading}
                  className="px-6 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : null}
                  {loading ? 'Processing...' : 'Analyze'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Raw Results Display */}
        {isRaw && rawResult && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                Raw Data Results
              </h2>
              <button
                onClick={resetChat}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="h-4 w-4" />
                New Analysis
              </button>
            </div>

            {/* Chat Records */}
            {rawResult.chat_records && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Chat Records</h3>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {rawResult.chat_records.length} records
                  </span>
                </div>
                <div className="grid gap-4">
                  {rawResult.chat_records.map((chat) => (
                    <div key={chat._id} className="bg-white rounded-xl shadow-md border border-blue-100 p-5 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">{chat.app_name}</h4>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {new Date(chat.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1"><strong>Message:</strong> {chat.message_content}</p>
                          <p className="text-gray-600"><strong>Type:</strong> {chat.message_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1"><strong>From:</strong> {chat.sender_number}</p>
                          <p className="text-gray-600"><strong>To:</strong> {chat.receiver_number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call Records */}
            {rawResult.call_records && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <PhoneIcon className="h-5 w-5 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Call Records</h3>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {rawResult.call_records.length} records
                  </span>
                </div>
                <div className="grid gap-4">
                  {rawResult.call_records.map((call) => (
                    <div key={call._id} className="bg-white rounded-xl shadow-md border border-green-100 p-5 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800 capitalize">{call.call_type} Call</h4>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {new Date(call.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600"><strong>Caller:</strong> {call.caller_number}</p>
                          <p className="text-gray-600"><strong>Receiver:</strong> {call.receiver_number}</p>
                        </div>
                        <div>
                          <p className="text-gray-600"><strong>Duration:</strong> {call.duration}s</p>
                          <p className="text-gray-600"><strong>Location:</strong> {call.metadata?.call_location || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600"><strong>Network:</strong> {call.metadata?.network_type || 'N/A'}</p>
                          <p className="text-gray-600"><strong>Quality:</strong> {call.metadata?.call_quality || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Records */}
            {rawResult.contact && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <UserGroupIcon className="h-5 w-5 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Contacts</h3>
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    {rawResult.contact.length} contacts
                  </span>
                </div>
                <div className="grid gap-4">
                  {rawResult.contact.map((contact) => (
                    <div key={contact._id} className="bg-white rounded-xl shadow-md border border-purple-100 p-5 hover:shadow-lg transition-shadow duration-200">
                      <h4 className="font-semibold text-gray-800 mb-3">{contact.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-2">
                            <strong>Phones:</strong> {Array.isArray(contact.phone_numbers) ? contact.phone_numbers.join(', ') : 'None'}
                          </p>
                          <p className="text-gray-600">
                            <strong>Emails:</strong> {Array.isArray(contact.email_addresses) ? contact.email_addresses.join(', ') : 'None'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">
                            <strong>Organization:</strong> {contact.metadata?.organization || 'N/A'}
                          </p>
                          <p className="text-gray-600">
                            <strong>Notes:</strong> {contact.metadata?.notes || 'None'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Structured Analysis Result */}
        {structure && result && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-2xl p-8 border border-blue-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                AI Analysis Report
              </h2>
              <button
                onClick={resetChat}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="h-4 w-4" />
                New Analysis
              </button>
            </div>

            {/* Executive Summary */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">Executive Summary</h3>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-gray-700 leading-relaxed">{result.EXECUTIVE_SUMMARY}</p>
              </div>
            </section>

            {/* Data Composition */}
            {result.DATA_COMPOSITION && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">Data Composition</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(result.DATA_COMPOSITION).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg p-4 text-center shadow-md">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{value}</div>
                      <div className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Findings */}
            {result.KEY_FINDINGS && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">Key Findings</h3>
                <div className="space-y-4">
                  {Object.entries(result.KEY_FINDINGS).map(([section, text]) => (
                    <div key={section} className="bg-white rounded-xl p-5 shadow-md">
                      <h4 className="font-semibold text-gray-800 mb-2 capitalize">{section.replace(/_/g, ' ')}</h4>
                      <p className="text-gray-700">{text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Evidence Categorization */}
            {result.EVIDENCE_CATEGORIZATION && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">Evidence Categorization</h3>
                <div className="grid gap-4">
                  {Object.entries(result.EVIDENCE_CATEGORIZATION).map(([category, items]) => (
                    <div key={category} className="bg-white rounded-xl p-5 shadow-md">
                      <h4 className="font-semibold text-gray-800 mb-3 capitalize">{category.replace(/_/g, ' ')}</h4>
                      {Array.isArray(items) ? (
                        <ul className="space-y-2">
                          {items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700">{items}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Timeline Analysis */}
            {result.TIMELINE_ANALYSIS && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">Timeline Analysis</h3>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  {Array.isArray(result.TIMELINE_ANALYSIS) ? (
                    <div className="space-y-3">
                      {result.TIMELINE_ANALYSIS.map((line, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                          <p className="text-gray-700">{line}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">{result.TIMELINE_ANALYSIS}</p>
                  )}
                </div>
              </section>
            )}

            {/* Investigative Recommendations */}
            {result.INVESTIGATIVE_RECOMMENDATIONS && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">Investigative Recommendations</h3>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  {Array.isArray(result.INVESTIGATIVE_RECOMMENDATIONS) ? (
                    <ul className="space-y-3">
                      {result.INVESTIGATIVE_RECOMMENDATIONS.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{result.INVESTIGATIVE_RECOMMENDATIONS}</p>
                  )}
                </div>
              </section>
            )}

            {/* Technical Details */}
            {result.TECHNICAL_DETAILS && (
              <section>
                <h3 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">Technical Details</h3>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="space-y-4">
                    {Object.entries(result.TECHNICAL_DETAILS).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-semibold text-gray-800 mb-2 capitalize">{key.replace(/_/g, ' ')}</h4>
                        {Array.isArray(value) ? (
                          <ul className="space-y-1">
                            {value.map((v, i) => (
                              <li key={i} className="text-gray-700">• {v}</li>
                            ))}
                          </ul>
                        ) : typeof value === "object" ? (
                          <ul className="space-y-1">
                            {Object.entries(value).map(([k, v]) => (
                              <li key={k} className="text-gray-700"><strong>{k}:</strong> {v}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-700">{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Ufdrchatbot