// app/movies/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';

interface Actor {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface MovieFormData {
  title: string;
  description: string;
  duration: string;
  release_year: string;
  trailer_url: string;
  poster_url: string;
  actor_ids: number[];
  genre_ids: string[];
}



export default function CreateMoviePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actors, setActors] = useState<Actor[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    description: '',
    duration: '',
    release_year: new Date().getFullYear().toString(),
    trailer_url: '',
    poster_url: '',
    actor_ids: [],
    genre_ids: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data dari API untuk aktor
        const actorsResponse = await fetch('http://10.10.10.134/actors', {
            method: 'GET',
        });
        const actorsData = await actorsResponse.json();
        
        // Ambil data dari API untuk genre
        const genresResponse = await fetch('http://10.10.10.134/genres', { method: 'GET' });
        const genresData = await genresResponse.json();
        
        // Menyimpan data ke state
        setActors(actorsData.data);
        setGenres(genresData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'actor_ids' | 'genre_ids') => {
    const { value, checked } = e.target;
    const id = parseInt(value);
    
    setFormData(prev => {
      if (checked) {
        return { ...prev, [type]: [...prev[type], id] };
      } else {
        return { ...prev, [type]: prev[type].filter(item => item !== id) };
      }
    });
    
    // Clear error for this field if exists
    if (formErrors[type]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[type];
        return newErrors;
      });
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server
      // For now, we'll just create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPosterPreview(previewUrl);
      
      // In a real app, this would be the URL returned from your file upload API
      setFormData(prev => ({ ...prev, poster_url: `/uploads/${file.name}` }));
      
      // Clear error for this field if exists
      if (formErrors.poster_url) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.poster_url;
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Judul film harus diisi';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Deskripsi film harus diisi';
    }
    
    if (!formData.duration.trim()) {
      errors.duration = 'Durasi film harus diisi';
    } else if (isNaN(parseInt(formData.duration)) || parseInt(formData.duration) <= 0) {
      errors.duration = 'Durasi film harus berupa angka positif';
    }
    
    if (!formData.release_year.trim()) {
      errors.release_year = 'Tahun rilis harus diisi';
    } else if (
      isNaN(parseInt(formData.release_year)) || 
      parseInt(formData.release_year) < 1900 || 
      parseInt(formData.release_year) > new Date().getFullYear() + 5
    ) {
      errors.release_year = `Tahun rilis harus antara 1900 dan ${new Date().getFullYear() + 5}`;
    }
    
    if (formData.trailer_url.trim() && !isValidUrl(formData.trailer_url)) {
      errors.trailer_url = 'URL trailer tidak valid';
    }
    
    if (formData.genre_ids.length === 0) {
      errors.genre_ids = 'Pilih setidaknya satu genre';
    }
    
    if (formData.actor_ids.length === 0) {
      errors.actor_ids = 'Pilih setidaknya satu aktor';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
  
    // Membuat objek FormData
    const formDataToSend = new FormData();
  
    // Menambahkan data teks ke FormData
    formDataToSend.append('title', formData.title);
    formDataToSend.append('release_year', formData.release_year);
    formDataToSend.append('duration', formData.duration);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('trailer_url', formData.trailer_url);
  
    // Menambahkan data array (genre_ids dan actor_ids) ke FormData
    formDataToSend.append('genres', JSON.stringify(formData.genre_ids));
    formDataToSend.append('actors', JSON.stringify(formData.actor_ids));
  
    // Menambahkan file poster ke FormData
    const posterFile = (e.target as HTMLFormElement).elements.namedItem("poster") as HTMLInputElement;
    if (posterFile?.files?.[0]) {
      formDataToSend.append('poster', posterFile.files[0]);
    }
  
    console.log('FormData:', formDataToSend.get('genres'));
    try {
      // Simulasi API call untuk membuat film baru dengan menggunakan FormData
      const response = await fetch('http://10.10.10.134/movies', {
        method: 'POST',
        headers: {
            'Authentication': `Bearer ${sessionStorage.getItem('access_token')}`,
        },
        body: formDataToSend, // Mengirim FormData
      });
  
      if (!response.ok) {
        throw new Error('Failed to create movie');
      }
  
      // Simulasi penundaan
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Redirect ke halaman daftar film setelah berhasil
      router.push('/dashboard/movies');
    } catch (error) {
      console.error('Error creating movie:', error);
      alert('Gagal menambahkan film. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  


  const inputClasses = "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
  const errorClasses = "text-red-500 text-sm mt-1";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/dashboard/movies" 
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="mr-2" size={18} />
          Kembali ke Daftar Film
        </Link>
        <h1 className="text-2xl font-bold">Tambah Film Baru</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div>
              {/* Judul Film */}
              <div className="mb-4">
                <label htmlFor="title" className={labelClasses}>
                  Judul Film <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`${inputClasses} ${formErrors.title ? 'border-red-500' : ''}`}
                  placeholder="Masukkan judul film"
                />
                {formErrors.title && <p className={errorClasses}>{formErrors.title}</p>}
              </div>
              
              {/* Deskripsi */}
              <div className="mb-4">
                <label htmlFor="description" className={labelClasses}>
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`${inputClasses} ${formErrors.description ? 'border-red-500' : ''} min-h-32`}
                  placeholder="Masukkan deskripsi film"
                  rows={5}
                ></textarea>
                {formErrors.description && <p className={errorClasses}>{formErrors.description}</p>}
              </div>
              
              {/* Durasi & Tahun Rilis */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="duration" className={labelClasses}>
                    Durasi (menit) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${formErrors.duration ? 'border-red-500' : ''}`}
                    placeholder="Contoh: 120"
                    min="1"
                  />
                  {formErrors.duration && <p className={errorClasses}>{formErrors.duration}</p>}
                </div>
                <div>
                  <label htmlFor="release_year" className={labelClasses}>
                    Tahun Rilis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="release_year"
                    name="release_year"
                    value={formData.release_year}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${formErrors.release_year ? 'border-red-500' : ''}`}
                    placeholder="Contoh: 2023"
                    min="1900"
                    max={new Date().getFullYear() + 5}
                  />
                  {formErrors.release_year && <p className={errorClasses}>{formErrors.release_year}</p>}
                </div>
              </div>
              
              {/* URL Trailer */}
              <div className="mb-4">
                <label htmlFor="trailer_url" className={labelClasses}>
                  URL Trailer YouTube
                </label>
                <input
                  type="url"
                  id="trailer_url"
                  name="trailer_url"
                  value={formData.trailer_url}
                  onChange={handleInputChange}
                  className={`${inputClasses} ${formErrors.trailer_url ? 'border-red-500' : ''}`}
                  placeholder="Contoh: https://youtu.be/FuC8H8eXZFU"
                />
                {formErrors.trailer_url && <p className={errorClasses}>{formErrors.trailer_url}</p>}
              </div>
              
              {/* Poster Film */}
              <div className="mb-4">
                <label htmlFor="poster" className={labelClasses}>
                  Poster Film
                </label>
                <div className="flex items-center space-x-4">
                  <div className={`w-32 h-48 bg-gray-100 border rounded relative ${posterPreview ? '' : 'flex items-center justify-center'}`}>
                    {posterPreview ? (
                      <img
                        src={posterPreview}
                        alt="Preview poster"
                        className="absolute w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center p-2">
                        Tidak ada gambar
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="poster-upload" 
                      className="cursor-pointer flex items-center justify-center p-2 border border-dashed rounded bg-gray-50 hover:bg-gray-100"
                    >
                      <Plus size={18} className="mr-2 text-gray-500" />
                      <span>Pilih File</span>
                      <input
                        type="file"
                        id="poster-upload"
                        name="poster"  // Tambahkan name ini
                        accept="image/*"
                        className="hidden"
                        onChange={handlePosterChange}
                    />

                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Format: JPG, PNG, atau GIF. Ukuran maksimal: 2MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Kolom Kanan */}
            <div>
              {/* Genres */}
              <div className="mb-6">
  <label className={labelClasses}>
    Genre <span className="text-red-500">*</span>
  </label>
  <div className={`border rounded p-3 ${formErrors.genre_ids ? 'border-red-500' : ''}`}>
    <div className="grid grid-cols-2 gap-2">
      {genres.map(genre => (
        <div key={genre.id} className="flex items-center">
          <input
            type="checkbox"
            id={`genre-${genre.id}`}
            value={genre.id}
            checked={formData.genre_ids.includes(genre.name)}
            onChange={(e) => handleCheckboxChange(e, 'genre_ids')}
            className="mr-2"
          />
          <label htmlFor={`genre-${genre.id}`} className="text-sm">
            {genre.name}
          </label>
        </div>
      ))}
    </div>
  </div>
  {formErrors.genre_ids && <p className={errorClasses}>{formErrors.genre_ids}</p>}
</div>

              
              {/* Actors */}
              <div className="mb-4">
  <label className={labelClasses}>
    Aktor <span className="text-red-500">*</span>
  </label>
  <div className={`border rounded p-3 ${formErrors.actor_ids ? 'border-red-500' : ''}`}>
    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
      {actors.map(actor => (
        <div key={actor.id} className="flex items-center">
          <input
            type="checkbox"
            id={`actor-${actor.id}`}
            value={actor.id}
            checked={formData.actor_ids.includes(actor.id)}
            onChange={(e) => handleCheckboxChange(e, 'actor_ids')}
            className="mr-2"
          />
          <label htmlFor={`actor-${actor.id}`} className="text-sm">
            {actor.name}
          </label>
        </div>
      ))}
    </div>
  </div>
  {formErrors.actor_ids && <p className={errorClasses}>{formErrors.actor_ids}</p>}
</div>

            </div>
          </div>
          
          {/* Footer Form & Tombol Submit */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/dashboard/movies"
              className="flex items-center px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              <X size={18} className="mr-2" />
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Simpan Film
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}