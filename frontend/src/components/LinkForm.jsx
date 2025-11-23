import { useState } from 'react';
import { linkService } from '../services/api';
import { copyToClipboard } from '../utils/helpers';

const LinkForm = ({ onLinkCreated }) => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      const data = await linkService.createLink({
        url,
        code: customCode || undefined,
      });

      setSuccess(data);
      setUrl('');
      setCustomCode('');
      onLinkCreated();

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create short link';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Code <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="mycode123"
              pattern="[A-Za-z0-9]{6,8}"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading || !url}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold mb-2 text-sm">✅ Link created successfully!</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={success.shortUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(success.shortUrl)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default LinkForm;