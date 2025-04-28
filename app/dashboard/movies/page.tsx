// app/movies/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Actor {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: string;
  release_year: number;
  trailer_url: string;
  poster_url: string;
  actors: Actor[];
  genres: Genre[];
}

interface MoviesResponse {
  data: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MoviesPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, limit]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://10.10.10.134/movies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await res.json(); // Ambil data dari response fetch
      
      // Pastikan response memiliki properti yang diharapkan
      if (data && data.data) {
        setMovies(data.data); 
        setTotalPages(data.totalPages);
      } else {
        console.error('Data tidak valid');
      }
  
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus film ini?')) {
      try {
        // Simulasi API call untuk menghapus
        // await fetch(`/api/movies/${id}`, { method: 'DELETE' });
        
        // Refresh data setelah menghapus
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Film</h1>
        <Link 
          href="/dashboard/movies/create" 
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="mr-2" size={18} />
          Tambah Film
        </Link>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Cari film..."
              className="w-full p-2 border rounded pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button 
            type="submit" 
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cari
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="text-center py-10">Tidak ada film yang ditemukan</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Poster</th>
                <th className="py-2 px-4 border-b text-left">Judul</th>
                <th className="py-2 px-4 border-b text-left">Tahun</th>
                <th className="py-2 px-4 border-b text-left">Durasi</th>
                <th className="py-2 px-4 border-b text-left">Genre</th>
                <th className="py-2 px-4 border-b text-left">Aktor</th>
                <th className="py-2 px-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <div className="w-16 h-24 bg-gray-200 relative">
                      <img 
                        src={`http://10.10.10.134${movie.poster_url}`} 
                        alt={movie.title}
                        className="absolute w-full h-full object-cover"
                        // onError={(e) => {
                        //   const target = e.target as HTMLImageElement;
                        //   target.src = '/placeholder-poster.jpg';
                        // }}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b font-medium">
                    <Link href={`/dashboard/movies/${movie.id}`} className="text-blue-600 hover:underline">
                      {movie.title}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">{movie.release_year}</td>
                  <td className="py-2 px-4 border-b">{movie.duration} menit</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.map((genre) => (
                        <span key={genre.id} className="bg-gray-100 text-xs px-2 py-1 rounded">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-col gap-1">
                      {movie.actors.slice(0, 2).map((actor) => (
                        <span key={actor.id} className="text-sm">
                          {actor.name}
                        </span>
                      ))}
                      {movie.actors.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{movie.actors.length - 2} lainnya
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex justify-center gap-2">
                      <Link 
                        href={`/dashboard/movies/${movie.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Lihat Detail"
                      >
                        <div className="p-1 hover:bg-blue-100 rounded">👁️</div>
                      </Link>
                      <Link 
                        href={`/dashboard/movies/edit/${movie.id}`}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                      >
                        <div className="p-1 hover:bg-yellow-100 rounded">
                          <Edit size={16} />
                        </div>
                      </Link>
                      <button 
                        onClick={() => handleDelete(movie.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
                      >
                        <div className="p-1 hover:bg-red-100 rounded">
                          <Trash2 size={16} />
                        </div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Menampilkan {movies.length} dari {limit} data (Halaman {currentPage} dari {totalPages})
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeft size={16} className="mr-1" />
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}