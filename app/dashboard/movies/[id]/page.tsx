// app/movies/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Play } from 'lucide-react';

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

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
      if (params.id) {
          fetchMovie(Number(params.id));
        }
    }, [params.id]);
    
    const fetchMovie = async (id: number) => {
        setLoading(true);
        try {
            // Simulasi fetch data dari API
            const res = await fetch(`http://10.10.10.134/movies/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const movieData: Movie = await res.json();
            setMovie(movieData);
            console.log(movieData);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (movie && window.confirm('Apakah Anda yakin ingin menghapus film ini?')) {
      try {
        // Simulasi API call untuk menghapus
        // await fetch(`/api/movies/${movie.id}`, { method: 'DELETE' });

        // Redirect ke halaman utama setelah berhasil menghapus
        router.push('/movies');
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  // Fungsi untuk mengekstrak YouTube ID dari URL
  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">Film tidak ditemukan</div>
        <div className="flex justify-center">
          <Link 
            href="/dashboard/movies" 
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2" size={18} />
            Kembali ke Daftar Film
          </Link>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = movie.trailer_url ? getYoutubeEmbedUrl(movie.trailer_url) : null;

  return (
    <div className="container mx-auto p-4">
      {/* Navigasi Kembali & Tombol Aksi */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/dashboard/movies" 
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="mr-2" size={18} />
          Kembali ke Daftar Film
        </Link>
        <div className="flex gap-2">
          <Link 
            href={`/movies/edit/${movie.id}`} 
            className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            <Edit className="mr-2" size={18} />
            Edit
          </Link>
          <button 
            onClick={handleDelete} 
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <Trash2 className="mr-2" size={18} />
            Hapus
          </button>
        </div>
      </div>

      {/* Informasi Film */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Poster Film */}
          <div className="md:w-1/3 p-4">
            <div className="aspect-[2/3] bg-gray-200 relative rounded-lg overflow-hidden">
              <img 
                src={`http://10.10.10.134${movie.poster_url}`} 
                alt={movie.title}
                className="absolute w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-poster.jpg';
                }}
              />
            </div>
          </div>

          {/* Detail Film */}
          <div className="md:w-2/3 p-4">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map(genre => (
                <span key={genre.id} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Tahun Rilis</h2>
                <p>{movie.release_year}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Durasi</h2>
                <p>{movie.duration} menit</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Deskripsi</h2>
              <p className="text-gray-700">{movie.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Pemeran</h2>
              <div className="grid grid-cols-2 gap-2">
                {movie.actors.map(actor => (
                  <div key={actor.id} className="bg-gray-50 p-2 rounded">
                    {actor.name}
                  </div>
                ))}
              </div>
            </div>
            
            {youtubeEmbedUrl && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-2">Trailer</h2>
                <a 
                  href={movie.trailer_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                  <Play size={18} className="mr-2" />
                  Tonton di YouTube
                </a>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={youtubeEmbedUrl}
                    title={`${movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
