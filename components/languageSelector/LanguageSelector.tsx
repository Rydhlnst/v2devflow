import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '../ui/select';
import { LANGUAGE_OPTIONS } from '@/constants/language';
import Image from 'next/image';

const LanguageSelector = ({ setLanguage }: { setLanguage: (language: string) => void }) => {
  const [language, setLanguageLocal] = useState("id");

  const selectedLang = LANGUAGE_OPTIONS.find((lang) => lang.value === language);
  const flagUrl = selectedLang
    ? `https://flagcdn.com/w40/${selectedLang.countryCode}.png`
    : "";

  return (
    <div>
      <Select
        value={language}
        onValueChange={(val) => {
          setLanguageLocal(val);
          setLanguage(val);
        }}
      >
        <SelectTrigger className="w-[60px] px-2 py-1">
          {flagUrl && (
            <Image
              src={flagUrl}
              alt={selectedLang?.label || "Flag"}
              width={24}
              height={18}
              className="rounded-sm object-cover"
            />
          )}
        </SelectTrigger>
        <SelectContent>
          {LANGUAGE_OPTIONS.map((lang, index) => (
            <SelectItem key={index} value={lang.value}>
              <div className="flex items-center gap-2">
                <Image
                  src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                  alt={lang.label}
                  width={24}
                  height={18}
                  className="rounded-sm object-cover"
                />
                <span>{lang.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
