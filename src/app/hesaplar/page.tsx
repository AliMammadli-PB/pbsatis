'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Account } from '@/models/Account';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const currencyIcons = {
  'AZN': '/icons/azn.svg',
  'TRY': '/icons/try.svg',
  'USD': '/icons/usd.svg',
  'EUR': '/icons/eur.svg'
};

export default function AccountsPage() {
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Hesapları getirirken hata oluştu');
      }
      const data = await response.json();
      setAccounts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const formatWhatsAppLink = (phoneNumber?: string | null) => {
    if (!phoneNumber) {
      return `https://wa.me/+79271031033?text=Hesap%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum`;
    }
    // Telefon numarasındaki tüm özel karakterleri temizle
    const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanedNumber}?text=Hesap%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum`;
  };

  const openImageModal = (account: Account) => {
    setSelectedAccount(account);
  };

  const closeImageModal = () => {
    setSelectedAccount(null);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('error')}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hesaplar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={account.rankImage || '/sekil/Screenshot_9.png'}
                alt={`${account.rank} Rütbe`}
                width={120}
                height={120}
                className="object-contain rounded-none"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{account.rank || 'Rütbe'}</h2>
                  <p className="text-gray-600">{account.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Image 
                    src={currencyIcons[account.currency]} 
                    alt={`${account.currency} Logo`} 
                    width={30} 
                    height={30} 
                  />
                  <span className="text-2xl font-bold text-blue-600">{account.price}</span>
                </div>
              </div>
              
              {account.images && account.images.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Hesap Görselleri</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {account.images.map((img, index) => (
                      <div 
                        key={index} 
                        className="relative h-20 group cursor-pointer"
                        onClick={() => openImageModal(account)}
                      >
                        <Image
                          src={img}
                          alt={`Hesap görseli ${index + 1}`}
                          fill
                          className="object-cover rounded transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 33vw, 20vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1 mt-4">
                <h3 className="text-lg font-semibold mb-2">İletişim Bilgileri</h3>
                {account.contactInfo.discord && (
                  <p className="text-sm">Discord: {account.contactInfo.discord}</p>
                )}
                {account.contactInfo.telegram && (
                  <p className="text-sm">Telegram: {account.contactInfo.telegram}</p>
                )}
                {account.contactInfo.whatsapp && (
                  <p className="text-sm">WhatsApp: <a href={formatWhatsAppLink(account.contactInfo.whatsapp)} target="_blank" rel="noopener noreferrer">{account.contactInfo.whatsapp}</a></p>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <a 
                  href={formatWhatsAppLink(account.contactInfo?.whatsapp)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle className="mr-2" size={24} />
                  WhatsApp
                </a>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {accounts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('noAccounts')}</p>
        </div>
      )}
      
      {selectedAccount && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeImageModal}
        >
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-4 py-8">
              {selectedAccount.images.map((img, index) => (
                <div 
                  key={index} 
                  className="flex justify-center"
                >
                  <Image 
                    src={img} 
                    alt={`Hesap görseli ${index + 1}`} 
                    width={500} 
                    height={500} 
                    className="object-contain"
                    priority
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={closeImageModal} 
              className="fixed top-4 right-4 text-white text-3xl hover:text-gray-300 z-60"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}