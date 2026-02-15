import { supabase } from '../lib/supabase'

export default async function SupabaseTest() {
  // Test the connection
  try {
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1)

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Supabase Connection Test</h1>

          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-bold">Error</p>
              <p className="text-sm">{error.message}</p>
              <p className="text-sm mt-2 text-gray-600">
                This is expected if you haven't created any tables yet.
              </p>
            </div>
          ) : (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p className="font-bold">✅ Connected Successfully!</p>
              <p className="text-sm">Your Supabase project is ready to use.</p>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
            <p><strong>Project URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  } catch (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-600">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Connection Error</h1>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p className="font-bold">Failed to connect to Supabase</p>
            <p className="text-sm">Please check your environment variables.</p>
          </div>
        </div>
      </div>
    )
  }
}
