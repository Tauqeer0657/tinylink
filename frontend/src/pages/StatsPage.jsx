import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import { linkService, getBackendUrl } from '../services/api';
import { formatDate, copyToClipboard } from '../utils/helpers';

const StatsPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchStats = async () => {
      if (!code) return;

      try {
        setLoading(true);
        const data = await linkService.getLinkStats(code);
        setLink(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Link not found');
        } else {
          setError('Failed to load link statistics');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-red-800 mb-2">{error}</h2>
            <RouterLink
              to="/"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Dashboard
            </RouterLink>
          </div>
        </div>
      </div>
    );
  }

  const shortUrl = `${backendUrl}/${link.code}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Link Statistics</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Short Code
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-mono font-semibold text-blue-600">
                  {link.code}
                </code>
                <button
                  onClick={() => copyToClipboard(link.code)}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Short URL
              </label>
              <div className="flex items-center gap-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-blue-600 hover:underline break-all"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  📋 Copy
                </button>
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Target URL
              </label>
              <a
                href={link.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-blue-600 hover:underline break-all"
              >
                {link.targetUrl}
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Total Clicks</p>
                <p className="text-4xl font-bold text-blue-900">{link.clicks}</p>
              </div>

              <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <p className="text-sm text-green-600 font-medium mb-1">Created</p>
                <p className="text-sm font-semibold text-green-900">
                  {formatDate(link.createdAt)}
                </p>
              </div>

              <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <p className="text-sm text-purple-600 font-medium mb-1">Last Clicked</p>
                <p className="text-sm font-semibold text-purple-900">
                  {formatDate(link.lastClickedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatsPage;
