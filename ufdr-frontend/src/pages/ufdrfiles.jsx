import React, {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  PencilIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { UserContext } from '../context/user.context';

const UFDRReportsPage = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const [reports, setReports] = useState([
    {
      _id: "68dbda511dcebd36deb65082",
      case_number: "xdwedwe-2233",
      user: "68dbcc3a7a5e9e7ad9485a20",
      title: "dneiwnfierfnoewir",
      description: "cwcweiocweiocn",
      status: "active",
      filename: "C:\\Users\\patel\\AppData\\Local\\Temp\\file-1759238737946-516325714.json",
      device_info: {
        device_name: "Samsung Galaxy S21",
        device_model: "SM-G991B",
        os_name: "Android",
        os_version: "12",
        serial_number: "R58N123ABC",
        storage_capacity_gb: 128,
        available_storage_gb: 45,
        network_carrier: "Jio"
      },
      extraction_date: null,
      processed: true,
      createdAt: "2025-09-30T13:25:37.980+00:00",
      updatedAt: "2025-09-30T13:25:37.980+00:00",
      __v: 0
    }
    // Add more sample reports as needed
  ]);
  

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processedFilter, setProcessedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
useEffect(()=>{
      axios.get(`${import.meta.env.VITE_API_URL}/ufdr/getreports`,{
        withCredentials:true,
        headers:{
            Authorization:`Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      }).then((response)=>{
        console.log(response)
        setReports(response.data.report);
      }).catch((error)=>{
        console.log(error);

      })
},[]);
  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = 
        report.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.device_info.device_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesProcessed = processedFilter === 'all' || 
        (processedFilter === 'processed' && report.processed) ||
        (processedFilter === 'pending' && !report.processed);
      
      return matchesSearch && matchesStatus && matchesProcessed;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'case_number':
          return a.case_number.localeCompare(b.case_number);
        default:
          return 0;
      }
    });
    const handleclick = async(reportId) => {
    console.log('Clicked report:', reportId)
    navigate(`/analysis2`,{
        state: { reportId }
    });
    
}

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const IconComponent = config.icon;



    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleExport = (reportId) => {
    console.log('Exporting report:', reportId);
    // Implement export functionality
  };

  const handleUpdate = (reportId) => {
    console.log('Updating report:', reportId);
    // Implement update functionality
  };

  const handleDelete = (reportId) => {
    console.log('Deleting report:', reportId);
    // Implement delete functionality
  };

  const handleView = (reportId) => {
    console.log('Viewing report:', reportId);
    // Implement view functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">UFDR Reports</h1>
          <p className="text-gray-600 mt-2">Manage and review all uploaded forensic reports</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by case number, title, or device..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={processedFilter}
                onChange={(e) => setProcessedFilter(e.target.value)}
              >
                <option value="all">All Processing</option>
                <option value="processed">Processed</option>
                <option value="pending">Pending</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="case_number">Case Number</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
              onClick={()=>handleclick(report._id)}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{report.case_number}</p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {report.description}
                </p>
              </div>

              {/* Device Information */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Device</span>
                  <span className="text-sm text-gray-900">{report.device_info.device_name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Model</span>
                  <span className="text-sm text-gray-900">{report.device_info.device_model}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">OS</span>
                  <span className="text-sm text-gray-900">
                    {report.device_info.os_name} {report.device_info.os_version}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Storage</span>
                  <span className="text-sm text-gray-900">
                    {report.device_info.available_storage_gb}GB / {report.device_info.storage_capacity_gb}GB
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Processed</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.processed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.processed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(report._id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="View Report"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleExport(report._id)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Export Report"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleUpdate(report._id)}
                      className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                      title="Update Report"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete Report"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <DocumentArrowDownIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || processedFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No UFDR reports have been uploaded yet'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UFDRReportsPage;