'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function SellAccount() {
  const [formData, setFormData] = useState({
    rank: '',
    price: '',
    discord: '',
    telegram: '',
    whatsapp: '',
    description: ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Dosya kontrolleri
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        continue;
      }

      // Dosya formatı kontrolü
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Sadece .jpg ve .png formatları kabul edilmektedir.');
        continue;
      }

      // Önizleme oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);

      // Gerçek uygulamada burada Cloudinary'ye yükleme yapılacak
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/upload', { method: 'POST', body: formData });
      // const data = await response.json();
      // setImages(prev => [...prev, data.url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form doğrulama
    if (!formData.rank || !formData.price) {
      alert('Lütfen zorunlu alanları doldurun.');
      return;
    }

    // Fiyat formatı kontrolü
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      alert('Geçerli bir fiyat giriniz.');
      return;
    }

    // İletişim bilgisi kontrolü
    if (!formData.discord && !formData.telegram && !formData.whatsapp) {
      alert('En az bir iletişim bilgisi girilmelidir.');
      return;
    }

    // API'ye gönderme işlemi
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images,
          price: Number(formData.price),
        }),
      });

      if (response.ok) {
        alert('Hesap başarıyla eklendi!');
        // Form temizleme
        setFormData({
          rank: '',
          price: '',
          discord: '',
          telegram: '',
          whatsapp: '',
          description: ''
        });
        setImages([]);
        setPreviewImages([]);
      } else {
        throw new Error('Bir hata oluştu');
      }
    } catch (error) {
      alert('Hesap eklenirken bir hata oluştu.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Hesap Sat</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Rütbe Seçimi */}
        <div>
          <label className="block mb-2">Rütbe</label>
          <select
            name="rank"
            value={formData.rank}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Rütbe Seçin</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            {/* Diğer rütbeler */}
          </select>
        </div>

        {/* Fiyat */}
        <div>
          <label className="block mb-2">Fiyat (TL)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            min="1"
          />
        </div>

        {/* İletişim Bilgileri */}
        <div className="space-y-4">
          <h3 className="font-semibold">İletişim Bilgileri</h3>
          
          <div>
            <label className="block mb-2">Discord</label>
            <input
              type="text"
              name="discord"
              value={formData.discord}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Kullanıcı#0000"
            />
          </div>

          <div>
            <label className="block mb-2">Telegram</label>
            <input
              type="text"
              name="telegram"
              value={formData.telegram}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="@kullaniciadi"
            />
          </div>

          <div>
            <label className="block mb-2">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="+90xxxxxxxxxx"
            />
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <label className="block mb-2">Açıklama</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        {/* Resim Yükleme */}
        <div>
          <label className="block mb-2">Resimler</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept=".jpg,.jpeg,.png"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Resim Seç
          </button>

          {/* Resim Önizleme */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative h-40">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
        >
          Hesabı Sat
        </button>
      </form>
    </div>
  );
} 