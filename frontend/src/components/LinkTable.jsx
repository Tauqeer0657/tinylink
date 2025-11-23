import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkService, getBackendUrl } from '../services/api';
import { truncateUrl, formatDate, copyToClipboard } from '../utils/helpers';

const LinkTable = ({ links, onLinkDeleted }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const backendUrl = getBackendUrl();

  // Filter links
  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = filteredLinks.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (code) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    setDeleting(code);
    try {
      await linkService.deleteLink(code);
      onLinkDeleted();
    } catch (error) {
      alert('Failed to delete link');
      console.error('Failed to delete link', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleCopyShortUrl = async (code) => {
    const shortUrl = `${backendUrl}/${code}`;
    await copyToClipboard(shortUrl);
  };

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No links yet</h3>
        <p className="text-gray-500">Create your first short link to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by code or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Show: <span className="font-semibold">All Columns</span>
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Product Summary</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Short Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Target URL</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Clicks</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Clicked Time</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedLinks.map((link) => (
              <tr key={link.code} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <code className="text-sm font-mono font-semibold text-blue-600">{link.code}</code>
                  <button
                    onClick={() => handleCopyShortUrl(link.code)}
                    className="ml-2 text-gray-400 hover:text-blue-600"
                    title="Copy short URL"
                  >
                    📋
                  </button>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  <a href={link.targetUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    {truncateUrl(link.targetUrl, 50)}
                  </a>
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {link.clicks}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(link.lastClickedAt)}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/code/${link.code}`)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Stats
                    </button>
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={deleting === link.code}
                      className="text-red-600 hover:text-red-900 text-sm font-medium disabled:text-gray-400"
                    >
                      {deleting === link.code ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
          <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredLinks.length)}</span> of{' '}
          <span className="font-semibold">{filteredLinks.length}</span> links
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg font-medium text-sm ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="ml-2 px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            {[...Array(totalPages)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredLinks.length === 0 && searchTerm && (
        <div className="p-12 text-center">
          <p className="text-gray-500">No links found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
};

export default LinkTable;
