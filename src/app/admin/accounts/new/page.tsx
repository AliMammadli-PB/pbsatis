'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { handlePriceSubmit } from '@/lib/price_algorithm';

const currencies = [
  { code: 'AZN', symbol: '₼' },
  { code: 'TRY', symbol: '₺' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' }
];

const rankImages = [
  'Screenshot_1.png', 'Screenshot_2.png', 'Screenshot_3.png', 'Screenshot_4.png', 
  'Screenshot_5.png', 'Screenshot_6.png', 'Screenshot_7.png', 'Screenshot_8.png', 
  'Screenshot_9.png', 'Screenshot_10.png', 'Screenshot_11.png', 'Screenshot_12.png',
  'Screenshot_13.png', 'Screenshot_14.png', 'Screenshot_15.png', 'Screenshot_16.png',
  'Screenshot_17.png', 'Screenshot_18.png', 'Screenshot_19.png', 'Screenshot_20.png',
  'Screenshot_21.png', 'Screenshot_22.png', 'Screenshot_23.png', 'Screenshot_24.png',
  'Screenshot_25.png', 'Screenshot_26.png', 'Screenshot_27.png', 'Screenshot_28.png',
  'Screenshot_29.png', 'Screenshot_30.png', 'Screenshot_31.png', 'Screenshot_32.png',
  'Screenshot_33.png', 'Screenshot_34.png', 'Screenshot_35.png', 'Screenshot_36.png'
];

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

export default function NewAccountPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRankSelector, setShowRankSelector] = useState(false);
  const [selectedRank, setSelectedRank] = useState('');
  const [rankImagePreview, setRankImagePreview] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    rank: '',
    rankImage: '/sekil/point-blank-hesab.png',
    price: '',
    currency: 'AZN',
    contactInfo: {
      whatsapp: '+79271031033'
    },
    description: '',
    status: 'published'
  });

  const handleRankSelect = (imageName: string) => {
    setFormData(prev => ({
      ...prev,
      rankImage: `/sekil/${imageName}`
    }));
    setSelectedRank(imageName.replace('.png', '').replace('Screenshot_', 'Rütbe '));
    setShowRankSelector(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        if (file.size > MAX_UPLOAD_SIZE) {
          setError(`${file.name} boyutu çok büyük. Maximum 5MB yükleyebilirsiniz.`);
          return null;
        }

        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Dosya yüklenirken hata oluştu');
          }

          const { filePath } = await response.json();
          return filePath;
        } catch (error) {
          console.error('Dosya yükleme hatası:', error);
          setError('Dosya yüklenirken bir hata oluştu');
          return null;
        }
      })
    );

    const validFiles = newFiles.filter((file): file is string => file !== null);
    setUploadedImages(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Price validation
    const processedPrice = handlePriceSubmit(formData.price, formData.currency);
    if (!processedPrice) {
      setError(t('admin.accounts.priceError'));
      setLoading(false);
      return;
    }

    try {
      const formDataToSubmit = {
        rank: selectedRank || 'Point Blank Hesabı',
        rankImage: formData.rankImage || `/sekil/Screenshot_1.png`,
        price: processedPrice.value,
        currency: processedPrice.currency,
        description: formData.description || '',
        status: 'published',
        contactInfo: {
          discord: formData.contactInfo?.discord || '',
          telegram: formData.contactInfo?.telegram || '',
          whatsapp: formData.contactInfo?.whatsapp || '',
        },
        images: uploadedImages
      };

      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToSubmit)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('admin.accounts.createError'));
      }

      router.push('/admin/accounts');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('admin.accounts.createError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/admin/accounts" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Yeni Hesap Ekle</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rütbe Seçimi */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Rütbe Görseli</label>
              <div className="flex flex-wrap gap-4">
                {rankImagePreview ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={rankImagePreview}
                      alt="Seçili rütbe"
                      fill
                      sizes="(max-width: 128px) 100vw, 128px"
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setRankImagePreview('')}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowRankSelector(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Rütbe Görseli Seç
                  </button>
                )}
              </div>
            </div>

            {showRankSelector && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-auto">
                  <h2 className="text-2xl font-bold mb-4">Rütbe Görselini Seç</h2>
                  <div className="grid grid-cols-6 gap-4">
                    {rankImages.map((imageName) => (
                      <div 
                        key={imageName} 
                        className="cursor-pointer hover:opacity-75 transition-opacity border border-gray-300"
                        onClick={() => handleRankSelect(imageName)}
                      >
                        <Image 
                          alt={`Rütbe Görseli ${imageName}`} 
                          src={`/sekil/${imageName}`} 
                          width={100} 
                          height={100} 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowRankSelector(false)} 
                    className="mt-4 bg-gray-200 text-black px-4 py-2 rounded"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}

            {/* Hesap Görselleri Yükleme */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Hesap Görselleri</label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="flex flex-wrap gap-4 mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <Image
                      src={image}
                      alt={`Yüklenen görsel ${index + 1}`}
                      fill
                      sizes="(max-width: 128px) 100vw, 128px"
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Diğer Form Alanları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">Fiyat</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="flex-1 rounded-l-md border border-gray-300 p-2"
                    placeholder="0.00"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="rounded-r-md border border-l-0 border-gray-300 p-2"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Durum</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="published">Yayınlandı</option>
                  <option value="sold">Satıldı</option>
                  <option value="reserved">Rezerve</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="Hesap hakkında detaylı bilgi..."
                />
              </div>

              {/* İletişim Bilgileri */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-medium">İletişim Bilgileri</h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* WhatsApp numarası otomatik olarak eklendi */}
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}